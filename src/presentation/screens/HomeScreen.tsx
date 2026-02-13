import { View, Text, FlatList } from "react-native";
import { getTransactions } from "../../application/usecases/getTransactions";

export default function HomeScreen() {
  const transactions = getTransactions();

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>
            {item.category} - ${item.amount}
          </Text>
        )}
      />
    </View>
  );
}
