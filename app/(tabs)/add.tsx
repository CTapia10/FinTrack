// app/(tabs)/add.tsx

import React, { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import {
  TextInput,
  Button,
  SegmentedButtons,
  Text,
  Card,
  Menu,
  Divider,
} from 'react-native-paper';
import { SQLiteTransactionRepository } from '@infra/storage/SQLiteTransactionRepository';
import { TransactionType } from '@domain';
import { IncomeCategory, ExpenseCategory, Category } from '@domain/enums/Category';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@shared/theme/useThemeColors';
import { useAppTheme } from '@presentation/context/ThemeContext';

export default function AddScreen() {
  // Router para navegación
  const router = useRouter();

  // Temas y colores
  const colors = useThemeColors();
  const { theme } = useAppTheme();

  // Estado del formulario
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Estado para el menú de categorías
  const [menuVisible, setMenuVisible] = useState(false);

  // Instancia del repositorio
  const repository = new SQLiteTransactionRepository();

  // Estilos dinámicos basados en el tema
  const dynamicStyles = useMemo(() => createStyles(colors, theme), [colors, theme]);

  // Obtener categorías según el tipo
  const categories =
    type === TransactionType.INCOME
      ? Object.values(IncomeCategory)
      : Object.values(ExpenseCategory);

  // Cuando cambia el tipo, resetear la categoría
  const handleTypeChange = (newType: string) => {
    setType(newType as TransactionType);
    setCategory(''); // Resetear categoría al cambiar tipo
  };

  // Validar formulario
  const validateForm = (): boolean => {
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
  };

  // Guardar transacción
  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
        await repository.create({
          amount: parseFloat(amount),
          type: type,
          description: description.trim(),
          category: category as Category,  // ← Agregamos type assertion
          date: date,
        });

      Alert.alert('Éxito', 'Transacción guardada correctamente', [
        {
          text: 'OK',
          onPress: () => {
            // Limpiar formulario
            setAmount('');
            setDescription('');
            setCategory('');
            setDate(new Date());

            // Volver al dashboard
            router.push('/(tabs)/dashboard');
          },
        },
      ]);
    } catch (error) {
      console.error('Error guardando transacción:', error);
      Alert.alert('Error', 'No se pudo guardar la transacción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={dynamicStyles.container}>
      <Card style={dynamicStyles.card}>
        <Card.Content>
          {/* Selector de tipo */}
          <Text style={[dynamicStyles.label, { fontWeight: 'bold' }]}>
            Tipo de transacción
          </Text>
          <SegmentedButtons
            value={type}
            onValueChange={handleTypeChange}
            buttons={[
              {
                value: TransactionType.INCOME,
                label: 'Ingreso',
                icon: 'arrow-up',
              },
              {
                value: TransactionType.EXPENSE,
                label: 'Gasto',
                icon: 'arrow-down',
              },
            ]}
            style={dynamicStyles.segmented}
          />

          {/* Monto */}
          <Text style={[dynamicStyles.label, { fontWeight: 'bold' }]}>
            Monto
          </Text>
          <TextInput
            mode="outlined"
            label="Monto"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            left={<TextInput.Icon icon="currency-usd" />}
            placeholder="0.00"
            style={dynamicStyles.input}
          />

          {/* Descripción */}
          <Text style={[dynamicStyles.label, { fontWeight: 'bold' }]}>
            Descripción
          </Text>
          <TextInput
            mode="outlined"
            label="Descripción"
            value={description}
            onChangeText={setDescription}
            left={<TextInput.Icon icon="text" />}
            placeholder="Ej: Supermercado"
            style={dynamicStyles.input}
          />

          {/* Categoría */}
          <Text style={[dynamicStyles.label, { fontWeight: 'bold' }]}>
            Categoría
          </Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                icon="chevron-down"
                contentStyle={dynamicStyles.categoryButton}
                style={dynamicStyles.input}
              >
                {category || 'Selecciona una categoría'}
              </Button>
            }
          >
            {categories.map((cat) => (
              <React.Fragment key={cat}>
                <Menu.Item
                  onPress={() => {
                    setCategory(cat);
                    setMenuVisible(false);
                  }}
                  title={cat}
                />
                <Divider />
              </React.Fragment>
            ))}
          </Menu>

          {/* Fecha */}
          <Text style={[dynamicStyles.label, { fontWeight: 'bold' }]}>
            Fecha
          </Text>
          <TextInput
            mode="outlined"
            label="Fecha"
            value={date.toLocaleDateString('es-AR')}
            editable={false}
            left={<TextInput.Icon icon="calendar" />}
            style={dynamicStyles.input}
          />
          <Text style={[dynamicStyles.dateNote]}>
            Por ahora usa la fecha actual. Selector de fecha próximamente.
          </Text>

          {/* Botón guardar */}
          <Button
            mode="contained"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            style={dynamicStyles.saveButton}
            icon="check"
          >
            Guardar Transacción
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}


const createStyles = (colors: ReturnType<typeof useThemeColors>, theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    card: {
      margin: 16,
      backgroundColor: theme.colors.surface,
    },
    label: {
      marginTop: 16,
      marginBottom: 8,
      color: colors.textPrimary,
    },
    segmented: {
      marginBottom: 8,
    },
    input: {
      marginBottom: 8,
      backgroundColor: colors.background,
    },
    categoryButton: {
      justifyContent: 'flex-start',
    },
    dateNote: {
      opacity: 0.6,
      fontStyle: 'italic',
      marginBottom: 8,
      color: colors.textSecondary,
    },
    saveButton: {
      marginTop: 24,
      paddingVertical: 6,
    },
  });