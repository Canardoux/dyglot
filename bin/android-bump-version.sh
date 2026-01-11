#!/usr/bin/env bash
set -euo pipefail

FILE="android/app/build.gradle"

# Increment versionCode in place
# English comments as you prefer
# This assumes the line looks like: versionCode 9
perl -i -pe 's/^\s*versionCode\s+(\d+)/"    versionCode " . ($1+1)/e' "$FILE"

echo "✅ Bumped versionCode in $FILE"
grep -n "versionCode" "$FILE"
