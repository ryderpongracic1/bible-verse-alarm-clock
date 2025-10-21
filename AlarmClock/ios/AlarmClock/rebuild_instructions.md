# Clean Build Instructions to Update Notification Sound

## The Problem
iOS caches notification sounds aggressively. Even though we updated the file, 
the old 8-second version might still be cached.

## Solution: Clean Build

### Option 1: Command Line (Fastest)
```bash
# 1. Clean the build folder
cd ios
rm -rf build
xcodebuild clean -workspace AlarmClock.xcworkspace -scheme AlarmClock
cd ..

# 2. Clear Metro bundler cache
npx react-native start --reset-cache &

# 3. In a new terminal, run the app
npx react-native run-ios

# Or if using a specific simulator:
npx react-native run-ios --simulator="iPhone 15"
```

### Option 2: Xcode (More Thorough)
1. Open `ios/AlarmClock.xcworkspace` in Xcode
2. **Product → Clean Build Folder** (⌘⇧K)
3. **Delete the app** from your simulator/device
4. Close Xcode
5. Delete derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData`
6. Run: `npx react-native run-ios`

### Option 3: Nuclear Option (If still not working)
```bash
# 1. Stop Metro bundler (Ctrl+C)
# 2. Clean everything
cd ios
rm -rf build Pods Podfile.lock
pod install
cd ..

# 3. Reset metro cache
rm -rf node_modules/.cache

# 4. Run fresh
npx react-native start --reset-cache &
npx react-native run-ios
```

## Verify It Worked
After rebuilding:
1. Set an alarm for 1 minute from now
2. Put app in background (home button)
3. When alarm fires, the notification sound should play for ~24 seconds
4. Check the logs to confirm it's using `alarm_long.caf`

## Still Only 8 Seconds?
If it's still playing 8 seconds after clean build:
- Check the logs for which sound file is being loaded
- Make sure you're testing with the app in the background
- Try deleting the app completely and reinstalling
