import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import Icon from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";

const teachers = [
  {
    id: "#124653",
    name: "Joana Silva",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    modality: "Yoga",
  },
  {
    id: "#136523",
    name: "Carol Sanches",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    modality: "Crossfit",
  },
  {
    id: "#124654",
    name: "Francisco Eduardo",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    modality: "Meditação",
  },
  {
    id: "#124660",
    name: "Eduardo Bolsonaro",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    modality: "HIIT",
  },
  {
    id: "#124668",
    name: "Marina Silva",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    modality: "Body Pump",
  },
  {
    id: "#124713",
    name: "Julia Freitas",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    modality: "Spinning",
  },
];

export default function TeachersScreen() {
  const router = useRouter();

  return (
    <PageContainer as={View} style={styles.container}>
      {/* Header */}
      <View style={styles.headerCard}>
        <Text style={styles.headerLabel}>Total de Professores</Text>
        <Text style={styles.headerCount}>{teachers.length}</Text>
      </View>

      {/* Filtro */}
      <View style={styles.filterRow}>
        <Text style={styles.title}>Professores</Text>
        <View style={styles.filterIcons}>
          <Icon name="filter" size={20} color="#444" />
          <Icon name="search" size={20} color="#444" />
        </View>
      </View>

      {/* Lista */}
      <FlatList
        data={teachers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 50 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push(
                `/(auth)/manager/members/teachers/profile`
              )
            }
            style={styles.card}
          >
            <View style={styles.cardLeft}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.id}>{`ID: ${item.id}`}</Text>
              </View>
            </View>

            <View>
              <Text style={styles.modalityLabel}>Modalidade</Text>
              <Text style={styles.modality}>{item.modality}</Text>
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
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: "#f3f4f6",
  },
  headerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  headerLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  headerCount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  filterIcons: {
    flexDirection: "row",
    gap: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  name: {
    fontWeight: "600",
  },
  id: {
    fontSize: 12,
    color: "#6b7280",
  },
  modalityLabel: {
    fontSize: 12,
    textAlign: "right",
    color: "#9ca3af",
  },
  modality: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "600",
    textAlign: "right",
  },
});

