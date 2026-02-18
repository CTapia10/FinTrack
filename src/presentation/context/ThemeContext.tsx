// src/presentation/context/ThemeContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import {
  MD3LightTheme,
  MD3DarkTheme,
} from 'react-native-paper';
import { PreferenceService } from '@infra/storage/PreferenceService';
import { lightColors, darkColors } from '@shared/theme/colors';


// Combinar temas de Paper con colores personalizados
const CombinedDefaultTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Material Design 3 colors
    primary: lightColors.primary,
    primaryContainer: lightColors.primaryContainer,
    secondary: lightColors.secondary,
    tertiary: lightColors.tertiary,
    background: lightColors.background,
    surface: lightColors.surface,
    error: lightColors.error,
    // Custom app colors
    income: lightColors.income,
    incomeChipBg: lightColors.incomeChipBg,
    expense: lightColors.expense,
    expenseChipBg: lightColors.expenseChipBg,
  },
};

const CombinedDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Material Design 3 colors
    primary: darkColors.primary,
    primaryContainer: darkColors.primaryContainer,
    secondary: darkColors.secondary,
    tertiary: darkColors.tertiary,
    background: darkColors.background,
    surface: darkColors.surface,
    error: darkColors.error,
    // Custom app colors
    income: darkColors.income,
    incomeChipBg: darkColors.incomeChipBg,
    expense: darkColors.expense,
    expenseChipBg: darkColors.expenseChipBg,
  },
};


type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: typeof CombinedDefaultTheme;
  isDarkTheme: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme(); // Detecta tema del sistema
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const [isLoading, setIsLoading] = useState(true);

  // Cargar preferencia guardada al iniciar la app
  useEffect(() => {
    const loadThemePreference = async () => {
      const savedMode = await PreferenceService.getThemePreference();
      if (savedMode) {
        setThemeMode(savedMode as ThemeMode);
      }
      setIsLoading(false);
    };
    loadThemePreference();
  }, []);

  // Guardar preferencia cuando cambie
  useEffect(() => {
    if (!isLoading) {
      PreferenceService.setThemePreference(themeMode);
    }
  }, [themeMode, isLoading]);

  // Determinar si usar dark theme
  const isDarkTheme =
    themeMode === 'auto'
      ? colorScheme === 'dark'
      : themeMode === 'dark';

  // Seleccionar tema
  const theme = isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme;

  // Toggle simple entre light y dark
  const toggleTheme = () => {
    setThemeMode((current) => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'auto';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkTheme,
        themeMode,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personalizado para usar el tema
export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme debe usarse dentro de ThemeProvider');
  }
  return context;
}