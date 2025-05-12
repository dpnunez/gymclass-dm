import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Image, Pressable, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firebaseDb } from "@/firebase.config";

export default function AthleteProfileScreen() {
  const { id } = useLocalSearchParams(); // alunoId
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [student, setStudent] = useState({
    name: "",
    email: "",
    avatar: "",
    plan: "",
    price: "",
    status: "",
    nextPayment: "",
    id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id || typeof id !== "string") {
        Alert.alert("Erro", "ID do aluno inválido.");
        return;
      }

      try {
        const ref = doc(firebaseDb, "userRole", id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) {
          Alert.alert("Erro", "Aluno não encontrado.");
          return;
        }

        const data = snapshot.data();

        setStudent({
          name: data.displayName || "Sem nome",
          email: data.mail || "-",
          avatar: data.profilePicture || "https://via.placeholder.com/96",
          plan: data.planName || "Plano não definido",
          price: data.price || "€--",
          status: data.status || "Indefinido",
          nextPayment: data.nextPayment || "Sem data",
          id: snapshot.id,
        });

      } catch (err: any) {
        Alert.alert("Erro ao buscar aluno", err.message || "Erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Text style={{ padding: 24 }}>Carregando...</Text>;

  return (
    <PageContainer as={View} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Perfil do Aluno</Text>

        <Image
          source={{ uri: student.avatar }}
          style={styles.avatar}
        />

        <Text type="subtitle" style={styles.name}>
          {student.name}
        </Text>
        <Text style={styles.email}>{student.email}</Text>
        <Text style={styles.id}>{`ID: ${student.id}`}</Text>

        <View style={styles.planBox}>
          <View style={styles.planHeader}>
            <Text style={styles.planTitle}>{student.plan}</Text>
            <View style={styles.priceTag}>
              <Text style={styles.price}>{student.price}</Text>
            </View>
          </View>
          <Text style={styles.status}>{student.status}</Text>
          <Text style={styles.paymentInfo}>
            Próximo pagamento: {student.nextPayment}
          </Text>
        </View>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Registar Pagamento</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/(auth)/manager/members/students/plano",
              params: { id: student.id },
            })
          }
        >
          <Text style={styles.buttonText}>Modificar Subscrição</Text>
        </Pressable>
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
  planBox: {
    width: "100%",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planTitle: {
    fontWeight: "600",
  },
  priceTag: {
    backgroundColor: "#d1fae5",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 9999,
  },
  price: {
    color: "#059669",
    fontWeight: "600",
    fontSize: 12,
  },
  status: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 4,
  },
  paymentInfo: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#2563eb",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "center",
  },
});