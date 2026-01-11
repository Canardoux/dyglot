#!/usr/bin/env bash
set -euo pipefail

# ---- Paths ---------------------------------------------------------------
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_DIR="$ROOT_DIR/android"

cd "$ANDROID_DIR"

# ---- Resolve Android SDK + aapt ------------------------------------------
# Try common env vars, then fallback paths.
SDK="${ANDROID_SDK_ROOT:-${ANDROID_HOME:-}}"
if [[ -z "${SDK}" ]]; then
  # macOS default
  if [[ -d "$HOME/Library/Android/sdk" ]]; then
    SDK="$HOME/Library/Android/sdk"
  # Linux default
  elif [[ -d "$HOME/Android/Sdk" ]]; then
    SDK="$HOME/Android/Sdk"
  fi
fi

if [[ -z "${SDK}" || ! -d "${SDK}" ]]; then
  echo "ERROR: Android SDK not found. Set ANDROID_SDK_ROOT or ANDROID_HOME." >&2
  exit 1
fi

# Pick the newest build-tools directory and use its aapt
AAPT="$(ls -1d "$SDK"/build-tools/* 2>/dev/null | sort -V | tail -n1)/aapt"
if [[ ! -x "$AAPT" ]]; then
  echo "ERROR: aapt not found. Install Android build-tools in: $SDK/build-tools" >&2
  exit 1
fi

# ---- Device checks --------------------------------------------------------
echo "✅ Checking device..."
adb start-server >/dev/null
adb devices

# Fail fast if unauthorized/offline
if adb devices | awk 'NR>1 {print $2}' | grep -Eq 'unauthorized|offline'; then
  echo "❌ Device not authorized/offline. Check USB debugging authorization on the phone."
  exit 2
fi

# ---- Build ---------------------------------------------------------------
echo "🏗️  Building debug APK..."
./gradlew :app:assembleDebug --console=plain

APK="$ANDROID_DIR/app/build/outputs/apk/debug/app-debug.apk"
if [[ ! -f "$APK" ]]; then
  echo "❌ APK not found: $APK"
  exit 3
fi

# Detect package name from APK
PKG="$("$AAPT" dump badging "$APK" | awk -F"'" '/package: name=/{print $2; exit}')"
if [[ -z "$PKG" ]]; then
  echo "❌ Could not detect package name from APK."
  exit 3
fi
echo "📛 Detected package: $PKG"

# ---- Install + Launch -----------------------------------------------------
echo "📦 Installing..."
adb install -r "$APK" || {
  echo "❌ Install failed."
  echo "   If you see INSTALL_FAILED_UPDATE_INCOMPATIBLE, run:"
  echo "   adb uninstall $PKG"
  exit 4
}

echo "🚀 Launching..."
adb shell monkey -p "$PKG" 1 >/dev/null || true

# Verify installed
adb shell pm path "$PKG" >/dev/null || { echo "❌ Package not installed: $PKG"; exit 5; }

# ---- Logs ----------------------------------------------------------------
echo "📜 Tailing logs (Ctrl+C to stop)..."
PID="$(adb shell pidof "$PKG" 2>/dev/null | tr -d '\r' || true)"
if [[ -n "$PID" ]]; then
  adb logcat --pid="$PID"
else
  adb logcat -T 200 | grep -i --line-buffered -E "Capacitor|chromium|$PKG|Dyglot" || true
fi