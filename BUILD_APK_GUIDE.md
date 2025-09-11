# BudgetFlow APK Build Guide

## Project Status
✅ **Project is ready for APK building!**

- All dependencies installed
- Firebase configuration added
- Assets configured
- EAS configuration created
- Project exported successfully

## Quick Build Options

### Option 1: EAS Build Cloud (Easiest - No Local Setup Required)

1. **Create an Expo account** (if you don't have one):
   ```bash
   npx eas login
   ```

2. **Build the APK in the cloud**:
   ```bash
   npx eas build --platform android --profile production
   ```

3. **Download the APK**:
   - Visit your Expo dashboard at https://expo.dev
   - Find your build and download the APK file

**Advantages:**
- No Android SDK installation required
- Works on any OS (Windows, Mac, Linux)
- Handles signing automatically
- Professional build environment

### Option 2: Local Build with Expo (Requires Android SDK)

1. **Install Android Studio** from https://developer.android.com/studio

2. **Set up environment variables**:
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   ```

3. **Generate native Android project**:
   ```bash
   npx expo prebuild --platform android
   ```

4. **Build the APK**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

5. **Find your APK**:
   - Location: `android/app/build/outputs/apk/release/app-release.apk`

### Option 3: Android Studio Build

1. **Generate native project**:
   ```bash
   npx expo prebuild --platform android
   ```

2. **Open in Android Studio**:
   - Open Android Studio
   - Select "Open an existing project"
   - Navigate to the `android` folder in your project

3. **Build APK**:
   - Menu: Build → Generate Signed Bundle/APK
   - Select APK
   - Create or use existing keystore
   - Build release APK

## Firebase Configuration

⚠️ **Important**: Before publishing your app, update the Firebase configuration in `/workspace/firebase/config.js` with your actual Firebase project credentials:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing
3. Add an Android app with package name: `com.budgetflow.app`
4. Download `google-services.json` and place in `android/app/` (after prebuild)
5. Copy your Firebase config to `firebase/config.js`

## App Details

- **App Name**: BudgetFlow
- **Package Name**: com.budgetflow.app
- **Version**: 1.0.0
- **SDK Version**: Expo SDK 52
- **Min Android SDK**: 21 (Android 5.0)

## Testing the APK

1. **Enable Developer Mode** on your Android device:
   - Settings → About Phone → Tap "Build Number" 7 times

2. **Enable USB Debugging**:
   - Settings → Developer Options → USB Debugging

3. **Install APK via ADB**:
   ```bash
   adb install path/to/your.apk
   ```

   Or transfer the APK to your phone and install directly.

## Troubleshooting

### Issue: Build fails with dependency errors
**Solution**: Run `npm install --legacy-peer-deps`

### Issue: Firebase errors
**Solution**: Ensure Firebase config is properly set in `/firebase/config.js`

### Issue: Assets not found
**Solution**: Ensure all images exist in `/assets` folder

### Issue: Gradle build fails
**Solution**: 
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

## Next Steps

1. Test the APK on multiple devices
2. Set up proper Firebase project
3. Create signing keys for production
4. Consider publishing to Google Play Store

## Support

For more help with Expo builds, visit:
- [Expo Documentation](https://docs.expo.dev)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Native Documentation](https://reactnative.dev)

---

**Note**: The project has been fully prepared for APK generation. Choose the build method that best suits your environment and requirements. Option 1 (EAS Build) is recommended for its simplicity and reliability.