/**
 * Creates .env and .env.local from .env.example if they do not exist.
 * Existing files are left untouched except for appending newly added keys.
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const example = path.join(root, ".env.example");
const targets = [".env", ".env.local"];

if (!fs.existsSync(example)) {
  console.log("[setup] .env.example not found, skipping");
  process.exit(0);
}

function parseEnvKeys(content) {
  const map = new Map();
  for (const line of content.split("\n")) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=/);
    if (match) map.set(match[1], line);
  }
  return map;
}

const template = fs.readFileSync(example, "utf-8");
const templateKeys = parseEnvKeys(template);

for (const file of targets) {
  const dest = path.join(root, file);
  if (!fs.existsSync(dest)) {
    fs.writeFileSync(dest, template);
    console.log(`[setup] Created ${file}`);
    continue;
  }

  const existing = fs.readFileSync(dest, "utf-8");
  const existingKeys = parseEnvKeys(existing);
  const newKeys = [];
  for (const [key, line] of templateKeys) {
    if (!existingKeys.has(key)) newKeys.push(line);
  }

  if (newKeys.length > 0) {
    const updated = `${existing.trimEnd()}\n\n# Added by setup-env.js\n${newKeys.join("\n")}\n`;
    fs.writeFileSync(dest, updated);
    console.log(`[setup] ${file}: added ${newKeys.length} new key(s)`);
  } else {
    console.log(`[setup] ${file} already exists and is up to date`);
  }
}
