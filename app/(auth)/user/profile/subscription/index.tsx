import { Text } from "@/components/ThemedText";
import { PageContainer } from "@/components/PageContainer";
import { StyleSheet, View } from "react-native";
import { Badge } from "@/components/Badge";
import { FlatList } from "react-native-gesture-handler";

const MOCK_HISTORY = [
  {
    date: "Fev 2025",
    amount: 100,
    status: "success",
  },
  {
    date: "Jan 2025",
    amount: 100,
    status: "success",
  },
  {
    date: "Dez 2024",
    amount: 100,
    status: "success",
  },
];

export default function EditProfilePage() {
  return (
    <PageContainer contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text type="subtitle">Plano Premium</Text>
            <Text>Ativo</Text>
          </View>
          <Badge text="R$ 100" color="#fff" backgroundColor="#4F46E5" />
        </View>
        {/* Separator */}
        <View
          style={{
            height: 1,
            backgroundColor: "#E5E7EB",
            marginVertical: 10,
          }}
        />

        <Text>Próximo pagamento: 8 de março de 2025</Text>
      </View>

      <View>
        <Text type="subtitle">Histórico de Pagamentos</Text>

        <FlatList
          contentContainerStyle={{
            paddingBottom: 20,
            paddingTop: 10,
          }}
          data={MOCK_HISTORY}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <View
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
                styles.card,
              ]}
            >
              <Text type="defaultSemiBold">{item.date}</Text>
              <Text type="defaultSemiBold">R$ {item.amount}</Text>
            </View>
          )}
        />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 52,
  },

  submitButton: {
    marginTop: 20,
    width: "100%",
  },

  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
});
