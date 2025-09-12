#!/bin/bash

echo "================================================"
echo "     BudgetFlow APK Builder - EAS Method"
echo "================================================"
echo ""

# Check if user is logged into EAS
echo "Checking EAS login status..."
if ! npx eas whoami 2>/dev/null; then
    echo ""
    echo "You need to log in to your Expo account first."
    echo "Please run: npx eas login"
    echo ""
    echo "If you don't have an account, create one at: https://expo.dev"
    exit 1
fi

echo ""
echo "Starting APK build process..."
echo "This will build your APK in the cloud (no local Android SDK required)"
echo ""

# Start the build
echo "Building APK with EAS Build..."
npx eas build --platform android --profile production

echo ""
echo "================================================"
echo "Build initiated successfully!"
echo "================================================"
echo ""
echo "Your APK is being built in the cloud."
echo "You can monitor the progress at: https://expo.dev"
echo ""
echo "Once complete, you can download the APK from your Expo dashboard."
echo ""
echo "The build usually takes 10-20 minutes to complete."
echo "================================================"