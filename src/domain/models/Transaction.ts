// src/domain/models/Transaction.ts

import { TransactionType } from '../enums/TransactionType';
import { Category } from '../enums/Category';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;           // Ahora usamos el enum
  description: string;
  category: Category;              // Categoría del enum
  date: Date;
  createdAt: Date;
}