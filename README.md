# AlarmClock - React Native Alarm App

A React Native alarm clock application with a unique dismissal mechanism: type Bible verses to turn off your alarm. This app helps you start your day with scripture memorization.

## Current Status

**Platform Status:**
- iOS: ✅ Working ~ still upgrading
- Android: work in progress

**Features Implemented:**
- Create and manage multiple alarms
- Custom alarm times with AM/PM picker
- Alarm labels and repeat schedules
- Bible verse typing challenge to dismiss alarms
- Random verse selection from Bible API
- Snooze functionality
- Full-screen alarm notifications
- Modern dark-themed UI
- Persistent storage

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- For iOS: macOS, Xcode 12+, CocoaPods
- For Android: Android Studio, Android SDK, JDK 11+ (currently not functional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ryderpongracic1/bible-verse-alarm-clock
cd alarm
```

2. Install dependencies:
```bash
cd AlarmClock
npm install
```

3. **Set up Bible API key:**
```bash
# Copy the example config file
cp src/config/config.example.ts src/config/config.ts

# Edit src/config/config.ts and add your Bible API key
# Get a free API key from: https://scripture.api.bible/
```

4. For iOS, install CocoaPods dependencies:
```bash
cd ios && pod install && cd ..
```

### Running the App (iOS only)

```bash
npm run ios
```

Or start Metro bundler separately:
```bash
npm start
```

## Project Structure

```
alarm/
├── AlarmClock/               # Main React Native app
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── config/          # Configuration (API keys - not committed)
│   │   ├── navigation/      # Navigation setup
│   │   ├── screens/         # Screen components
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Helper functions
│   ├── android/             # Android native code (not working)
│   ├── ios/                 # iOS native code (working)
│   ├── App.tsx              # Root component
│   └── package.json         # Dependencies
└── README.md                # This file
```

## Key Features

### Bible Verse Typing Challenge
- Fetches random Bible verses from the Scripture API
- Users must correctly type the verse to dismiss the alarm
- Helps with scripture memorization
- Fallback verses available if API is unavailable

### Alarm Management
- Multiple alarms with custom labels
- Repeat schedules (select specific days)
- Enable/disable alarms individually
- Persistent storage across app restarts

## Configuration Required

### Bible API Key
You **must** set up a Bible API key for the app to function properly:

1. Get a free API key from [Scripture API](https://scripture.api.bible/)
2. Copy `src/config/config.example.ts` to `src/config/config.ts`
3. Replace `'your-api-key-here'` with your actual API key

**Note:** The `config.ts` file is excluded from git to protect API keys.

## Known Issues

- **Android**: The Android version is currently not functional and needs debugging
- Sound playback may need additional configuration
- Background alarm triggering requires proper permissions setup

## Tech Stack

- React Native 0.74.5
- TypeScript
- React Navigation
- Notifee (notifications)
- AsyncStorage (data persistence)
- Scripture API (Bible verses)
- React Native Sound

## Documentation

For more detailed documentation, see:
- `AlarmClock/README.md` - Detailed app documentation
- `AlarmClock/PROJECT_SUMMARY.md` - Project overview
- `AlarmClock/ALARM_SOUND_SETUP.md` - Sound setup guide

## Contributing

This is a personal project. Suggestions and improvements are welcome!

## License

MIT License

---

Built with React Native and TypeScript
