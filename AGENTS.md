# AstroNiyat (آسترونیت) — Android app

Native Android app (Kotlin, Jetpack Compose, Room, Retrofit/Gemini). Persian UI, RTL.

## Running it in the Base44 sandbox

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- `preview` (nginx, host port **3000**) serves the preview page.
- `android` is a long-lived build toolchain container (JDK 21 + Gradle 9.7.1 + Android SDK).
- `screenshots` is a one-shot service that builds the debug APK and renders the app screens.

### Why the preview is not a live app

The app is an APK, and the sandbox has **no `/dev/kvm`**, so no Android emulator can run —
a browser preview cannot execute this app. Instead the preview shows the app's real Compose
screens, rendered headlessly on the JVM (Robolectric `GraphicsMode.NATIVE` + Roborazzi at the
Pixel 8 / API 36 profile) by `app/src/test/java/com/example/AppScreensGalleryTest.kt`, plus the
built debug APK (`/apk/app-debug.apk`) for installing on a real device.

Render or re-render the screens after changing app code:

```bash
docker compose -f docker-compose.base44.yml up --force-recreate screenshots
# follow progress:
docker compose -f docker-compose.base44.yml logs -f screenshots
```

Outputs land in `.base44/preview/` (git-ignored): `screens/*.png` + `manifest.json` (the page
polls it and shows the Gradle tail if a build fails).

### Building / testing directly

```bash
docker compose -f docker-compose.base44.yml exec android gradle :app:assembleDebug
docker compose -f docker-compose.base44.yml exec android gradle :app:testDebugUnitTest
```

- The repository has **no Gradle wrapper**; the toolchain image pins Gradle 9.7.1 to match AGP 9.1.1.
- `gradle.properties` already sets `org.gradle.workers.max=4` and in-process Kotlin compilation
  (the sandbox has 4 CPUs).
- First build/render downloads Gradle dependencies and Robolectric's `android-all` runtime
  (hundreds of MB) into the `gradle-home` volume — expect several minutes, later runs are fast.
- `PREVIEW_SCREENSHOT_DIR` selects the screenshot output directory (defaults to
  `../.base44/preview/screens`, i.e. relative to the Gradle module directory).

## Secrets and configuration

- `GEMINI_API_KEY` (external service). The `secrets-gradle-plugin` reads `.env`, falling back to
  `.env.example` (which contains the placeholder `MY_GEMINI_API_KEY`). The value is compiled into
  `BuildConfig.GEMINI_API_KEY` **at build time** — a real key must be available to the Gradle
  build, and the APK has to be rebuilt after changing it.
- No local infrastructure is required: the app stores data in an on-device Room database.
- `metadata.json` marks the project as requiring the server-side Gemini API capability.

## Template cleanup done for the sandbox

- `GreetingScreenshotTest` referenced `Greeting(...)`/`MyApplicationTheme`, which no longer exist
  in `app/src/main` (the app was rewritten), so the unit-test source set could not compile; the
  file and its stale `app/src/test/screenshots/greeting.png` were removed and replaced by the
  screen gallery test.
- `ExampleRobolectricTest` asserted the template app name `My Application`; it now asserts the
  real name `آسترونیت`.

## Notes

- Firebase is declared (`firebase-bom`, App Check/recaptcha) but no `google-services.json` is
  present; `googleServices.missing.passthrough=true` keeps the build working. Nothing in the
  default flow requires Firebase.
