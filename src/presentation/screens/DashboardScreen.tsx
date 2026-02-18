import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useThemeColors } from '@shared/theme/useThemeColors';
import { useAppTheme } from '@presentation/context/ThemeContext';
import { Card } from 'react-native-paper';

/**
 * DashboardScreen - Pantalla principal que muestra un resumen de las finanzas
 * Implementa soporte completo para temas claro y oscuro
 */
export default function DashboardScreen() {
  const colors = useThemeColors();
  const { theme } = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 20,
    },
    summaryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      gap: 12,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    summaryLabel: {
      color: colors.textSecondary,
      fontSize: 12,
      marginBottom: 8,
    },
    summaryValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    incomeValue: {
      color: colors.income,
    },
    expenseValue: {
      color: colors.expense,
    },
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Text style={styles.title}>Resumen Financiero</Text>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Ingresos</Text>
          <Text style={[styles.summaryValue, styles.incomeValue]}>$0.00</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Egresos</Text>
          <Text style={[styles.summaryValue, styles.expenseValue]}>$0.00</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Balance</Text>
          <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>$0.00</Text>
        </View>
      </View>

      <Card style={{ backgroundColor: theme.colors.surface }}>
        <Card.Content>
          <Text style={{ color: colors.textSecondary }}>
            No hay transacciones registradas aún
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
