// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@presentation/context/ThemeContext';
import { ThemeToggleButton } from '@presentation/components/ThemeToggleButton';

export default function TabLayout() {
  const { theme } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.tertiary,
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          color: theme.colors.onSurface,
        },
        headerRight: () => <ThemeToggleButton />,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
          headerTitle: 'Mis Finanzas',
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Agregar',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-circle" size={size} color={color} />
          ),
          headerTitle: 'Nueva Transacción',
        }}
      />
    </Tabs>
  );
}