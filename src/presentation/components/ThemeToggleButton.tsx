import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { useAppTheme } from '@presentation/context/ThemeContext';

/**
 * ThemeToggleButton - Botón para cambiar entre modos de tema (Light/Dark/Auto)
 * Se muestra en el header y permite alternar entre los diferentes modos
 */
export function ThemeToggleButton() {
  const { toggleTheme, isDarkTheme, theme } = useAppTheme();

  const getIconName = () => {
    return isDarkTheme ? 'moon-waning-crescent' : 'white-balance-sunny';
  };

  return (
    <View style={{ paddingRight: 16 }}>
      <Pressable
        onPress={toggleTheme}
        style={({ pressed }) => ({
          opacity: pressed ? 0.6 : 1,
          padding: 8,
        })}
      >
        <MaterialCommunityIcons
          name={getIconName()}
          size={24}
          color={theme.colors.primary}
        />
      </Pressable>
    </View>
  );
}
