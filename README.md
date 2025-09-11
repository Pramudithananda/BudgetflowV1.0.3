# BudgetFlow V1.0.3

## Event Planning & Budget Management App

A comprehensive React Native/Expo application for managing events, expenses, and budgets.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation
```bash
# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npx expo start
```

## 📱 Building APK

### Easiest Method - Cloud Build
```bash
# Run the automated build script
./build-apk-eas.sh
```

Or manually:
```bash
# Login to Expo account
npx eas login

# Build APK in the cloud
npx eas build --platform android --profile production
```

For detailed build instructions, see [BUILD_APK_GUIDE.md](./BUILD_APK_GUIDE.md)

## 🔧 Configuration

### Firebase Setup
Update `/firebase/config.js` with your Firebase credentials before building for production.

## 📦 Project Structure
- `/app` - Application screens and navigation
- `/components` - Reusable UI components
- `/services` - Data and API services
- `/context` - React Context providers
- `/assets` - Images and static assets

## 🛠️ Technologies
- React Native / Expo SDK 52
- Firebase Authentication & Firestore
- SQLite for local storage
- React Navigation
- i18next for internationalization

## 📄 License
Private project - All rights reserved