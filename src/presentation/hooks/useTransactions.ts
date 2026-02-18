// src/presentation/hooks/useTransactions.ts

import { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionType } from '@domain';
import { useRepository } from './useRepository';

interface UseTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  ingresos: number;
  gastos: number;
  balance: number;
  reload: () => Promise<void>;
  onRefresh: () => void;
}

/**
 * Hook para manejar la lista de transacciones
 * 
 * Provee:
 * - Lista de transacciones
 * - Estados de carga
 * - Totales calculados
 * - Función para recargar
 */
export function useTransactions(): UseTransactionsReturn {
  const repository = useRepository();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar transacciones
  const loadTransactions = useCallback(async () => {
    try {
      setError(null);
      const data = await repository.getAll();
      setTransactions(data);
    } catch (err) {
      console.error('Error cargando transacciones:', err);
      setError('No se pudieron cargar las transacciones');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [repository]);

  // Cargar al montar el componente
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Función para refrescar (pull-to-refresh)
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTransactions();
  }, [loadTransactions]);

  // Calcular totales
  const ingresos = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const gastos = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = ingresos - gastos;

  return {
    transactions,
    loading,
    refreshing,
    error,
    ingresos,
    gastos,
    balance,
    reload: loadTransactions,
    onRefresh,
  };
}