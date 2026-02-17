// src/infrastructure/storage/SQLiteTransactionRepository.ts

import { Transaction } from '../../domain/models/Transaction';
import { TransactionType } from '../../domain/enums/TransactionType';
import { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { DatabaseService } from './DatabaseService';

export class SQLiteTransactionRepository implements TransactionRepository {
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async getAll(): Promise<Transaction[]> {
    const db = await DatabaseService.getInstance();
    
    const result = await db.getAllAsync<Transaction>(
      'SELECT * FROM transactions ORDER BY date DESC'
    );
    
    return result.map(row => ({
      ...row,
      date: new Date(row.date),
      createdAt: new Date(row.createdAt),
      type: row.type as TransactionType
    }));
  }

  async getByType(type: TransactionType): Promise<Transaction[]> {
    const db = await DatabaseService.getInstance();
    
    const result = await db.getAllAsync<Transaction>(
      'SELECT * FROM transactions WHERE type = ? ORDER BY date DESC',
      [type]
    );
    
    return result.map(row => ({
      ...row,
      date: new Date(row.date),
      createdAt: new Date(row.createdAt),
      type: row.type as TransactionType
    }));
  }

  async getById(id: string): Promise<Transaction | null> {
    const db = await DatabaseService.getInstance();
    
    const result = await db.getFirstAsync<Transaction>(
      'SELECT * FROM transactions WHERE id = ?',
      [id]
    );
    
    if (!result) return null;
    
    return {
      ...result,
      date: new Date(result.date),
      createdAt: new Date(result.createdAt),
      type: result.type as TransactionType
    };
  }

  async create(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const db = await DatabaseService.getInstance();
    
    const id = this.generateId();
    const createdAt = new Date();
    
    await db.runAsync(
      `INSERT INTO transactions (id, amount, type, description, category, date, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        transaction.amount,
        transaction.type,
        transaction.description,
        transaction.category,
        transaction.date.toISOString(),
        createdAt.toISOString()
      ]
    );
    
    return {
      id,
      ...transaction,
      createdAt
    };
  }

  async update(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    const db = await DatabaseService.getInstance();
    
    const fields: string[] = [];
    const values: any[] = [];
    
    if (transaction.amount !== undefined) {
      fields.push('amount = ?');
      values.push(transaction.amount);
    }
    if (transaction.type !== undefined) {
      fields.push('type = ?');
      values.push(transaction.type);
    }
    if (transaction.description !== undefined) {
      fields.push('description = ?');
      values.push(transaction.description);
    }
    if (transaction.category !== undefined) {
      fields.push('category = ?');
      values.push(transaction.category);
    }
    if (transaction.date !== undefined) {
      fields.push('date = ?');
      values.push(transaction.date.toISOString());
    }
    
    values.push(id);
    
    await db.runAsync(
      `UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    const updated = await this.getById(id);
    if (!updated) throw new Error('Transaction not found after update');
    
    return updated;
  }

  async delete(id: string): Promise<void> {
    const db = await DatabaseService.getInstance();
    
    await db.runAsync(
      'DELETE FROM transactions WHERE id = ?',
      [id]
    );
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    const db = await DatabaseService.getInstance();
    
    const result = await db.getAllAsync<Transaction>(
      'SELECT * FROM transactions WHERE date BETWEEN ? AND ? ORDER BY date DESC',
      [startDate.toISOString(), endDate.toISOString()]
    );
    
    return result.map(row => ({
      ...row,
      date: new Date(row.date),
      createdAt: new Date(row.createdAt),
      type: row.type as TransactionType
    }));
  }
}