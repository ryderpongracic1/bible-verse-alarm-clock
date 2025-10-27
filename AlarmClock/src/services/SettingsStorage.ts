/**
 * SettingsStorage.ts
 * Service for managing app settings in AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppSettings, DEFAULT_SETTINGS, getAllBookApiIds} from '../types/Settings';

const SETTINGS_STORAGE_KEY = '@app_settings';

export class SettingsStorage {
  /**
   * Get app settings from storage
   * On first run, initializes with all books selected
   */
  static async getSettings(): Promise<AppSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);
        return {...DEFAULT_SETTINGS, ...settings}; // Merge with defaults for any missing keys
      }

      // First run - initialize with all books selected
      const initialSettings: AppSettings = {
        ...DEFAULT_SETTINGS,
        selectedBooks: getAllBookApiIds(), // All 66 books selected by default
      };

      // Save initial settings
      await this.saveSettings(initialSettings);
      console.log('[SettingsStorage] Initialized with all books selected');

      return initialSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return {
        ...DEFAULT_SETTINGS,
        selectedBooks: getAllBookApiIds(), // Fallback to all books
      };
    }
  }

  /**
   * Save app settings to storage
   */
  static async saveSettings(settings: AppSettings): Promise<void> {
    try {
      const settingsJson = JSON.stringify(settings);
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, settingsJson);
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  /**
   * Update use famous verses setting
   */
  static async setUseFamousVerses(useFamousVerses: boolean): Promise<void> {
    const settings = await this.getSettings();
    settings.useFamousVerses = useFamousVerses;
    settings.verseSource = useFamousVerses ? 'famous' :
                          (settings.selectedBooks.length > 0 ? 'selected' : 'random');
    await this.saveSettings(settings);
  }

  /**
   * Update selected books
   */
  static async setSelectedBooks(bookApiIds: string[]): Promise<void> {
    const settings = await this.getSettings();
    settings.selectedBooks = bookApiIds;
    // Update verse source based on current state
    if (settings.useFamousVerses) {
      settings.verseSource = 'famous';
    } else {
      settings.verseSource = bookApiIds.length > 0 ? 'selected' : 'random';
    }
    await this.saveSettings(settings);
  }

  /**
   * Check if a book is selected
   */
  static async isBookSelected(bookApiId: string): Promise<boolean> {
    const settings = await this.getSettings();
    return settings.selectedBooks.includes(bookApiId);
  }

  /**
   * Get current verse source type
   */
  static async getVerseSource(): Promise<'random' | 'selected' | 'famous'> {
    const settings = await this.getSettings();
    return settings.verseSource;
  }

  /**
   * Clear all settings (reset to defaults)
   */
  static async clearSettings(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SETTINGS_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing settings:', error);
      throw error;
    }
  }
}
