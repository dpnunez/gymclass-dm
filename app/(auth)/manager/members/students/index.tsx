import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import Icon from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firebaseDb } from "@/firebase.config";

interface Student {
  id: string;
  name: string;
  avatar: string;
  paid: boolean;
}

export default function StudentListScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadStudents = async () => {
      const q = query(collection(firebaseDb, "userRole"), where("role", "==", "consumer"));
      const snapshot = await getDocs(q);

      const loaded = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().displayName || "Sem nome",
        avatar: doc.data().profilePicture || "https://via.placeholder.com/48",
        paid: doc.data().paid ?? false, // ou adapte conforme seu campo real
      }));

      setStudents(loaded);
    };

    loadStudents();
  }, []);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageContainer as={View} style={styles.container}>
      {/* Cards de resumo */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total de Membros</Text>
          <Text style={styles.summaryValue}>{students.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Pagamentos Atrasados</Text>
          <Text style={[styles.summaryValue, { color: "#ef4444" }]}>
            {students.filter(s => !s.paid).length}
          </Text>
        </View>
      </View>

      {/* Filtro e busca */}
      <View style={styles.header}>
        <Text style={styles.title}>Membros</Text>
        <View style={styles.iconGroup}>
          <Icon name="search" size={20} color="#444" />
        </View>
      </View>

      <TextInput
        placeholder="Buscar aluno..."
        value={search}
        onChangeText={setSearch}
        style={{
          backgroundColor: "#fff",
          padding: 10,
          borderRadius: 10,
          marginBottom: 12,
        }}
      />

      {/* Lista */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/(auth)/manager/members/students/profile?id=${item.id}`)}
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