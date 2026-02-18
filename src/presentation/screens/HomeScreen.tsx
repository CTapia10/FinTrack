import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useThemeColors } from '@shared/theme/useThemeColors';

/**
 * HomeScreen - Pantalla de inicio con lista de transacciones
 * Implementa soporte completo para temas claro y oscuro
 */
export default function HomeScreen() {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: any) => (
          <Text style={{ color: colors.textPrimary }}>
            {item.category} - ${item.amount}
          </Text>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay transacciones registradas</Text>
        }
      />
    </View>
  );
}
