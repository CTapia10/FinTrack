// src/infrastructure/storage/DatabaseService.ts

import * as SQLite from 'expo-sqlite';

export class DatabaseService {
  private static instance: SQLite.SQLiteDatabase | null = null;
  private static initializing: Promise<SQLite.SQLiteDatabase> | null = null;

  static async getInstance(): Promise<SQLite.SQLiteDatabase> {
    // Si ya está inicializado, retornarlo
    if (this.instance) {
      return this.instance;
    }

    // Si se está inicializando, esperar
    if (this.initializing) {
      return this.initializing;
    }

    // Inicializar
    this.initializing = this.initDb();
    this.instance = await this.initializing;
    this.initializing = null;

    return this.instance;
  }

  private static async initDb(): Promise<SQLite.SQLiteDatabase> {
    try {
      console.log('📂 Abriendo base de datos...');
      
      // Abrir con configuración estable
      const db = await SQLite.openDatabaseAsync('fintrack.db', {
        useNewConnection: true,
      });

      console.log('🛠️ Creando tabla si no existe...');
      
      // Crear tabla con runAsync (solo acepta 1 argumento)
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY NOT NULL,
          amount REAL NOT NULL,
          type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
          description TEXT NOT NULL,
          category TEXT NOT NULL,
          date TEXT NOT NULL,
          createdAt TEXT NOT NULL
        );`
      );

      console.log('✅ Base de datos inicializada correctamente');
      return db;
    } catch (error) {
      console.error('❌ Error inicializando base de datos:', error);
      throw error;
    }
  }

  static async closeDatabase(): Promise<void> {
    if (this.instance) {
      await this.instance.closeAsync();
      this.instance = null;
    }
  }
}