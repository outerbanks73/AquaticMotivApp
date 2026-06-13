// Shared Admin API helper for sync scripts.
// Mints a 24h admin token via the client credentials grant (SaveAFish custom app)
// and exposes a GraphQL helper with basic throttling retry.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export function loadEnv() {
  const env = {};
  const raw = readFileSync(join(ROOT, ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z_]+)=["']?([^"'\n]*)["']?\s*$/);
    if (m) env[m[1]] = m[2];
  }
  for (const key of ["SHOPIFY_STORE_DOMAIN", "SHOPIFY_APP_CLIENT_ID", "SHOPIFY_APP_CLIENT_SECRET"]) {
    if (!env[key]) throw new Error(`Missing ${key} in .env.local`);
  }
  return env;
}

export async function mintAdminToken(env) {
  const res = await fetch(`https://${env.SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env.SHOPIFY_APP_CLIENT_ID,
      client_secret: env.SHOPIFY_APP_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });
  if (!res.ok) throw new Error(`Token mint failed: HTTP ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.access_token;
}

const API_VERSION = "2026-01";

export async function adminGraphql(env, token, query, variables = {}, attempt = 1) {
  const res = await fetch(`https://${env.SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
  });
  if (res.status === 429 && attempt <= 5) {
    await new Promise((r) => setTimeout(r, 1000 * attempt));
    return adminGraphql(env, token, query, variables, attempt + 1);
  }
  if (!res.ok) throw new Error(`Admin API HTTP ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) {
    const throttled = json.errors.some((e) => e.extensions?.code === "THROTTLED");
    if (throttled && attempt <= 5) {
      await new Promise((r) => setTimeout(r, 1500 * attempt));
      return adminGraphql(env, token, query, variables, attempt + 1);
    }
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

/** Paginate all products, returning Map<handle, {id, title}> */
export async function fetchProductIndex(env, token) {
  const index = new Map();
  let cursor = null;
  for (;;) {
    const data = await adminGraphql(
      env,
      token,
      `query($after: String) {
        products(first: 250, after: $after) {
          edges { node { id handle title } }
          pageInfo { hasNextPage endCursor }
        }
      }`,
      { after: cursor },
    );
    for (const { node } of data.products.edges) index.set(node.handle, node);
    if (!data.products.pageInfo.hasNextPage) break;
    cursor = data.products.pageInfo.endCursor;
  }
  return index;
}
