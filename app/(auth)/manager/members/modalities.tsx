import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

export default function TeacherProfileScreen() {
  const { id } = useLocalSearchParams();

  const teacher = {
    id: id || "#12455",
    name: "Joana Silva",
    email: "joao@gmail.com",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    classes: [
      { name: "Yoga Flow", date: "12/12/2025", shift: "Turno B" },
      { name: "Functional", date: "10/12/2025", shift: "Turno A" },
    ],
  };

  return (
    <PageContainer as={View} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.profileTitle}>Perfil</Text>

        <Image
          source={{ uri: teacher.avatar }}
          style={styles.avatar}
        />

        <Text type="subtitle" style={styles.nameText}>
          {teacher.name}
        </Text>
        <Text style={styles.emailText}>{teacher.email}</Text>
        <Text style={styles.idText}>{`ID: ${teacher.id}`}</Text>

        <View style={styles.classList}>
          {teacher.classes.map((item) => (
            <View key={item.name} style={styles.classItem}>
              <View>
                <Text style={styles.className}>{item.name}</Text>
                <Text style={styles.classDate}>{item.date}</Text>
              </View>
              <View style={styles.shiftBadge}>
                <Text style={styles.shiftText}>{item.shift}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24, // px-6
    paddingTop: 24,         // pt-6
    backgroundColor: "#f3f4f6", // bg-gray-100
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    padding: 24,
    alignItems: "center",
    elevation: 4, // Android shadow
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  avatar: {
    width: 96,  // w-24
    height: 96, // h-24
    borderRadius: 48, // rounded-full
    marginBottom: 8,
  },
  nameText: {
    textAlign: "center",
  },
  emailText: {
    fontSize: 14,
    color: "#6b7280", // text-gray-500
  },
  idText: {
    fontSize: 12,
    color: "#9ca3af", // text-gray-400
    marginBottom: 16,
  },
  classList: {
    width: "100%",
    marginTop: 8,
    gap: 16, // space-y-4 equivalente
  },
  classItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  className: {
    fontWeight: "600",
  },
  classDate: {
    fontSize: 12,
    color: "#6b7280", // text-gray-500
  },
  shiftBadge: {
    backgroundColor: "#d1fae5", // bg-green-100
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 9999, // rounded-full
  },
  shiftText: {
    color: "#059669", // text-green-600
    fontWeight: "600",
    fontSize: 12,
  },
});
