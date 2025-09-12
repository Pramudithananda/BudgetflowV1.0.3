# 📱 BudgetFlow APK Download කිරීමේ මාර්ග

## ✨ ක්ෂණික ක්‍රමය - Expo Go App භාවිතය

### පියවර 1: ඔබේ Android දුරකථනයේ Expo Go install කරන්න
1. Play Store විවෘත කරන්න
2. "Expo Go" search කරන්න
3. Install කරන්න

### පියවර 2: App එක test කරන්න
```bash
npx expo start --tunnel
```
QR code එක Expo Go app එකෙන් scan කරන්න

---

## 🚀 APK File එක Download කිරීම - EAS Build

### නොමිලේ APK එකක් හදන්න:

#### 1️⃣ Expo Account එකක් හදන්න (නොමිලේ)
👉 **[https://expo.dev/signup](https://expo.dev/signup)**

#### 2️⃣ Terminal එකේ login වෙන්න
```bash
npx eas login
```

#### 3️⃣ APK Build කරන්න
```bash
npx eas build --platform android --profile production
```

#### 4️⃣ Download කරන්න
Build එක complete වුනාම (විනාඩි 10-15):
- Email එකක් එනවා download link එකත් එක්ක
- නැත්නම් මෙතනින් download කරන්න: **[https://expo.dev](https://expo.dev)**

---

## 🌐 Online APK Builder Services

### 1. APK.TOOLS (ලේසිම ක්‍රමය)
1. Visit: **[https://apk.tools](https://apk.tools)**
2. Upload your project as ZIP
3. Get APK instantly

### 2. Expo Snack
1. Visit: **[https://snack.expo.dev](https://snack.expo.dev)**
2. Import your project
3. Download APK

### 3. AppGyver
1. Visit: **[https://www.appgyver.com](https://www.appgyver.com)**
2. Free APK builds available

---

## 📦 Project ZIP File සකසා ඇත

ඔබේ project files ZIP file එකක් ලෙස ready කර ඇත:

### ZIP File එක Download කරන්න:
```bash
# ZIP file එක හදන්න
cd /workspace
zip -r BudgetFlow-SQLite.zip . -x "node_modules/*" -x ".git/*" -x "android/*" -x "dist-*/*"
```

### ZIP file එක භාවිතා කරන්න:
1. ඉහත සඳහන් online services වලින් එකකට යන්න
2. ZIP file upload කරන්න
3. APK download කරන්න

---

## 💻 Local Build (Android Studio සමඟ)

### Requirements:
- Android Studio installed
- 8GB+ RAM
- 10GB+ free space

### Steps:
```bash
# 1. Android project generate කරන්න
npx expo prebuild --platform android

# 2. Build APK
cd android
./gradlew assembleRelease

# 3. APK location
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎯 නිර්දේශිත ක්‍රමය

**වේගවත්ම ක්‍රමය**: Expo Go app එක use කරන්න testing සඳහා

**Production APK සඳහා**: EAS Build use කරන්න (නොමිලේ tier එකක් තියෙනවා)

---

## ⚡ ක්ෂණික Testing

මේ දැනම test කරන්න:
```bash
npx expo start --tunnel
```

Expo Go app එකෙන් QR code scan කරන්න!

---

## 📞 උදව් අවශ්‍යද?

### Common Issues:

**Issue**: Build failed
**Solution**: `npm install --legacy-peer-deps` run කරන්න

**Issue**: Expo account නැහැ
**Solution**: [expo.dev/signup](https://expo.dev/signup) වෙතින් නොමිලේ account එකක් හදන්න

**Issue**: QR code scan වෙන්නේ නැහැ
**Solution**: Phone සහ computer එකම WiFi network එකේ තියෙන්න ඕනේ

---

## ✅ සාර්ථකයි!

ඔබේ BudgetFlow app එක SQLite database එකත් එක්ක APK එකක් ලෙස build කිරීමට සූදානම්!

**Features**:
- ✅ Local SQLite database
- ✅ No internet required
- ✅ Fast performance
- ✅ Data privacy
- ✅ Export/Import support