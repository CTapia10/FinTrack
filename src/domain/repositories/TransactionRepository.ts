// src/domain/repositories/TransactionRepository.ts

import { Transaction } from '../models/Transaction';
import { TransactionType } from '../enums/TransactionType';

export interface TransactionRepository {
  // Obtener todas las transacciones
  getAll(): Promise<Transaction[]>;
  
  // Obtener transacciones por tipo (ingresos o gastos)
  getByType(type: TransactionType): Promise<Transaction[]>;
  
  // Obtener una transacción por ID
  getById(id: string): Promise<Transaction | null>;
  
  // Crear una nueva transacción
  create(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction>;
  
  // Actualizar una transacción existente
  update(id: string, transaction: Partial<Transaction>): Promise<Transaction>;
  
  // Eliminar una transacción
  delete(id: string): Promise<void>;
  
  // Obtener transacciones de un rango de fechas
  getByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]>;
}