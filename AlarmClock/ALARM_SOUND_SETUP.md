# iOS Alarm Sound Setup Guide

The alarm now uses a continuous ringing sound instead of a one-time notification.

## Current Status

**The app works right now with vibration only.** Adding a sound file is optional but recommended for a better alarm experience.

- ✅ **Without sound file:** Alarm uses continuous vibration
- ✅ **With sound file:** Alarm uses continuous sound + vibration

## Adding Sound (Optional but Recommended)

To add an alarm sound file to your iOS project:

## Quick Setup

### Step 1: Get an Alarm Sound File
You need an `alarm.mp3` file. You can:
- Download a free alarm sound from [FreeSound](https://freesound.org) or [ZapSplat](https://www.zapsplat.com)
- Use any MP3 file and rename it to `alarm.mp3`
- Use a simple alarm tone (recommended: 3-10 seconds that loops well)

### Step 2: Add Sound to iOS Project

1. Open Xcode:
   ```bash
   open ios/AlarmClock.xcworkspace
   ```

2. In Xcode's Project Navigator (left sidebar), right-click on the `AlarmClock` folder (the blue folder icon)

3. Select **"Add Files to AlarmClock..."**

4. Browse to your `alarm.mp3` file and select it

5. **IMPORTANT:** In the dialog that appears, make sure to check:
   - ✅ "Copy items if needed"
   - ✅ "Add to targets: AlarmClock" (should be checked)

6. Click "Add"

7. Verify the file appears in your Xcode project under the AlarmClock folder

### Step 3: Rebuild the App

```bash
# Clean build folder
cd ios
rm -rf build
cd ..

# Reinstall pods (if needed)
cd ios && pod install && cd ..

# Run the app
npm run ios
```

## Alternative: Using Assets Folder

If you prefer to keep sound files in a dedicated folder:

1. Create an assets folder in your project:
   ```bash
   mkdir -p AlarmClock/assets/sounds
   ```

2. Copy your alarm.mp3 file there:
   ```bash
   cp /path/to/your/alarm.mp3 AlarmClock/assets/sounds/
   ```

3. Follow the same Xcode steps above to add the file from the assets folder

## Testing the Alarm Sound

1. Run your app on a physical iOS device (simulator may not properly play alarm sounds)
2. Create a test alarm for 1-2 minutes from now
3. Lock your device or put the app in background
4. Wait for the alarm to trigger
5. You should hear the continuous alarm sound and see the alarm screen

## Troubleshooting

### Warning messages in console
If you see these warnings, they are **expected** until you add the sound file:
```
[SoundService] Sound file not found: alarm.mp3
[SoundService] Using vibration-only mode. Add alarm.mp3 to enable sound.
```

The alarm will still work with vibration. These warnings will disappear once you add `alarm.mp3`.

### Sound doesn't play
- Make sure the file is named exactly `alarm.mp3` (case-sensitive)
- Verify the file is added to the AlarmClock target in Xcode
- Check that your device volume is turned up
- Check that silent mode is OFF (the SoundService uses 'Playback' category which respects silent mode)
- Try running: `npm run ios` to rebuild

### Sound plays once but doesn't loop
- Check the console logs for any Sound errors
- Make sure the MP3 file is not corrupted
- Try a different MP3 file

### Permission Issues
- The app should request notification permissions on first launch
- Go to Settings > AlarmClock > Notifications and ensure notifications are enabled
- For critical alerts (which bypass Do Not Disturb), you may need special entitlements

## Technical Details

The alarm sound implementation uses:
- **react-native-sound** for continuous audio playback
- Loops indefinitely until dismissed or snoozed
- Plays at maximum volume (1.0)
- Uses 'Playback' category to play even in silent mode
- Located in: `src/services/SoundService.ts`

## Customizing Alarm Sounds

To add multiple alarm sound options:

1. Add multiple MP3 files to the Xcode project (e.g., `gentle.mp3`, `loud.mp3`)
2. The sound picker in the alarm edit screen already passes the sound name
3. The SoundService will automatically use the specified sound file

## Need Help?

If you're having issues:
1. Check Xcode console for error messages
2. Verify the sound file is properly added to the bundle
3. Make sure you're testing on a real device (not simulator)
4. Check that all pods are properly installed: `cd ios && pod install`
