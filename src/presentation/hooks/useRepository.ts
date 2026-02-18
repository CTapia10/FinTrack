// src/presentation/hooks/useRepository.ts

import { useMemo } from 'react';
import { SQLiteTransactionRepository } from '@infra/storage/SQLiteTransactionRepository';

/**
 * Hook para obtener la instancia singleton del repositorio
 * 
 * ¿Por qué useMemo?
 * - Crea el repositorio solo UNA vez
 * - Lo reutiliza en todos los re-renders
 * - Evita crear múltiples conexiones a la BD
 */
export function useRepository() {
  const repository = useMemo(() => {
    return new SQLiteTransactionRepository();
  }, []); // Array vacío = solo se ejecuta una vez

  return repository;
}