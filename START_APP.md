# 🚀 BudgetFlow App - APK Download සහ Testing

## ✅ Project Ready Status
- **ZIP File**: `BudgetFlow-SQLite.zip` (243KB)
- **Database**: SQLite (Local)
- **Authentication**: Local (No Firebase)

---

## 📱 METHOD 1: ක්ෂණික Testing (දැන්ම try කරන්න!)

### Step 1: Expo Go App Install කරන්න
**Android**: [Play Store - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Step 2: App එක Run කරන්න
```bash
npx expo start --tunnel
```

### Step 3: QR Code Scan කරන්න
Expo Go app එක open කරලා QR code scan කරන්න

---

## 📦 METHOD 2: APK File Download කරන්න

### OPTION A: EAS Build (නිර්දේශිතයි - නොමිලේ)

1. **Expo Account හදන්න**: https://expo.dev/signup

2. **Login කරන්න**:
```bash
npx eas login
```

3. **APK Build කරන්න**:
```bash
npx eas build --platform android --profile production
```

4. **Download කරන්න**: 
- Email එකෙන් link එක එනවා
- නැත්නම්: https://expo.dev dashboard එකෙන්

### OPTION B: Online APK Builders

**WebIntoApp** (ලේසිම ක්‍රමය):
1. Visit: https://webintoapp.com/expo-apk-builder
2. Upload `BudgetFlow-SQLite.zip`
3. Download APK

**Appetize.io** (Online emulator):
1. Visit: https://appetize.io
2. Upload and test online

---

## 🎯 ඉක්මන් ආරම්භය

**Terminal Command එකක් Run කරන්න**:
```bash
# Development server start කරන්න
npx expo start --tunnel
```

**Output එකේ තියෙන QR code එක scan කරන්න Expo Go app එකෙන්**

---

## 📋 Project Structure

```
BudgetFlow-SQLite/
├── app/                 # Screens and navigation
├── components/          # UI components  
├── services/           
│   ├── sqliteService.js # SQLite database
│   └── dataExportImportService.js
├── context/            # App contexts
├── assets/             # Images
├── package.json        # Dependencies
└── app.json           # Expo config
```

---

## 🔧 Features

✅ **Event Management** - උත්සව සැලසුම් කරන්න
✅ **Expense Tracking** - වියදම් track කරන්න
✅ **Budget Monitoring** - අයවැය කළමනාකරණය
✅ **Category Management** - වර්ගීකරණය
✅ **Funder Tracking** - අරමුදල් සපයන්නන්
✅ **Data Export/Import** - JSON backup
✅ **Multi-language** - භාෂා support
✅ **Dark/Light Theme** - තේමා මාරු කිරීම
✅ **Offline Mode** - Internet අවශ්‍ය නැහැ

---

## 💾 Database

**SQLite Local Database**
- සියලුම data phone එකේම save වෙනවා
- Internet connection අවශ්‍ය නැහැ
- Fast performance
- Full privacy

---

## 📲 Download Links

### Project Files:
- **ZIP File**: `BudgetFlow-SQLite.zip` (Ready in workspace)

### Build Services:
- **EAS Build**: https://expo.dev
- **Expo Snack**: https://snack.expo.dev
- **WebIntoApp**: https://webintoapp.com

---

## 🆘 Help & Support

**Build Issues?**
```bash
# Dependencies reinstall කරන්න
rm -rf node_modules
npm install --legacy-peer-deps
```

**Testing Issues?**
- Phone සහ computer එකම WiFi එකේ තියෙන්න ඕනේ
- Firewall check කරන්න
- Expo Go app update කරන්න

---

## ✨ සාර්ථකයි!

ඔබේ BudgetFlow app එක APK එකක් ලෙස build කිරීමට සූදානම්!

**Next Steps**:
1. ඉහත methods වලින් එකක් select කරන්න
2. APK build කරන්න
3. Phone එකට install කරන්න
4. Enjoy your app! 🎉