// app/(tabs)/dashboard.tsx

import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, FAB, Chip } from 'react-native-paper';
import { SQLiteTransactionRepository } from '@infra/storage/SQLiteTransactionRepository';
import { Transaction, TransactionType } from '@domain';
import { IncomeCategory, ExpenseCategory } from '@domain/enums/Category';

export default function DashboardScreen() {
  // Estado: datos que pueden cambiar y re-renderizar la UI
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Instancia del repositorio
  const repository = new SQLiteTransactionRepository();

  // Función para cargar transacciones
  const loadTransactions = async () => {
    try {
      const data = await repository.getAll();
      setTransactions(data);
    } catch (error) {
      console.error('Error cargando transacciones:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // useEffect: se ejecuta cuando el componente se monta
// useEffect: se ejecuta cuando el componente se monta
useEffect(() => {
  loadTransactions();
  //addTestData(); // ← Descomenta esta línea para agregar datos de prueba
}, []);


// Función para agregar datos de prueba (solo para desarrollo)
const addTestData = async () => {
  try {
    await repository.create({
      amount: 50000,
      type: TransactionType.INCOME,
      description: 'Salario de Enero',
      category: IncomeCategory.SALARY,  // ← Cambio aquí
      date: new Date('2026-02-01'),
    });

    await repository.create({
      amount: 1500,
      type: TransactionType.EXPENSE,
      description: 'Supermercado',
      category: ExpenseCategory.FOOD,  // ← Cambio aquí
      date: new Date('2026-02-05'),
    });

    await repository.create({
      amount: 800,
      type: TransactionType.EXPENSE,
      description: 'Nafta',
      category: ExpenseCategory.TRANSPORT,  // ← Cambio aquí
      date: new Date('2026-02-10'),
    });

    await repository.create({
      amount: 5000,
      type: TransactionType.INCOME,
      description: 'Freelance',
      category: IncomeCategory.FREELANCE,  // ← Cambio aquí
      date: new Date('2026-02-12'),
    });

    console.log('✅ Datos de prueba agregados');
    loadTransactions();
  } catch (error) {
    console.error('Error agregando datos de prueba:', error);
  }
};

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
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.transactionRow}>
          <View style={styles.transactionInfo}>
            <Text variant="titleMedium">{item.description}</Text>
            <Text variant="bodySmall" style={styles.category}>
              {item.category}
            </Text>
            <Text variant="bodySmall" style={styles.date}>
              {item.date.toLocaleDateString('es-AR')}
            </Text>
          </View>
          <View style={styles.amountContainer}>
            <Text
              variant="titleLarge"
              style={
                item.type === TransactionType.INCOME
                  ? styles.income
                  : styles.expense
              }
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
    <View style={styles.container}>
      {/* Cabecera con totales */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleSmall" style={styles.summaryLabel}>
            Balance Total
          </Text>
          <Text
            variant="displaySmall"
            style={[
              styles.balance,
              balance >= 0 ? styles.income : styles.expense,
            ]}
          >
            ${balance.toLocaleString('es-AR')}
          </Text>
          <View style={styles.summaryRow}>
            <Chip icon="arrow-up" style={styles.chipIncome}>
              Ingresos: ${ingresos.toLocaleString('es-AR')}
            </Chip>
            <Chip icon="arrow-down" style={styles.chipExpense}>
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
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No hay transacciones aún
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Presiona el botón + para agregar una
            </Text>
          </View>
        }
      />

      {/* Botón flotante para agregar */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          // Navegar a la pantalla de agregar
          // Por ahora solo un log
          console.log('Agregar transacción');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#353232',
  },
  summaryCard: {
    margin: 16,
    marginBottom: 8,
  },
  summaryLabel: {
    textAlign: 'center',
    opacity: 0.7,
  },
  balance: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  chipIncome: {
    backgroundColor: '#27442a',
  },
  chipExpense: {
    backgroundColor: '#6d3039',
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    marginBottom: 12,
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
  },
  date: {
    marginTop: 2,
    opacity: 0.5,
  },
  amountContainer: {
    marginLeft: 16,
  },
  income: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  expense: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    opacity: 0.5,
    marginBottom: 8,
  },
  emptySubtext: {
    opacity: 0.3,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});