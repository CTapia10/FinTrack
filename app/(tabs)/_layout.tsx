// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme, Text } from 'react-native';

function MyComponent() {
  const colorScheme = useColorScheme();
  return <Text>{colorScheme === 'dark' ? 'Dark Mode' : 'Light Mode'}</Text>;
}   

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: '#999',
        headerShown: true,
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