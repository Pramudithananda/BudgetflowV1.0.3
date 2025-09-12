# BudgetFlow V1.0.3

## Event Planning & Budget Management App

A comprehensive React Native/Expo application for managing events, expenses, and budgets using **SQLite database** for local storage.

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

## 🗄️ Database

This app uses **SQLite** for local data storage. All data is stored locally on the device, providing:
- ✅ Offline functionality
- ✅ Fast performance
- ✅ Data privacy (no cloud storage)
- ✅ No internet required

### Database Tables
- `categories` - Expense categories
- `funders` - Fund sources/sponsors
- `events` - Event management
- `expenses` - Expense tracking

## 🔐 Authentication

The app uses local authentication with AsyncStorage. User credentials are stored locally on the device.

## 📦 Project Structure
- `/app` - Application screens and navigation
- `/components` - Reusable UI components
- `/services` - Data services
  - `sqliteService.js` - SQLite database operations
  - `dataExportImportService.js` - Data export/import functionality
- `/context` - React Context providers
- `/assets` - Images and static assets

## 🛠️ Technologies
- React Native / Expo SDK 52
- **SQLite** for local database
- AsyncStorage for user preferences
- React Navigation
- i18next for internationalization

## 📊 Features
- ✅ Event management
- ✅ Expense tracking
- ✅ Budget monitoring
- ✅ Category management
- ✅ Funder/sponsor tracking
- ✅ Data export/import (JSON format)
- ✅ Multi-language support
- ✅ Dark/Light theme
- ✅ Offline functionality

## 🔄 Data Export/Import

The app supports exporting and importing data in JSON format for backup and migration purposes.

### Export Data
Navigate to Settings → Export Data to create a JSON backup of all your data.

### Import Data
Navigate to Settings → Import Data to restore from a JSON backup file.

## 📄 License
Private project - All rights reserved