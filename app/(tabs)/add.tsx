// app/(tabs)/add.tsx

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
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

export default function AddScreen() {
  // Router para navegación
  const router = useRouter();

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
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {/* Selector de tipo */}
          <Text variant="titleMedium" style={styles.label}>
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
            style={styles.segmented}
          />

          {/* Monto */}
          <Text variant="titleMedium" style={styles.label}>
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
            style={styles.input}
          />

          {/* Descripción */}
          <Text variant="titleMedium" style={styles.label}>
            Descripción
          </Text>
          <TextInput
            mode="outlined"
            label="Descripción"
            value={description}
            onChangeText={setDescription}
            left={<TextInput.Icon icon="text" />}
            placeholder="Ej: Supermercado"
            style={styles.input}
          />

          {/* Categoría */}
          <Text variant="titleMedium" style={styles.label}>
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
                contentStyle={styles.categoryButton}
                style={styles.input}
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
          <Text variant="titleMedium" style={styles.label}>
            Fecha
          </Text>
          <TextInput
            mode="outlined"
            label="Fecha"
            value={date.toLocaleDateString('es-AR')}
            editable={false}
            left={<TextInput.Icon icon="calendar" />}
            style={styles.input}
          />
          <Text variant="bodySmall" style={styles.dateNote}>
            Por ahora usa la fecha actual. Selector de fecha próximamente.
          </Text>

          {/* Botón guardar */}
          <Button
            mode="contained"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            style={styles.saveButton}
            icon="check"
          >
            Guardar Transacción
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#353232',
  },
  card: {
    margin: 16,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
  },
  segmented: {
    marginBottom: 8,
  },
  input: {
    marginBottom: 8,
  },
  categoryButton: {
    justifyContent: 'flex-start',
  },
  dateNote: {
    opacity: 0.6,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 24,
    paddingVertical: 6,
  },
});