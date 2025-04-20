import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";

const modalities = [
  {
    name: "Yoga Matinal",
    date: "15 de Janeiro de 2025",
    duration: "45 min",
    professor: "Prof Marcos",
    image: "https://source.unsplash.com/featured/?yoga",
  },
  {
    name: "Pilates Básico",
    date: "12 de Janeiro de 2025",
    duration: "30 min",
    professor: "Prof Mariana",
    image: "https://source.unsplash.com/featured/?pilates",
  },
  {
    name: "Meditação",
    date: "10 de Janeiro de 2025",
    duration: "20 min",
    professor: "Prof Jurandir",
    image: "https://source.unsplash.com/featured/?meditation",
  },
  {
    name: "Treino HIIT",
    date: "8 de Janeiro de 2025",
    duration: "35 min",
    professor: "Prof Samuel Mendonça",
    image: "https://source.unsplash.com/featured/?hiit",
  },
];

export default function ModalitiesScreen() {
  return (
    <PageContainer as={View} style={styles.container}>
      {/* Card resumo */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Modalidades em Aberto</Text>
        <Text style={styles.summaryCount}>{modalities.length}</Text>
      </View>

      {/* Lista */}
      <FlatList
        data={modalities}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
            />
            <View style={styles.cardContent}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.date}>{item.date}</Text>
              <View style={styles.meta}>
                <Feather name="clock" size={12} color="#888" />
                <Text style={styles.metaText}>{item.duration}</Text>
                <Feather name="user" size={12} color="#888" />
                <Text style={styles.metaText}>{item.professor}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16, // px-4
    paddingTop: 24, // pt-6
    backgroundColor: "#f3f4f6", // bg-gray-100
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6b7280", // text-gray-500
  },
  summaryCount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#6b7280",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
    flexWrap: "wrap",
  },
  metaText: {
    fontSize: 12,
    color: "#6b7280",
    marginRight: 8,
  },
});
