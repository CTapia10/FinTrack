// app/_layout.tsx

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { DatabaseService } from '@infra/storage/DatabaseService';
import { ThemeProvider, useAppTheme } from '@presentation/context/ThemeContext';

function RootLayoutContent() {
  const { theme } = useAppTheme();

  useEffect(() => {
    // Inicializar la base de datos cuando la app arranca
    DatabaseService.getInstance().catch(error => {
      console.error('Error inicializando BD en RootLayout:', error);
    });
  }, []);

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}