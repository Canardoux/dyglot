#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ANDROID_DIR="$ROOT_DIR/android"
PKG="xyz.canardoux.dyglot"
APK="$ANDROID_DIR/app/build/outputs/apk/debug/app-debug.apk"
AAPT="${ANDROID_HOME:-$HOME/Library/Android/sdk}/build-tools/36.0.0/aapt"


cd "$ANDROID_DIR"

echo "✅ Checking device..."
adb start-server >/dev/null
adb devices

# Fail fast if unauthorized/offline
if adb devices | awk 'NR>1 {print $2}' | grep -Eq 'unauthorized|offline'; then
  echo "❌ Device not authorized/offline. Check phone USB debug authorization."
  exit 2
fi

echo "🏗️  Building debug APK..."
./gradlew :app:assembleDebug --console=plain

APK="$ANDROID_DIR/app/build/outputs/apk/debug/app-debug.apk"
if [[ ! -f "$APK" ]]; then
  echo "❌ APK not found: $APK"
  exit 3
fi

PKG="$("$AAPT" dump badging "$APK" | awk -F"'" '/package: name=/{print $2; exit}')"
echo "📛 Detected package: $PKG"

echo "📦 Installing..."
adb install -r "$APK" || {
  echo "❌ Install failed. If you see INSTALL_FAILED_UPDATE_INCOMPATIBLE, run:"
  echo "   adb uninstall $PKG"
  exit 4
}

echo "🚀 Launching..."
adb shell monkey -p "$PKG" 1
adb shell pm path "$PKG" >/dev/null || { echo "❌ Package not installed: $PKG"; exit 5; }

echo "📜 Tailing logs (Ctrl+C to stop)..."
PID="$(adb shell pidof "$PKG" | tr -d '\r' || true)"
if [[ -n "$PID" ]]; then
  adb logcat --pid="$PID"
else
  adb logcat -T 200 | grep -i --line-buffered -E "Capacitor|chromium|$PKG|Dyglot" || true
fi
