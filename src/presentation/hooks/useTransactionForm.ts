// src/presentation/hooks/useTransactionForm.ts

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { TransactionType, Category } from '@domain';
import { IncomeCategory, ExpenseCategory } from '@domain/enums/Category';
import { useRepository } from './useRepository';

interface UseTransactionFormReturn {
  // Estado del formulario
  type: TransactionType;
  amount: string;
  description: string;
  category: Category | '';
  date: Date;
  loading: boolean;
  
  // Funciones para cambiar el estado
  setType: (type: TransactionType) => void;
  setAmount: (amount: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category: Category | '') => void;
  setDate: (date: Date) => void;
  
  // Utilidades
  categories: string[];
  handleSave: () => Promise<boolean>;
  resetForm: () => void;
}

/**
 * Hook para manejar el formulario de transacciones
 * 
 * Provee:
 * - Todo el estado del formulario
 * - Validaciones
 * - Lógica de guardado
 * - Reset del formulario
 */
export function useTransactionForm(): UseTransactionFormReturn {
  const repository = useRepository();
  
  // Estado del formulario
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Obtener categorías según el tipo
  const categories =
    type === TransactionType.INCOME
      ? Object.values(IncomeCategory)
      : Object.values(ExpenseCategory);

  // Cambiar tipo y resetear categoría
  const handleTypeChange = useCallback((newType: TransactionType) => {
    setType(newType);
    setCategory(''); // Limpiar categoría al cambiar tipo
  }, []);

  // Validar formulario
  const validateForm = useCallback((): boolean => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido mayor a 0');
      return false;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Ingresa una descripción');
      return false;
    }

    if (!category) {
      Alert.alert('Error', 'Selecciona una categoría');
      return false;
    }

    return true;
  }, [amount, description, category]);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setAmount('');
    setDescription('');
    setCategory('');
    setDate(new Date());
    // No resetear 'type' para que mantenga la última selección
  }, []);

  // Guardar transacción
  const handleSave = useCallback(async (): Promise<boolean> => {
    if (!validateForm()) return false;

    setLoading(true);

    try {
      await repository.create({
        amount: parseFloat(amount),
        type: type,
        description: description.trim(),
        category: category as Category,
        date: date,
      });

      Alert.alert('Éxito', 'Transacción guardada correctamente');
      resetForm();
      return true;
    } catch (error) {
      console.error('Error guardando transacción:', error);
      Alert.alert('Error', 'No se pudo guardar la transacción');
      return false;
    } finally {
      setLoading(false);
    }
  }, [validateForm, repository, amount, type, description, category, date, resetForm]);

  return {
    // Estado
    type,
    amount,
    description,
    category,
    date,
    loading,
    
    // Setters
    setType: handleTypeChange,
    setAmount,
    setDescription,
    setCategory,
    setDate,
    
    // Utilidades
    categories,
    handleSave,
    resetForm,
  };
}