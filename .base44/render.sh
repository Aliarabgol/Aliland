#!/bin/sh
# Builds the app from source and renders its real Compose screens to PNGs, then
# publishes them (plus the debug APK) for the preview page served on port 3000.
#
# Android apps cannot run in the browser-based preview (the sandbox has no
# /dev/kvm, so no emulator), so the preview shows the app's own screens rendered
# headlessly from app/src/main by Robolectric + Roborazzi and the installable APK.
set -u

SITE_DIR=$(dirname "${PREVIEW_SCREENSHOT_DIR:-/workspace/.base44/preview/screens}")
SHOT_DIR="${PREVIEW_SCREENSHOT_DIR:-$SITE_DIR/screens}"
LOG_FILE=/tmp/render.log
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
mkdir -p "$SHOT_DIR" "$SITE_DIR/apk"

"$SCRIPT_DIR/ensure-debug-keystore.sh" /workspace/debug.keystore

echo "[render] gradle: assembleDebug + AppScreensGalleryTest (record)"
status=ok
if ! gradle --no-daemon --console=plain \
      :app:assembleDebug \
      :app:testDebugUnitTest --tests '*AppScreensGalleryTest*' \
      -Proborazzi.test.record=true > "$LOG_FILE" 2>&1; then
  status=failed
  echo "[render] FAILED — tail of $LOG_FILE:"
  tail -n 60 "$LOG_FILE"
fi

APK_SRC=$(ls app/build/outputs/apk/debug/*.apk 2>/dev/null | head -1 || true)
if [ -n "${APK_SRC:-}" ]; then
  cp "$APK_SRC" "$SITE_DIR/apk/app-debug.apk"
  echo "[render] apk -> $SITE_DIR/apk/app-debug.apk"
fi

# manifest.json drives the preview page: it also tells the page whether the
# render finished, failed, or is still running.
{
  printf '{\n'
  printf '  "status": "%s",\n' "$status"
  printf '  "generatedAt": "%s",\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  if [ -f "$SITE_DIR/apk/app-debug.apk" ]; then printf '  "apk": true,\n'; else printf '  "apk": false,\n'; fi
  printf '  "screens": [\n'
  first=1
  for f in "$SHOT_DIR"/*.png; do
    [ -f "$f" ] || continue
    [ "$first" -eq 1 ] || printf ',\n'
    printf '    {"name": "%s"}' "$(basename "$f" .png)"
    first=0
  done
  printf '\n  ],\n'
  printf '  "logTail": "%s"\n' "$(tail -n 12 "$LOG_FILE" 2>/dev/null | sed 's/\\/\\\\/g; s/"/\\"/g' | tr -d '\r' | tr '\n' '|')"
  printf '}\n'
} > "$SITE_DIR/manifest.json"

echo "[render] done with status=$status"
[ "$status" = "ok" ]
