# Setup Notes - AlarmClock Project

## What's Been Built

### Phase 1: Functional Alarm App ✅

A complete, functional alarm clock application with:

1. **Core Functionality**
   - Create, edit, and delete alarms
   - Set alarm times with user-friendly time picker
   - Enable/disable alarms with toggle switches
   - Repeat alarms on specific days
   - Label alarms for easy identification
   - Snooze functionality
   - Full-screen alarm notifications
   - Persistent storage (alarms saved between app restarts)

2. **Architecture**
   - TypeScript for type safety
   - Clean separation of concerns (screens, services, utils, types)
   - React Navigation for screen management
   - Notifee for reliable background notifications
   - AsyncStorage for data persistence

3. **Screens**
   - `AlarmListScreen` - Main screen showing all alarms
   - `EditAlarmScreen` - Create/edit alarm with time picker and settings
   - `AlarmRingingScreen` - Full-screen alarm with dismiss/snooze options

4. **Services**
   - `AlarmStorage` - Handles saving/loading alarms from local storage
   - `AlarmScheduler` - Manages alarm scheduling and notifications

## What Needs to Be Done Before Running

### 1. Install Dependencies

```bash
cd AlarmClock
npm install
```

### 2. Platform-Specific Setup

#### iOS Setup
The iOS folder needs to be fully populated. You have two options:

**Option A: Use React Native CLI to generate iOS folder**
```bash
# This will generate all necessary iOS files
npx react-native init TempProject --template react-native-template-typescript
# Then copy the ios folder from TempProject to AlarmClock
cp -r TempProject/ios ./
rm -rf TempProject
```

**Option B: Manual setup**
- Create Xcode project manually
- Configure Info.plist with required permissions
- Set up the bridge between React Native and iOS

Required iOS permissions in Info.plist:
```xml
<key>UIBackgroundModes</key>
<array>
  <string>remote-notification</string>
</array>
<key>NSUserNotificationsUsageDescription</key>
<string>We need notification permissions to trigger alarms</string>
```

Then install CocoaPods:
```bash
cd ios
pod install
cd ..
```

#### Android Setup
The Android folder needs app module and manifest. You have two options:

**Option A: Use React Native CLI to generate Android folder**
```bash
npx react-native init TempProject --template react-native-template-typescript
cp -r TempProject/android/app ./android/
rm -rf TempProject
```

**Option B: Manual setup**
- Create the app module structure
- Set up AndroidManifest.xml
- Configure build.gradle files

Required Android permissions in AndroidManifest.xml:
```xml
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

### 3. Running the App

After completing platform setup:

```bash
# Start Metro bundler
npm start

# In another terminal, run iOS
npm run ios

# Or run Android
npm run android
```

## Current State vs. Final Goal

### ✅ Phase 1: Basic Alarm (COMPLETE)
- All core alarm functionality is implemented
- Ready for testing once platform files are set up

### ⏳ Phase 2: Text Passage Challenge (NOT YET IMPLEMENTED)
This is the next major feature to add. Here's the plan:

#### What Needs to Be Built:

1. **Passage Data Model**
```typescript
interface TextPassage {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}
```

2. **Passage Library**
   - Create a JSON file or database of text passages
   - Categories: quotes, facts, tongue-twisters, etc.
   - Different difficulty levels based on length and complexity

3. **Challenge Screen Component**
   - Replace simple "Dismiss" button in `AlarmRingingScreen`
   - Text input field for typing
   - Real-time validation of typed text
   - Visual feedback (correct/incorrect characters)
   - Timer (optional)

4. **Implementation Steps**
   - Create `src/data/passages.json` with sample passages
   - Create `src/components/TypingChallenge.tsx` component
   - Add passage selection logic to `AlarmRingingScreen`
   - Implement character-by-character validation
   - Add difficulty setting to alarm configuration
   - Prevent dismissal until passage is correctly typed

5. **Bypass Prevention**
   - Disable back button during challenge
   - Prevent task switching (platform-specific)
   - Keep screen on during challenge
   - Ensure alarm sound continues until complete

## File Structure Overview

```
AlarmClock/
├── src/
│   ├── components/          # Future: TypingChallenge component
│   ├── navigation/
│   │   ├── AppNavigator.tsx # Screen navigation setup
│   │   └── types.ts         # Navigation type definitions
│   ├── screens/
│   │   ├── AlarmListScreen.tsx      # Main alarm list
│   │   ├── EditAlarmScreen.tsx      # Create/edit alarms
│   │   └── AlarmRingingScreen.tsx   # Alarm notification screen
│   ├── services/
│   │   ├── AlarmStorage.ts          # AsyncStorage operations
│   │   └── AlarmScheduler.ts        # Notifee scheduling
│   ├── types/
│   │   ├── Alarm.ts                 # Alarm interface
│   │   └── index.ts
│   └── utils/
│       └── timeUtils.ts             # Time formatting helpers
├── App.tsx                  # Root component
├── index.js                # Entry point
└── package.json            # Dependencies
```

## Key Technologies

- **React Native 0.73.6** - Mobile framework
- **TypeScript** - Type safety
- **React Navigation** - Screen navigation
- **Notifee** - Background notifications (more reliable than PushNotification)
- **AsyncStorage** - Local data persistence
- **date-fns** - Date manipulation and formatting
- **@react-native-community/datetimepicker** - Native time picker

## Next Steps for Development

### To Complete Phase 1 (Functional Alarm):
1. Set up iOS and Android platform files (see above)
2. Install dependencies: `npm install`
3. Test on iOS simulator/device
4. Test on Android emulator/device
5. Fix any platform-specific issues
6. Verify alarms trigger correctly in background

### To Implement Phase 2 (Text Challenge):
1. Design the typing challenge UI
2. Create passage database
3. Build `TypingChallenge` component
4. Integrate with `AlarmRingingScreen`
5. Add difficulty settings to `EditAlarmScreen`
6. Test extensively (especially bypass prevention)

## Known Considerations

1. **Permissions**: Ensure notification permissions are requested on first launch
2. **Battery Optimization**: Android may kill background alarms; users may need to disable battery optimization
3. **Do Not Disturb**: Alarms should bypass DND mode
4. **Timezone Changes**: Test alarm behavior when timezone changes
5. **App Updates**: Alarms should persist through app updates
6. **Device Restart**: Alarms need to be rescheduled after device reboot (requires BOOT_COMPLETED permission and listener)

## Testing Checklist

- [ ] Create alarm and verify it triggers on time
- [ ] Toggle alarm off and verify it doesn't trigger
- [ ] Edit alarm and verify changes persist
- [ ] Delete alarm and verify it's removed
- [ ] Test repeating alarms (specific days)
- [ ] Test snooze functionality
- [ ] Test alarm when app is closed
- [ ] Test alarm when device is locked
- [ ] Test multiple alarms
- [ ] Test alarm sound and vibration
- [ ] Verify alarms persist after app restart
- [ ] Test on both iOS and Android

## Useful Commands

```bash
# Install dependencies
npm install

# Start Metro
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Clear cache
npm start -- --reset-cache

# iOS: Clean and rebuild
cd ios && pod deintegrate && pod install && cd ..

# Android: Clean build
cd android && ./gradlew clean && cd ..

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Notifee Documentation](https://notifee.app/react-native/docs/overview)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Status**: Phase 1 Complete - Functional alarm app ready for testing after platform setup
**Next**: Set up iOS/Android platform files, then test basic functionality
**Future**: Implement text passage typing challenge
