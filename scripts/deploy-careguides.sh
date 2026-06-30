#!/usr/bin/env bash
set -euo pipefail

export ASSET_ORIGIN="${ASSET_ORIGIN:-https://careguides.aquaticmotiv.com}"

npm run build

rm -rf .next/standalone/.next/static .next/standalone/public
mkdir -p .next/standalone/.next
cp -a .next/static .next/standalone/.next/static
cp -a public .next/standalone/public

pm2 restart careguides --update-env
