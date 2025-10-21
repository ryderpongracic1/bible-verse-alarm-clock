# AlarmClock - React Native Alarm App

A cross-platform (iOS & Android) alarm clock mobile application built with React Native and TypeScript.

## Features

### Current (Phase 1)
- Create and manage multiple alarms
- Set custom alarm times with AM/PM picker
- Label your alarms
- Repeat alarms on specific days of the week
- Enable/disable alarms with a toggle switch
- Snooze functionality (5-minute default)
- Full-screen alarm notification
- Vibration support
- Modern, dark-themed UI
- Persistent storage using AsyncStorage

### Coming Soon (Phase 2)
- Text passage typing challenge to dismiss alarm
- Difficulty levels (short, medium, long passages)
- Custom passage library
- Statistics and tracking

## Tech Stack

- **Framework**: React Native 0.73.6
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **Local Storage**: AsyncStorage
- **Notifications**: Notifee (for reliable alarm notifications)
- **UI**: React Native components with custom styling
- **Date Handling**: date-fns

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- For iOS development:
  - macOS
  - Xcode 12 or higher
  - CocoaPods
- For Android development:
  - Android Studio
  - Android SDK
  - JDK 11 or higher

## Installation

1. Navigate to the project directory:
```bash
cd AlarmClock
```

2. Install dependencies:
```bash
npm install
```

3. For iOS, install CocoaPods dependencies:
```bash
cd ios && pod install && cd ..
```

## Running the App

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Start Metro Bundler
```bash
npm start
```

## Project Structure

```
AlarmClock/
├── src/
│   ├── components/        # Reusable UI components
│   ├── navigation/        # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   └── types.ts
│   ├── screens/          # Screen components
│   │   ├── AlarmListScreen.tsx
│   │   ├── EditAlarmScreen.tsx
│   │   └── AlarmRingingScreen.tsx
│   ├── services/         # Business logic & utilities
│   │   ├── AlarmStorage.ts
│   │   └── AlarmScheduler.ts
│   ├── types/           # TypeScript type definitions
│   │   ├── Alarm.ts
│   │   └── index.ts
│   └── utils/           # Helper functions
│       └── timeUtils.ts
├── App.tsx              # Root component
├── index.js            # App entry point
└── package.json        # Dependencies
```

## Key Files

### Data Models
- `src/types/Alarm.ts` - Alarm interface and enums

### Services
- `src/services/AlarmStorage.ts` - Handles alarm persistence with AsyncStorage
- `src/services/AlarmScheduler.ts` - Manages alarm scheduling and notifications using Notifee

### Screens
- `src/screens/AlarmListScreen.tsx` - Main screen showing all alarms
- `src/screens/EditAlarmScreen.tsx` - Create/edit alarm screen
- `src/screens/AlarmRingingScreen.tsx` - Full-screen alarm notification

## Configuration

### iOS Permissions
Add the following to `ios/AlarmClock/Info.plist`:
```xml
<key>UIBackgroundModes</key>
<array>
  <string>remote-notification</string>
</array>
```

### Android Permissions
Permissions are automatically configured via the notifee package. Ensure your `AndroidManifest.xml` includes:
- `VIBRATE`
- `RECEIVE_BOOT_COMPLETED`
- `SCHEDULE_EXACT_ALARM`
- `POST_NOTIFICATIONS` (for Android 13+)

## Usage

### Creating an Alarm
1. Tap the "+" button on the main screen
2. Set your desired time
3. Add a label (optional)
4. Select repeat days (optional)
5. Tap "Save Alarm"

### Managing Alarms
- Toggle alarms on/off using the switch
- Tap an alarm to edit it
- Long-press an alarm to delete it

### When Alarm Rings
- Tap "Dismiss" to turn off the alarm
- Tap "Snooze" to snooze for 5 minutes (if enabled)

## Development Roadmap

### Phase 1: Basic Alarm Functionality ✅
- [x] Project setup with TypeScript
- [x] Navigation structure
- [x] Alarm data models and storage
- [x] Alarm list UI
- [x] Create/edit alarm screen
- [x] Alarm scheduling system
- [x] Notification integration
- [x] Alarm ringing screen
- [x] Sound and vibration

### Phase 2: Text Passage Challenge (Next)
- [ ] Passage data model
- [ ] Passage library/database
- [ ] Text input challenge component
- [ ] Typing validation logic
- [ ] Difficulty levels
- [ ] Prevent bypass mechanisms
- [ ] Challenge screen UI
- [ ] Integration with alarm dismissal

### Phase 3: Polish & Additional Features
- [ ] Custom alarm sounds
- [ ] Volume control
- [ ] Fade-in alarm option
- [ ] Multiple snooze configurations
- [ ] Alarm history/statistics
- [ ] Theme customization
- [ ] Accessibility improvements
- [ ] Unit tests
- [ ] E2E tests

## Troubleshooting

### Notifications Not Working
- Ensure you've granted notification permissions
- Check that "Do Not Disturb" is not enabled
- For Android: Verify battery optimization is disabled for the app

### iOS Build Errors
```bash
cd ios && pod deintegrate && pod install && cd ..
```

### Android Build Errors
```bash
cd android && ./gradlew clean && cd ..
```

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

MIT License - feel free to use this code for your own projects.

## Next Steps

To add the text passage typing challenge:
1. Create a passages database/file
2. Build the challenge UI component
3. Implement typing validation
4. Replace simple dismiss with challenge requirement
5. Add difficulty settings

---

Built with React Native and TypeScript
