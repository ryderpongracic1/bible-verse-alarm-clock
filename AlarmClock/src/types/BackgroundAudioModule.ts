/**
 * BackgroundAudioModule.ts
 * TypeScript types for the native BackgroundAudioManager module
 */

export interface BackgroundAudioResponse {
  status: string;
  message: string;
}

export interface BackgroundAudioStatusResponse {
  isRunning: boolean;
}

export interface BackgroundAudioModule {
  /**
   * Start the background audio session with silent sound loop
   * This allows the app to maintain an active audio session when backgrounded
   */
  startBackgroundAudio(): Promise<BackgroundAudioResponse>;

  /**
   * Stop the background audio session
   * Call this when no alarms are scheduled or app is being terminated
   */
  stopBackgroundAudio(): Promise<BackgroundAudioResponse>;

  /**
   * Check if background audio is currently running
   */
  isBackgroundAudioRunning(): Promise<BackgroundAudioStatusResponse>;
}
