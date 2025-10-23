/**
 * BackgroundAudioService.ts
 * Service wrapper for BackgroundAudioManager native module
 * Manages silent background audio to maintain iOS audio session when app is backgrounded
 */

import {NativeModules, Platform} from 'react-native';
import type {
  BackgroundAudioModule,
  BackgroundAudioResponse,
  BackgroundAudioStatusResponse,
} from '../types/BackgroundAudioModule';

const LINKING_ERROR =
  `The package 'BackgroundAudioManager' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ios: "- You have run 'pod install'\n", default: ''}) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const BackgroundAudioManager: BackgroundAudioModule =
  NativeModules.BackgroundAudioManager
    ? NativeModules.BackgroundAudioManager
    : new Proxy(
        {},
        {
          get() {
            throw new Error(LINKING_ERROR);
          },
        },
      );

/**
 * BackgroundAudioService
 * Singleton service for managing background audio session
 */
class BackgroundAudioService {
  private static instance: BackgroundAudioService;
  private isInitialized: boolean = false;

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): BackgroundAudioService {
    if (!BackgroundAudioService.instance) {
      BackgroundAudioService.instance = new BackgroundAudioService();
    }
    return BackgroundAudioService.instance;
  }

  /**
   * Start background audio session
   * This should be called when alarms are scheduled
   * iOS only - Android doesn't need this workaround
   */
  public async start(): Promise<void> {
    // Only run on iOS
    if (Platform.OS !== 'ios') {
      console.log('[BackgroundAudioService] Skipping on Android');
      return;
    }

    try {
      const response: BackgroundAudioResponse =
        await BackgroundAudioManager.startBackgroundAudio();
      console.log('[BackgroundAudioService] Started:', response.message);
      this.isInitialized = true;
    } catch (error) {
      console.error('[BackgroundAudioService] Failed to start:', error);
      throw error;
    }
  }

  /**
   * Stop background audio session
   * This should be called when no alarms are scheduled
   * iOS only - Android doesn't need this workaround
   */
  public async stop(): Promise<void> {
    // Only run on iOS
    if (Platform.OS !== 'ios') {
      console.log('[BackgroundAudioService] Skipping on Android');
      return;
    }

    try {
      const response: BackgroundAudioResponse =
        await BackgroundAudioManager.stopBackgroundAudio();
      console.log('[BackgroundAudioService] Stopped:', response.message);
      this.isInitialized = false;
    } catch (error) {
      console.error('[BackgroundAudioService] Failed to stop:', error);
      throw error;
    }
  }

  /**
   * Check if background audio is currently running
   * iOS only - Android returns false
   */
  public async isRunning(): Promise<boolean> {
    // Only run on iOS
    if (Platform.OS !== 'ios') {
      return false;
    }

    try {
      const response: BackgroundAudioStatusResponse =
        await BackgroundAudioManager.isBackgroundAudioRunning();
      return response.isRunning;
    } catch (error) {
      console.error('[BackgroundAudioService] Failed to check status:', error);
      return false;
    }
  }

  /**
   * Get initialization status
   */
  public getInitializedStatus(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export default BackgroundAudioService.getInstance();
