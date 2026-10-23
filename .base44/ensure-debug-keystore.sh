#!/bin/sh
# app/build.gradle.kts signs the debug build type with <rootDir>/debug.keystore, but the
# file is git-ignored and therefore absent in a fresh checkout. Generate the standard
# Android debug keystore (not a secret — same well-known debug credentials everywhere).
set -eu

KEYSTORE="${1:-/workspace/debug.keystore}"

if [ -f "$KEYSTORE" ]; then
  exit 0
fi

echo "[keystore] creating $KEYSTORE"
keytool -genkeypair \
  -keystore "$KEYSTORE" \
  -storepass android \
  -keypass android \
  -alias androiddebugkey \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=Android Debug,O=Android,C=US" > /dev/null
