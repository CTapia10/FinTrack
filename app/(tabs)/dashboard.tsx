// app/(tabs)/dashboard.tsx

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, FAB, Chip } from 'react-native-paper';
import { SQLiteTransactionRepository } from '@infra/storage/SQLiteTransactionRepository';
import { Transaction, TransactionType } from '@domain';
import { useThemeColors } from '@shared/theme/useThemeColors';
import { useAppTheme } from '@presentation/context/ThemeContext';

export default function DashboardScreen() {
  // Temas y colores
  const colors = useThemeColors();
  const { theme } = useAppTheme();

  // Estado: datos que pueden cambiar y re-renderizar la UI
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Estilos dinámicos basados en el tema
  const dynamicStyles = useMemo(() => createStyles(colors, theme), [colors, theme]);

  // Función para cargar transacciones
  const loadTransactions = useCallback(async () => {
    const repository = new SQLiteTransactionRepository();
    try {
      const data = await repository.getAll();
      setTransactions(data);
    } catch (error) {
      console.error('Error cargando transacciones:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // useEffect: se ejecuta cuando el componente se monta
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Función para refrescar al hacer pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  // Calcular totales
  const ingresos = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const gastos = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = ingresos - gastos;

  // Renderizar cada transacción
  const renderTransaction = ({ item }: { item: Transaction }) => (
    <Card style={dynamicStyles.card}>
      <Card.Content>
        <View style={dynamicStyles.transactionRow}>
          <View style={dynamicStyles.transactionInfo}>
            <Text style={[{ color: colors.textPrimary, fontWeight: 'bold' }]}>
              {item.description}
            </Text>
            <Text style={[dynamicStyles.category]}>
              {item.category}
            </Text>
            <Text style={[dynamicStyles.date]}>
              {item.date.toLocaleDateString('es-AR')}
            </Text>
          </View>
          <View style={dynamicStyles.amountContainer}>
            <Text
              style={[
                { fontWeight: 'bold' },
                item.type === TransactionType.INCOME
                  ? dynamicStyles.income
                  : dynamicStyles.expense
              ]}
            >
              {item.type === TransactionType.INCOME ? '+' : '-'}$
              {item.amount.toLocaleString('es-AR')}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={dynamicStyles.container}>
      {/* Cabecera con totales */}
      <Card style={dynamicStyles.summaryCard}>
        <Card.Content>
          <Text style={[dynamicStyles.summaryLabel, { fontWeight: 'bold' }]}>
            Balance Total
          </Text>
          <Text
            style={[
              { fontWeight: 'bold' },
              dynamicStyles.balance,
              balance >= 0 ? dynamicStyles.income : dynamicStyles.expense,
            ]}
          >
            ${balance.toLocaleString('es-AR')}
          </Text>
          <View style={dynamicStyles.summaryRow}>
            <Chip icon="arrow-up" style={dynamicStyles.chipIncome}>
              Ingresos: ${ingresos.toLocaleString('es-AR')}
            </Chip>
            <Chip icon="arrow-down" style={dynamicStyles.chipExpense}>
              Gastos: ${gastos.toLocaleString('es-AR')}
            </Chip>
          </View>
        </Card.Content>
      </Card>

      {/* Lista de transacciones */}
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={dynamicStyles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={dynamicStyles.emptyContainer}>
            <Text style={[dynamicStyles.emptyText, { fontWeight: '500' }]}>
              No hay transacciones aún
            </Text>
            <Text style={[dynamicStyles.emptySubtext]}>
              Presiona el botón + para agregar una
            </Text>
          </View>
        }
      />

      {/* Botón flotante para agregar */}
      <FAB
        icon="plus"
        style={dynamicStyles.fab}
        onPress={() => {
          // Navegar a la pantalla de agregar
          // Por ahora solo un log
          console.log('Agregar transacción');
        }}
      />
    </View>
  );
}


const createStyles = (colors: ReturnType<typeof useThemeColors>, theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    summaryCard: {
      margin: 16,
      marginBottom: 8,
      backgroundColor: theme.colors.surface,
    },
    summaryLabel: {
      textAlign: 'center',
      opacity: 0.7,
      color: colors.textSecondary,
    },
    balance: {
      textAlign: 'center',
      fontWeight: 'bold',
      marginVertical: 8,
      color: colors.textPrimary,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 8,
    },
    chipIncome: {
      backgroundColor: colors.incomeChipBg,
    },
    chipExpense: {
      backgroundColor: colors.expenseChipBg,
    },
    list: {
      padding: 16,
      paddingTop: 8,
    },
    card: {
      marginBottom: 12,
      backgroundColor: theme.colors.surface,
    },
    transactionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    transactionInfo: {
      flex: 1,
    },
    category: {
      marginTop: 4,
      opacity: 0.7,
      color: colors.textSecondary,
    },
    date: {
      marginTop: 2,
      opacity: 0.5,
      color: colors.textTertiary,
    },
    amountContainer: {
      marginLeft: 16,
    },
    income: {
      color: colors.income,
      fontWeight: 'bold',
    },
    expense: {
      color: colors.expense,
      fontWeight: 'bold',
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
    },
    emptyText: {
      opacity: 0.5,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    emptySubtext: {
      opacity: 0.3,
      color: colors.textTertiary,
    },
    fab: {
      position: 'absolute',
      right: 16,
      bottom: 16,
    },
  });