// src/infrastructure/storage/schema.ts

import * as SQLite from 'expo-sqlite';

export const DATABASE_NAME = 'fintrack.db';

// SQL para crear la tabla de transacciones
export const CREATE_TRANSACTIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );
`;

// Función para inicializar la base de datos
export async function initializeDatabase(): Promise<SQLite.SQLiteDatabase> {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    
    // Usar runAsync en lugar de execAsync para evitar problemas con NullPointerException
    await db.runAsync(CREATE_TRANSACTIONS_TABLE);
    
    console.log('✅ Base de datos inicializada correctamente');
    
    return db;
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    throw error;
  }
}