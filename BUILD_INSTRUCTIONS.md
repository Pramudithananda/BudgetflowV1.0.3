# BudgetFlow APK Build Instructions

Your Expo React Native project has been prepared for APK building.

## Option 1: Build using EAS Build (Recommended)

1. Create an Expo account at https://expo.dev
2. Run: `npx eas login`
3. Run: `npx eas build --platform android --profile production`
4. Download the APK from your Expo dashboard

## Option 2: Build locally with Android Studio

1. Install Android Studio and Android SDK
2. Run: `npx expo prebuild --platform android`
3. Open the `android` folder in Android Studio
4. Build > Generate Signed Bundle/APK > APK
5. Follow the wizard to create a signed APK

## Option 3: Build using Gradle (Command Line)

1. Ensure Android SDK is installed
2. Run: `npx expo prebuild --platform android`
3. Navigate to android folder: `cd android`
4. Run: `./gradlew assembleRelease`
5. Find APK in: `android/app/build/outputs/apk/release/`

## Project Details
- App Name: BudgetFlow
- Package: com.budgetflow.app
- Version: 1.0.0

## Notes
- The app uses Expo SDK 52
- All dependencies have been installed
- Assets are configured in the `assets` folder
