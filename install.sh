#!/bin/bash
# AquaticMotiv Care Guides - installer for macOS/Linux

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 20+ is required: https://nodejs.org"
  exit 1
fi

MAJOR="$(node -v | sed 's/v//' | cut -d. -f1)"
if [ "$MAJOR" -lt 20 ]; then
  echo "Node.js 20+ is required. Found $(node -v)."
  exit 1
fi

cd "$SCRIPT_DIR"
npm install
node scripts/setup-env.js
chmod +x start.sh stop.sh 2>/dev/null || true

echo "Installation complete. Run ./start.sh and open http://localhost:3000/a/careguides."
