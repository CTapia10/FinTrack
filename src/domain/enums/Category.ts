// src/domain/enums/Category.ts

export enum IncomeCategory {
  SALARY = 'Salario',
  FREELANCE = 'Freelance',
  INVESTMENT = 'Inversiones',
  GIFT = 'Regalo',
  OTHER_INCOME = 'Otro ingreso'
}

export enum ExpenseCategory {
  FOOD = 'Comida',
  TRANSPORT = 'Transporte',
  HOUSING = 'Vivienda',
  UTILITIES = 'Servicios',
  ENTERTAINMENT = 'Entretenimiento',
  HEALTH = 'Salud',
  EDUCATION = 'Educación',
  SHOPPING = 'Compras',
  OTHER_EXPENSE = 'Otro gasto'
}

// Type helper para obtener todas las categorías
export type Category = IncomeCategory | ExpenseCategory;