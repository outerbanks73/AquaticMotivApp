// PM2 process config for the AquaticMotivApp care-guides site.
// Next.js standalone build: the server is .next/standalone/server.js and it
// loads runtime env (.env / .env.local) from its own cwd. nginx
// (careguides.aquaticmotiv.com) reverse-proxies to PORT 3200.
module.exports = {
  apps: [
    {
      name: "careguides",
      cwd: "/home/voxly/Code/AquaticMotivApp/.next/standalone",
      script: "server.js",
      interpreter: "node",
      env: {
        PORT: "3200",
        NODE_ENV: "production",
      },
    },
  ],
};
