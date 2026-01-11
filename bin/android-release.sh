#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_DIR="$ROOT_DIR/android"
AAB_REL="app/build/outputs/bundle/release/app-release.aab"
AAB="$ANDROID_DIR/$AAB_REL"

echo "🏗️ Building RELEASE AAB..."
cd "$ANDROID_DIR"
./gradlew :app:bundleRelease --console=plain

if [[ ! -f "$AAB" ]]; then
  echo "❌ AAB not found: $AAB" >&2
  exit 3
fi

echo "✅ AAB generated:"
echo "   $AAB"
echo "ℹ️ Next step: upload this AAB to Google Play Console (Internal testing / Closed testing)."