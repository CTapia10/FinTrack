/**
 * Color palette for light and dark themes
 * These colors are used throughout the app for consistent theming
 */

export const lightColors = {
  // Primary backgrounds
  background: '#f5f5f5',
  surface: '#ffffff',

  // Primary colors
  primary: '#6200ee',
  primaryContainer: '#bb86fc',
  secondary: '#03dac6',
  tertiary: '#7b5d00',

  // Semantic colors - Transaction types
  income: '#4caf50',
  incomeRed: '#2e7d32',
  incomeChipBg: '#e8f5e9',

  expense: '#f44336',
  expenseRed: '#c62828',
  expenseChipBg: '#ffebee',

  // Text
  textPrimary: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',

  // UI elements
  border: '#e0e0e0',
  divider: '#eeeeee',
  disabled: '#cccccc',

  // Status
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
};

export const darkColors = {
  // Primary backgrounds
  background: '#121212',
  surface: '#1e1e1e',

  // Primary colors
  primary: '#bb86fc',
  primaryContainer: '#3700b3',
  secondary: '#03dac6',
  tertiary: '#c4b900',

  // Semantic colors - Transaction types
  income: '#81c784',
  incomeRed: '#66bb6a',
  incomeChipBg: '#1b5e20',

  expense: '#ef5350',
  expenseRed: '#e53935',
  expenseChipBg: '#b71c1c',

  // Text
  textPrimary: '#ffffff',
  textSecondary: '#b3b3b3',
  textTertiary: '#808080',

  // UI elements
  border: '#333333',
  divider: '#404040',
  disabled: '#424242',

  // Status
  success: '#81c784',
  warning: '#ffb74d',
  error: '#ef5350',
  info: '#64b5f6',
};

export type ColorPalette = typeof lightColors;
