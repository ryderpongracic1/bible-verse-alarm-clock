import Sound from 'react-native-sound';
import {Platform, Vibration} from 'react-native';

class SoundService {
  private static instance: SoundService;
  private currentSound: Sound | null = null;
  private soundLoaded: boolean = false;
  private fallbackInterval: NodeJS.Timeout | null = null;

  private constructor() {
    // Enable playback in silence mode (iOS) and mix with other audio
    Sound.setCategory('Playback', true);
  }

  public static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  /**
   * Play an alarm sound continuously
   * @param soundName - The name of the sound file (without extension) or 'default' for system sound
   */
  public playAlarmSound(soundName: string = 'default'): void {
    // Stop any currently playing sound first
    this.stopSound();

    // Try to load the sound file from the app bundle
    const soundFile = soundName === 'default' ? 'alarm' : soundName;

    console.log(`[SoundService] Attempting to load sound: ${soundFile}.mp3`);

    this.currentSound = new Sound(
      `${soundFile}.mp3`,
      Sound.MAIN_BUNDLE,
      (error) => {
        if (error) {
          console.warn(`[SoundService] Sound file not found: ${soundFile}.mp3`);
          console.warn('[SoundService] Using vibration-only mode. Add alarm.mp3 to enable sound.');
          console.warn('[SoundService] See ALARM_SOUND_SETUP.md for instructions.');

          // Don't try other fallbacks that will also fail
          // Just log a helpful message
          this.soundLoaded = false;
          return;
        }

        console.log('[SoundService] Sound loaded successfully!');
        this.soundLoaded = true;
        this.playSoundLoop();
      }
    );
  }

  /**
   * Configure and play the sound in a loop
   */
  private playSoundLoop(): void {
    if (!this.currentSound) return;

    // Set the sound to loop indefinitely
    this.currentSound.setNumberOfLoops(-1);

    // Set volume to maximum
    this.currentSound.setVolume(1.0);

    // Play the sound
    this.currentSound.play((success) => {
      if (!success) {
        console.error('Playback failed');
      }
    });
  }

  /**
   * Stop the currently playing alarm sound
   */
  public stopSound(): void {
    if (this.currentSound) {
      this.currentSound.stop(() => {
        this.currentSound?.release();
        this.currentSound = null;
        this.soundLoaded = false;
      });
    }

    // Clear any fallback intervals
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }
  }

  /**
   * Check if a sound is currently playing
   */
  public isPlaying(): boolean {
    return this.soundLoaded && this.currentSound !== null;
  }
}

export default SoundService.getInstance();
