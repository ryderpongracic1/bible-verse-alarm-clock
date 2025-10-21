#!/bin/bash

set -e  # Exit on error

echo "🚀 Complete AlarmClock Setup Script"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get current directory
PROJECT_DIR=$(pwd)
PARENT_DIR=$(dirname "$PROJECT_DIR")

echo -e "${BLUE}Project directory: $PROJECT_DIR${NC}"
echo ""

# Step 1: Check Ruby version
echo -e "${YELLOW}Step 1: Checking Ruby version...${NC}"
RUBY_VERSION=$(ruby --version | awk '{print $2}' | cut -d'.' -f1,2)
echo "Current Ruby version: $RUBY_VERSION"

if (( $(echo "$RUBY_VERSION < 3.0" | bc -l) )); then
    echo -e "${RED}Ruby version too old. Installing rbenv and Ruby 3.1...${NC}"

    # Install rbenv if not present
    if ! command -v rbenv &> /dev/null; then
        brew install rbenv ruby-build
    fi

    # Install Ruby 3.1.4
    rbenv install 3.1.4 --skip-existing
    rbenv global 3.1.4

    # Initialize rbenv
    eval "$(rbenv init - zsh)"

    echo -e "${GREEN}✓ Ruby 3.1.4 installed${NC}"

    # Reinstall CocoaPods
    gem install cocoapods
else
    echo -e "${GREEN}✓ Ruby version is adequate${NC}"
fi
echo ""

# Step 2: Generate iOS project files
echo -e "${YELLOW}Step 2: Generating iOS project files...${NC}"

if [ ! -f "ios/AlarmClock.xcodeproj/project.pbxproj" ]; then
    echo "iOS Xcode project missing. Generating from template..."

    cd "$PARENT_DIR"

    # Create temporary project
    echo "Creating temporary React Native project..."
    npx react-native@0.71.14 init TempAlarmSetup --skip-install

    # Backup our custom Podfile
    cp AlarmClock/ios/Podfile AlarmClock/ios/Podfile.custom

    # Copy iOS folder
    echo "Copying iOS project files..."
    rm -rf AlarmClock/ios
    cp -r TempAlarmSetup/ios AlarmClock/ios

    # Restore our custom Podfile
    cp AlarmClock/ios/Podfile.custom AlarmClock/ios/Podfile
    rm AlarmClock/ios/Podfile.custom

    # Copy Android app folder
    echo "Copying Android app files..."
    cp -r TempAlarmSetup/android/app AlarmClock/android/

    # Clean up
    echo "Cleaning up temporary files..."
    rm -rf TempAlarmSetup

    cd "$PROJECT_DIR"

    echo -e "${GREEN}✓ iOS project files generated${NC}"
else
    echo -e "${GREEN}✓ iOS project already exists${NC}"
fi
echo ""

# Step 3: Install npm dependencies
echo -e "${YELLOW}Step 3: Installing npm dependencies...${NC}"
npm install
echo -e "${GREEN}✓ npm dependencies installed${NC}"
echo ""

# Step 4: Install CocoaPods dependencies
echo -e "${YELLOW}Step 4: Installing CocoaPods dependencies...${NC}"
cd ios

# Deintegrate first to clean up
pod deintegrate 2>/dev/null || true

# Install pods
pod install

cd ..
echo -e "${GREEN}✓ CocoaPods dependencies installed${NC}"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}To run the app:${NC}"
echo ""
echo "  ${BLUE}npm run ios${NC}     - Run on iOS simulator"
echo "  ${BLUE}npm run android${NC} - Run on Android emulator"
echo "  ${BLUE}npm start${NC}       - Start Metro bundler"
echo ""
echo -e "${YELLOW}Tips:${NC}"
echo "  - Make sure you have Xcode installed"
echo "  - Open Xcode at least once before running"
echo "  - If you get errors, try: rm -rf node_modules && npm install"
echo ""
