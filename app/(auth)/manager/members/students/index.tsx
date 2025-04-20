import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useState } from "react";
import Icon from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";

const students = [
  {
    id: "#12458",
    name: "João Silva",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    paid: true,
  },
  {
    id: "#12459",
    name: "Tadeu Abreu",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    paid: false,
  },
  {
    id: "#12460",
    name: "Eduardo Domingos",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    paid: true,
  },
  {
    id: "#12461",
    name: "Samuel Mendona",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    paid: false,
  },
  {
    id: "#12462",
    name: "Thiago Tranquilo",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    paid: true,
  },
  {
    id: "#12463",
    name: "Julia Silva",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    paid: false,
  },
];

export default function StudentListScreen() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  return (
    <PageContainer as={View} style={styles.container}>
      {/* Cards de resumo */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total de Membros</Text>
          <Text style={styles.summaryValue}>248</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Pagamentos Atrasados</Text>
          <Text style={[styles.summaryValue, { color: "#ef4444" }]}>12</Text>
        </View>
      </View>

      {/* Filtro e busca */}
      <View style={styles.header}>
        <Text style={styles.title}>Membros</Text>
        <View style={styles.iconGroup}>
          <Icon name="filter" size={20} color="#444" />
          <Icon name="search" size={20} color="#444" />
        </View>
      </View>

      {/* Lista */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push(
                `/(auth)/manager/members/students/profile`
              )
            }
            style={styles.card}
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.id}>{`ID: ${item.id}`}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: item.paid ? "#d1fae5" : "#fee2e2" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: item.paid ? "#059669" : "#dc2626" },
                ]}
              >
                {item.paid ? "Pago" : "Não pago"}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  iconGroup: {
    flexDirection: "row",
    gap: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: "600",
  },
  id: {
    fontSize: 12,
    color: "#6b7280",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 9999,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
