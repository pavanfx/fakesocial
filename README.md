# SocialGen AI Mobile App

This is the React Native Expo version of the SocialGen AI app.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in this directory (`mobile/`) and add your Gemini API Key:
    ```
    EXPO_PUBLIC_API_KEY=your_api_key_here
    ```
    (Note: You can use the same key from the web project).

## Running Locally

-   **Start the app**:
    ```bash
    npx expo start
    ```
-   Scan the QR code with the **Expo Go** app on your phone.

## Building APK

To build an APK for Android:

1.  **Install EAS CLI** (if not installed):
    ```bash
    npm install -g eas-cli
    ```

2.  **Login to Expo**:
    ```bash
    eas login
    ```

3.  **Configure Build**:
    ```bash
    eas build:configure
    ```

4.  **Build for Android**:
    ```bash
    eas build -p android --profile preview
    ```
    (This will generate an APK that you can install on your device).

Alternatively, for a local build (requires Android Studio):
```bash
npx expo prebuild
cd android
./gradlew assembleRelease
```
The APK will be in `android/app/build/outputs/apk/release/app-release.apk`.
