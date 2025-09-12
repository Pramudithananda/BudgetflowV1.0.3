#!/bin/bash

echo "Building APK for BudgetFlow app..."

# Step 1: Export the Expo project for production
echo "Step 1: Exporting Expo project..."
npx expo export --platform android --output-dir ./dist-android

# Step 2: Create a simple APK build instruction file
echo "Step 2: Creating build instructions..."

cat << EOF > BUILD_INSTRUCTIONS.md
# BudgetFlow APK Build Instructions

Your Expo React Native project has been prepared for APK building.

## Option 1: Build using EAS Build (Recommended)

1. Create an Expo account at https://expo.dev
2. Run: \`npx eas login\`
3. Run: \`npx eas build --platform android --profile production\`
4. Download the APK from your Expo dashboard

## Option 2: Build locally with Android Studio

1. Install Android Studio and Android SDK
2. Run: \`npx expo prebuild --platform android\`
3. Open the \`android\` folder in Android Studio
4. Build > Generate Signed Bundle/APK > APK
5. Follow the wizard to create a signed APK

## Option 3: Build using Gradle (Command Line)

1. Ensure Android SDK is installed
2. Run: \`npx expo prebuild --platform android\`
3. Navigate to android folder: \`cd android\`
4. Run: \`./gradlew assembleRelease\`
5. Find APK in: \`android/app/build/outputs/apk/release/\`

## Project Details
- App Name: BudgetFlow
- Package: com.budgetflow.app
- Version: 1.0.0

## Notes
- The app uses Expo SDK 52
- All dependencies have been installed
- Assets are configured in the \`assets\` folder
EOF

echo "Build instructions created in BUILD_INSTRUCTIONS.md"
echo ""
echo "To build the APK, please follow one of the options in BUILD_INSTRUCTIONS.md"
echo ""
echo "For the quickest option without local setup, use EAS Build (Option 1)"