import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Image, Pressable, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firebaseDb } from "@/firebase.config";

export default function TeacherProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [teacher, setTeacher] = useState({
    id: "",
    name: "",
    email: "",
    avatar: "",
    modality: "",
    status: "",
  });

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!id || typeof id !== "string") {
        Alert.alert("Erro", "ID inválido.");
        return;
      }

      try {
        const ref = doc(firebaseDb, "userRole", id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) {
          Alert.alert("Erro", "Professor não encontrado.");
          return;
        }

        const data = snapshot.data();

        setTeacher({
          id: snapshot.id,
          name: data.displayName || "Sem nome",
          email: data.mail || "-",
          avatar: data.profilePicture || "https://via.placeholder.com/96",
          modality: data.modality || "Não definida",
          status: data.status || "Indefinido",
        });
      } catch (err: any) {
        Alert.alert("Erro", err.message || "Erro ao buscar professor.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  if (loading) return <Text style={{ padding: 24 }}>Carregando...</Text>;

  return (
    <PageContainer as={View} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Perfil do Professor</Text>

        <Image source={{ uri: teacher.avatar }} style={styles.avatar} />

        <Text type="subtitle" style={styles.name}>
          {teacher.name}
        </Text>
        <Text style={styles.email}>{teacher.email}</Text>
        <Text style={styles.id}>ID: {teacher.id}</Text>

        <View style={styles.detailBox}>
          <Text style={styles.label}>Modalidade</Text>
          <Text style={styles.value}>{teacher.modality}</Text>

          <Text style={[styles.label, { marginTop: 12 }]}>Status</Text>
          <Text style={styles.value}>{teacher.status}</Text>
        </View>

        {/* Botões opcionais futuramente */}
        {/* <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Editar Modalidade</Text>
        </Pressable> */}
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: "#f3f4f6",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 8,
  },
  name: {
    textAlign: "center",
  },
  email: {
    fontSize: 14,
    color: "#3b82f6",
  },
  id: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 16,
  },
  detailBox: {
    width: "100%",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#2563eb",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "center",
  },
});