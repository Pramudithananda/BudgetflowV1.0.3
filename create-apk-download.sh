#!/bin/bash

echo "================================================"
echo "     BudgetFlow APK Download Link Generator"
echo "================================================"
echo ""

# Check if we're in a web environment
if [ -z "$CODESPACE_NAME" ] && [ -z "$GITPOD_WORKSPACE_URL" ]; then
    echo "⚠️  This script works best in cloud development environments."
    echo ""
fi

echo "📱 To get your APK, you have several options:"
echo ""
echo "================================================"
echo "OPTION 1: Quick Test with Expo Go (Recommended)"
echo "================================================"
echo "1. Install 'Expo Go' app on your Android phone from Play Store"
echo "2. Run this command:"
echo "   npx expo start --tunnel"
echo "3. Scan the QR code with Expo Go app"
echo ""

echo "================================================"
echo "OPTION 2: Build APK using EAS (Free Tier Available)"
echo "================================================"
echo "1. Create free account at: https://expo.dev/signup"
echo "2. Login: npx eas login"
echo "3. Build APK: npx eas build --platform android --profile production"
echo "4. Download from: https://expo.dev/accounts/[your-username]/projects"
echo ""

echo "================================================"
echo "OPTION 3: Use Expo Snack (Online)"
echo "================================================"
echo "1. Visit: https://snack.expo.dev"
echo "2. Upload your project files"
echo "3. Test instantly on your phone"
echo ""

echo "================================================"
echo "OPTION 4: Generate Local APK (Requires Android Studio)"
echo "================================================"
if [ -d "android" ]; then
    echo "✅ Android folder exists"
    echo ""
    echo "To build locally:"
    echo "1. Install Android Studio from: https://developer.android.com/studio"
    echo "2. Set ANDROID_HOME environment variable"
    echo "3. Run: cd android && ./gradlew assembleRelease"
    echo "4. Find APK at: android/app/build/outputs/apk/release/app-release.apk"
else
    echo "❌ Android folder not found. Run: npx expo prebuild --platform android"
fi

echo ""
echo "================================================"
echo "QUICK START - Test Now!"
echo "================================================"
echo "Running development server..."
echo ""

# Start expo with tunnel for remote access
npx expo start --tunnel