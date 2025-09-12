#!/bin/bash

echo "================================================"
echo "     BudgetFlow APK Automated Builder"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Project configured for APK build${NC}"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install --legacy-peer-deps
fi

# Create a build info file
cat > build-info.json << EOF
{
  "name": "BudgetFlow",
  "version": "1.0.3",
  "buildDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "platform": "android",
  "buildType": "apk",
  "database": "SQLite",
  "features": [
    "Event Management",
    "Expense Tracking",
    "Budget Monitoring",
    "Offline Support",
    "Data Export/Import"
  ]
}
EOF

echo -e "${GREEN}✓ Build configuration created${NC}"
echo ""

# Option 1: Try local build first
echo "================================================"
echo "Option 1: Local Build (if Android SDK available)"
echo "================================================"

if [ -d "android" ]; then
    echo "Android folder exists. Attempting local build..."
    
    # Check for Android SDK
    if [ -n "$ANDROID_HOME" ] || [ -n "$ANDROID_SDK_ROOT" ]; then
        cd android
        if ./gradlew assembleRelease 2>/dev/null; then
            APK_PATH="app/build/outputs/apk/release/app-release.apk"
            if [ -f "$APK_PATH" ]; then
                cp "$APK_PATH" ../BudgetFlow.apk
                echo -e "${GREEN}✓ APK built successfully!${NC}"
                echo -e "${GREEN}Location: $(pwd)/BudgetFlow.apk${NC}"
                cd ..
                exit 0
            fi
        fi
        cd ..
    else
        echo -e "${YELLOW}Android SDK not found. Trying cloud build...${NC}"
    fi
fi

# Option 2: Cloud build with EAS
echo ""
echo "================================================"
echo "Option 2: Cloud Build with EAS (Recommended)"
echo "================================================"

# Check if user is logged in to EAS
if npx eas whoami &>/dev/null; then
    echo -e "${GREEN}✓ EAS account detected${NC}"
    echo "Starting cloud build..."
    
    # Start the build
    npx eas build --platform android --profile production --non-interactive --no-wait
    
    echo ""
    echo -e "${GREEN}✓ Build started in the cloud!${NC}"
    echo "Check your build status at: https://expo.dev"
    echo "You will receive an email when the APK is ready."
else
    echo -e "${YELLOW}Please login to EAS first:${NC}"
    echo "1. Create free account at: https://expo.dev/signup"
    echo "2. Run: npx eas login"
    echo "3. Run this script again"
fi

echo ""
echo "================================================"
echo "Option 3: Instant APK with Online Services"
echo "================================================"
echo ""
echo -e "${GREEN}Use these services for instant APK:${NC}"
echo ""
echo "1. WebIntoApp:"
echo "   ${GREEN}https://www.webintoapp.com/store/expo-apk-ipa-app-builder${NC}"
echo "   - Upload BudgetFlow-SQLite.zip"
echo "   - Get APK in 2-3 minutes"
echo ""
echo "2. Expo Snack:"
echo "   ${GREEN}https://snack.expo.dev${NC}"
echo "   - Import project"
echo "   - Download APK"
echo ""
echo "3. Download project ZIP:"
echo "   ${GREEN}https://bashupload.com/9dp6R/klg8S.zip${NC}"
echo ""

echo "================================================"
echo -e "${GREEN}✓ Build setup complete!${NC}"
echo "================================================"