#!/usr/bin/env bash
set -euo pipefail

PLATFORM="${1:-}"

# --- Validate PLATFORM ---
case "$PLATFORM" in
        mac|win|linux) ;;
        *) echo "Usage: $0 [mac|win|linux]" >&2
        exit 1
         ;;
esac

cd ~/proj/dyglot

export NVM_DIR="$HOME/.nvm"

if [ -s "$NVM_DIR/nvm.sh" ]; then
  # nvm.sh is not "nounset safe" → disable -u while sourcing
  set +u
  # shellcheck disable=SC1090
  . "$NVM_DIR/nvm.sh"
  set -u
else
  echo "ERROR: nvm not found at $NVM_DIR/nvm.sh" >&2
  exit 1
fi

# Ensure a compatible Node (>=22). Choose 24 to match your intention.
nvm install 24 >/dev/null
nvm use 24 >/dev/null
nvm alias default 24 >/dev/null

node -v
git pull
npm ci
npm run "desktop:dist:$PLATFORM"