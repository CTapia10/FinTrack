import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useThemeColors } from '@shared/theme/useThemeColors';
import { useAppTheme } from '@presentation/context/ThemeContext';
import { Button, TextInput, Card, SegmentedButtons } from 'react-native-paper';
import { useState } from 'react';

/**
 * AddTransactionScreen - Pantalla para agregar nuevas transacciones
 * Implementa soporte completo para temas claro y oscuro
 */
export default function AddTransactionScreen() {
  const colors = useThemeColors();
  const { theme } = useAppTheme();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 24,
    },
    formCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    label: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
      marginTop: 16,
    },
    input: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      color: colors.textPrimary,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },
    submitButton: {
      flex: 1,
    },
  });

  const handleSubmit = () => {
    // TODO: Implementar lógica de guardar transacción
    console.log({ type, amount, description });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Text style={styles.title}>Nueva Transacción</Text>

      <Card style={styles.formCard}>
        <Card.Content>
          <Text style={styles.label}>Tipo de Transacción</Text>
          <SegmentedButtons
            value={type}
            onValueChange={(value) => setType(value as 'income' | 'expense')}
            buttons={[
              { value: 'expense', label: 'Gasto', icon: 'minus-circle' },
              { value: 'income', label: 'Ingreso', icon: 'plus-circle' },
            ]}
            style={{ marginBottom: 16 }}
          />

          <Text style={styles.label}>Monto</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Ingresa una descripción..."
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={4}
            style={[styles.input, { height: 100 }]}
          />
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          textColor={theme.colors.primary}
          onPress={() => {
            setAmount('');
            setDescription('');
          }}
        >
          Limpiar
        </Button>
        <Button
          mode="contained"
          buttonColor={theme.colors.primary}
          textColor="white"
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          Guardar
        </Button>
      </View>
    </ScrollView>
  );
}
