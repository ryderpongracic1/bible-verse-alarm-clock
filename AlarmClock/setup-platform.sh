#!/bin/bash

echo "🚀 Setting up AlarmClock React Native project..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from the AlarmClock directory.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Installing npm dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install npm dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}Step 2: Checking iOS setup...${NC}"
if [ ! -f "ios/Podfile" ]; then
    echo -e "${RED}iOS folder is not set up properly${NC}"
    echo -e "${YELLOW}Attempting to generate iOS folder...${NC}"

    cd ..
    echo "Creating temporary project..."
    npx @react-native-community/cli init TempAlarmSetup --skip-install

    if [ -d "TempAlarmSetup/ios" ]; then
        echo "Copying iOS folder..."
        cp -r TempAlarmSetup/ios AlarmClock/

        if [ -d "TempAlarmSetup/android/app" ]; then
            echo "Copying Android app folder..."
            cp -r TempAlarmSetup/android/app AlarmClock/android/
        fi

        echo "Cleaning up..."
        rm -rf TempAlarmSetup

        cd AlarmClock
        echo -e "${GREEN}✓ Platform folders generated${NC}"
    else
        echo -e "${RED}Failed to generate platform folders${NC}"
        cd AlarmClock
        exit 1
    fi
else
    echo -e "${GREEN}✓ iOS folder exists${NC}"
fi
echo ""

echo -e "${YELLOW}Step 3: Installing iOS dependencies (CocoaPods)...${NC}"
if [ -f "ios/Podfile" ]; then
    cd ios

    # Check if CocoaPods is installed
    if ! command -v pod &> /dev/null; then
        echo -e "${RED}CocoaPods not found. Installing...${NC}"
        sudo gem install cocoapods
    fi

    echo "Running pod install..."
    pod install

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ CocoaPods dependencies installed${NC}"
    else
        echo -e "${RED}Pod install failed${NC}"
        cd ..
        exit 1
    fi
    cd ..
else
    echo -e "${RED}Podfile not found - iOS setup incomplete${NC}"
fi
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Setup complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}To run the app:${NC}"
echo ""
echo "  iOS Simulator:"
echo "    npm run ios"
echo ""
echo "  Android Emulator:"
echo "    npm run android"
echo ""
echo "  Start Metro bundler:"
echo "    npm start"
echo ""
echo -e "${YELLOW}Note: Make sure Xcode and/or Android Studio are installed first!${NC}"
