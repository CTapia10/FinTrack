import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_PREFERENCE_KEY = '@appfintrack_theme_mode';

/**
 * PreferenceService handles persistence of user preferences
 * Currently manages theme preference (light/dark/auto)
 */
export class PreferenceService {
  /**
   * Retrieves the stored theme preference from AsyncStorage
   * @returns The saved theme mode ('light', 'dark', or 'auto'), or null if not found
   */
  static async getThemePreference(): Promise<string | null> {
    try {
      const value = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
      return value;
    } catch (error) {
      console.error('Error reading theme preference:', error);
      return null;
    }
  }

  /**
   * Saves the theme preference to AsyncStorage
   * @param mode The theme mode to save ('light', 'dark', or 'auto')
   */
  static async setThemePreference(mode: string): Promise<void> {
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }
}
