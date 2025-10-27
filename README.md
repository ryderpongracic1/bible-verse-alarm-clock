# Bible Verse Alarm Clock

A React Native alarm clock app that requires you to type a Bible verse to dismiss the alarm - helping you wake up with Scripture! Features customizable verse selection and continuous playback on iOS.

## ✨ Features

### 📖 Bible Verse Typing Challenge
- **Type to dismiss**: Alarms can only be dismissed by typing a Bible verse correctly
- **Real-time validation**: Each character must match exactly (case-sensitive)
- **Visual feedback**: Color-coded character highlighting (green = correct, blue = current, gray = pending)
- **Instant error feedback**: Vibrates when incorrect characters are typed
- **Progress tracking**: Shows completion percentage and accuracy
- **Scripture API integration**: Fetches verses from the Bible API (KJV)
- **Offline fallback**: Includes preset verses if API is unavailable

### ⚙️ Customizable Settings
- **Famous Verses Mode**: Choose from 100 curated, well-known Bible verses
  - John 3:16, Psalm 23:1, Romans 8:28, and more
  - Perfect for familiar passages you can type quickly
- **Book Selection**: Customize which books to include in verse selection
  - All 66 Bible books with checkboxes (39 OT + 27 NT)
  - Search functionality to quickly find books
  - "Select All" / "Deselect All" bulk actions
  - Shows book count (e.g., "4 of 66 books")
  - Filter verses to only your selected books
- **Smart Defaults**: All books selected on first launch
- **Persistent Settings**: Preferences saved automatically

### ⏰ Alarm Management
- Create and manage multiple alarms
- Set custom alarm times with 12-hour AM/PM picker
- Label your alarms with custom names
- Repeat alarms on specific days of the week
- Enable/disable alarms with a toggle switch
- Delete alarms with long-press

### 🎵 Audio & Notifications
- **iOS Background Audio**: Continuous alarm playback even when app is backgrounded
  - Silent audio loop maintains audio session
  - No more 8-second sound limit on iOS
  - Works perfectly with locked screen
- **Critical Alerts**: Bypasses Do Not Disturb mode (iOS)
- **Custom Alarm Sounds**: Long-looping alarm tones for persistent ringing
- **Vibration Pattern**: Customizable haptic feedback

### 🎨 User Experience
- Beautiful dark-themed UI
- Full-screen modal alarm presentation
- Smooth navigation with React Navigation
- Keyboard-aware scrolling for long verses
- Settings accessible from main screen (gear icon)
- Responsive design for all screen sizes

## Tech Stack

- **Framework**: React Native 0.74.5
- **Language**: TypeScript
- **Navigation**: React Navigation v6 (Native Stack)
- **Local Storage**: AsyncStorage (alarms & settings)
- **Notifications**: Notifee v7.8.2 (cross-platform alarm scheduling)
- **Audio**: react-native-sound (alarm playback)
- **Background Audio**: Native iOS module with AVAudioSession
- **API**: Scripture API Bible (scripture.api.bible)
- **UI**: React Native components with custom dark theme
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
│   ├── components/              # Reusable UI components
│   │   └── TypingChallenge.tsx  # Bible verse typing component
│   ├── data/                    # Static data files
│   │   └── famousVerses.json    # 100 curated Bible verses
│   ├── navigation/              # Navigation configuration
│   │   ├── AppNavigator.tsx     # Main navigation stack
│   │   └── types.ts             # Navigation type definitions
│   ├── screens/                 # Screen components
│   │   ├── AlarmListScreen.tsx  # Main alarm list view
│   │   ├── EditAlarmScreen.tsx  # Create/edit alarm form
│   │   ├── AlarmRingingScreen.tsx  # Full-screen alarm + typing challenge
│   │   └── SettingsScreen.tsx   # Settings with book selection
│   ├── services/                # Business logic & utilities
│   │   ├── AlarmStorage.ts      # Alarm persistence (AsyncStorage)
│   │   ├── AlarmScheduler.ts    # Alarm scheduling (Notifee)
│   │   ├── BibleApiService.ts   # Scripture API integration
│   │   ├── SoundService.ts      # Audio playback management
│   │   ├── SettingsStorage.ts   # Settings persistence
│   │   └── BackgroundAudioService.ts  # iOS background audio
│   ├── types/                   # TypeScript type definitions
│   │   ├── Alarm.ts             # Alarm data models
│   │   ├── Passage.ts           # Bible passage types
│   │   ├── Settings.ts          # Settings & book definitions
│   │   ├── BackgroundAudioModule.ts  # Native module types
│   │   └── index.ts             # Type exports
│   └── utils/                   # Helper functions
│       └── timeUtils.ts         # Time formatting utilities
├── ios/
│   └── AlarmClock/
│       ├── BackgroundAudioManager.swift  # Native iOS audio manager
│       ├── BackgroundAudioModule.m       # React Native bridge
│       ├── silence.wav                    # Silent audio loop
│       └── alarm_long.caf                 # Looping alarm sound
├── App.tsx                      # Root component
├── index.js                     # App entry point with Notifee handler
└── package.json                 # Dependencies
```

## Key Files

### Data Models
- `src/types/Alarm.ts` - Alarm interface and enums
- `src/types/Passage.ts` - Bible verse passage types
- `src/types/Settings.ts` - Settings types + all 66 Bible books metadata

### Services
- `src/services/AlarmStorage.ts` - Alarm persistence with AsyncStorage
- `src/services/AlarmScheduler.ts` - Alarm scheduling using Notifee
- `src/services/BibleApiService.ts` - Fetches Bible verses from Scripture API
- `src/services/SettingsStorage.ts` - Settings persistence with AsyncStorage
- `src/services/SoundService.ts` - Audio playback management
- `src/services/BackgroundAudioService.ts` - iOS background audio (TypeScript wrapper)

### Screens
- `src/screens/AlarmListScreen.tsx` - Main alarm list with settings button
- `src/screens/EditAlarmScreen.tsx` - Create/edit alarm form
- `src/screens/AlarmRingingScreen.tsx` - Full-screen alarm with typing challenge
- `src/screens/SettingsScreen.tsx` - Settings with book selection & famous verses

### Components
- `src/components/TypingChallenge.tsx` - Bible verse typing validation component

### Native Modules (iOS)
- `ios/AlarmClock/BackgroundAudioManager.swift` - Swift audio session manager
- `ios/AlarmClock/BackgroundAudioModule.m` - Objective-C React Native bridge

### Data
- `src/data/famousVerses.json` - 100 curated famous Bible verses

## Configuration

### iOS Permissions
Required in `ios/AlarmClock/Info.plist`:
```xml
<key>UIBackgroundModes</key>
<array>
  <string>audio</string>
  <string>remote-notification</string>
</array>

<key>UIUserNotificationSettings</key>
<dict>
  <key>UISupportsCriticalAlerts</key>
  <true/>
</dict>
```

### Android Permissions
Automatically configured via the notifee package. Includes:
- `VIBRATE` - Vibration support
- `RECEIVE_BOOT_COMPLETED` - Restore alarms after reboot
- `SCHEDULE_EXACT_ALARM` - Precise alarm timing
- `POST_NOTIFICATIONS` - Display notifications (Android 13+)

### API Configuration
Create `src/config/config.ts` with your Bible API key:
```typescript
export const config = {
  BIBLE_API_KEY: 'your-api-key-here',
  BIBLE_API_BASE_URL: 'https://api.scripture.api.bible/v1',
  KJV_BIBLE_ID: 'de4e12af7f28f599-02',
};
```

Get a free API key at: https://scripture.api.bible/

## Usage

### Creating an Alarm
1. Tap the "+" button on the alarm list screen
2. Set your desired time using the time picker
3. Add a label (optional, e.g., "Morning Wake-up")
4. Select repeat days (optional, e.g., Mon-Fri)
5. Tap "Save Alarm"

### Customizing Verse Settings
1. Tap the ⚙️ **Settings** button on the alarm list screen
2. **For Famous Verses**:
   - Toggle "Use Famous Verses Only" ON
   - Get well-known verses like John 3:16
3. **For Custom Book Selection**:
   - Keep "Use Famous Verses Only" OFF
   - Search for specific books (e.g., "John")
   - Check/uncheck books individually
   - Or use "Select All" / "Deselect All" buttons
   - Only checked books will be used for verse selection

### Managing Alarms
- **Toggle**: Use the switch to enable/disable alarms
- **Edit**: Tap an alarm to modify its settings
- **Delete**: Long-press an alarm to delete it

### When Alarm Rings
1. App opens to full-screen with Bible verse displayed
2. Type the verse exactly as shown (character-by-character)
3. Green text = correct, Blue highlight = current character
4. Incorrect characters vibrate and won't be accepted
5. Complete the verse to dismiss the alarm
6. View your accuracy and mistake count

## Development Status

### ✅ Completed Features
- [x] **Core Alarm Functionality**
  - [x] Multiple alarm management
  - [x] Time picker with AM/PM
  - [x] Repeat scheduling (day selection)
  - [x] Enable/disable toggles
  - [x] Alarm labels
  - [x] AsyncStorage persistence

- [x] **Bible Verse Typing Challenge**
  - [x] Real-time character validation
  - [x] Visual feedback with color coding
  - [x] Scripture API integration
  - [x] Fallback verses for offline use
  - [x] Progress tracking
  - [x] Accuracy calculation

- [x] **iOS Background Audio**
  - [x] Native Swift audio session manager
  - [x] Silent audio loop
  - [x] Continuous playback when backgrounded
  - [x] React Native bridge module

- [x] **Settings & Customization**
  - [x] Famous verses mode (100 curated verses)
  - [x] Bible book selection (all 66 books)
  - [x] Search functionality
  - [x] Select All / Deselect All
  - [x] Settings persistence
  - [x] Settings screen UI

- [x] **UX Improvements**
  - [x] Dark theme UI
  - [x] Keyboard-aware scrolling
  - [x] Full-screen alarm modal
  - [x] Critical alerts (iOS)
  - [x] Vibration patterns

### 🚀 Future Enhancements
- [ ] **Android Background Audio** - Implement similar solution for Android
- [ ] **Custom Alarm Sounds** - Allow users to upload their own sounds
- [ ] **Verse History** - Track which verses users have typed
- [ ] **Statistics** - Show typing speed, accuracy over time
- [ ] **Multiple Dismissal Methods** - Math problems, photo challenges
- [ ] **Themes** - Light mode, custom color schemes
- [ ] **Verse Favorites** - Save favorite verses for quick access
- [ ] **Daily Verse Notification** - Optional daily Bible verse reminder
- [ ] **Offline Mode** - Full functionality without internet
- [ ] **Accessibility** - Screen reader support, larger fonts
- [ ] **Testing** - Unit tests, E2E tests

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

## Screenshots

_Coming soon - Add screenshots of alarm list, settings screen, and typing challenge_

## Platform Status

| Platform | Status | Notes |
|----------|--------|-------|
| **iOS** | ✅ Fully Functional | Includes background audio solution |
| **Android** | 🚧 In Progress | Core features working, background audio pending |

## Contributing

This is a personal project, but suggestions and improvements are welcome! Feel free to:
- Report bugs via Issues
- Suggest new features
- Submit pull requests

## Acknowledgments

- **Scripture API** - Bible verses provided by [scripture.api.bible](https://scripture.api.bible/)
- **Notifee** - Cross-platform notifications by [Invertase](https://notifee.app/)
- **React Native Community** - For excellent libraries and support

---

**Built with ❤️ using React Native and TypeScript**

Wake up with Scripture! 📖⏰
