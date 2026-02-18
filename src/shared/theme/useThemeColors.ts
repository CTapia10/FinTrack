import { useAppTheme } from '@presentation/context/ThemeContext';
import { lightColors, darkColors, ColorPalette } from './colors';

/**
 * Hook to access the current theme colors
 * Returns the color palette based on the current theme (light or dark)
 */
export function useThemeColors(): ColorPalette {
  const { isDarkTheme } = useAppTheme();
  return isDarkTheme ? darkColors : lightColors;
}
