# Base44 sandbox toolchain image for the AstroNiyat Android app.
#
# It only contains build tooling (JDK, Gradle, Android SDK) — never application
# source or a prebuilt app image. The repository is bind-mounted at /workspace by
# docker-compose.base44.yml, so every build runs from the cloned source.
FROM eclipse-temurin:21-jdk

ARG GRADLE_VERSION=9.7.1
# cmdline-tools 23.0 (build 16111833) is the current "latest" from
# https://dl.google.com/android/repository/repository2-3.xml
ARG CMDLINE_TOOLS_URL=https://dl.google.com/android/repository/commandlinetools-linux-16111833_latest.zip
# app/build.gradle.kts uses compileSdk release(36) minorApiLevel 1 -> platforms;android-36.1
ARG ANDROID_PLATFORM=android-36.1
ARG ANDROID_BUILD_TOOLS=36.1.0

ENV ANDROID_HOME=/opt/android-sdk \
    ANDROID_SDK_ROOT=/opt/android-sdk \
    GRADLE_HOME=/opt/gradle \
    PATH=/opt/gradle/bin:/opt/android-sdk/cmdline-tools/latest/bin:/opt/android-sdk/platform-tools:/opt/gradle/bin:$PATH

RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates curl unzip \
 && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL "https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip" -o /tmp/gradle.zip \
 && unzip -q /tmp/gradle.zip -d /opt \
 && mv "/opt/gradle-${GRADLE_VERSION}" /opt/gradle \
 && rm /tmp/gradle.zip \
 && gradle --version

RUN mkdir -p "${ANDROID_HOME}/cmdline-tools" \
 && curl -fsSL "${CMDLINE_TOOLS_URL}" -o /tmp/cmdline-tools.zip \
 && unzip -q /tmp/cmdline-tools.zip -d /tmp/cmdline-tools-unpacked \
 && mv /tmp/cmdline-tools-unpacked/cmdline-tools "${ANDROID_HOME}/cmdline-tools/latest" \
 && rm -rf /tmp/cmdline-tools.zip /tmp/cmdline-tools-unpacked

RUN yes | sdkmanager --licenses > /dev/null \
 && sdkmanager --install "platform-tools" "platforms;${ANDROID_PLATFORM}" "build-tools;${ANDROID_BUILD_TOOLS}" \
 && rm -rf /root/.android/cache

WORKDIR /workspace
