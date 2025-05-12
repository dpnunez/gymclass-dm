import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { useLocalSearchParams } from "expo-router";
import { Image, View, StyleSheet, Alert, Pressable } from "react-native";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { firebaseDb } from "@/firebase.config";

interface ClassItem {
  name: string;
  date: string;
  shift: string;
  status?: string;
}

export default function TeacherProfileScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  const [teacher, setTeacher] = useState({
    id: "",
    name: "",
    email: "",
    avatar: "",
  });

  const [classes, setClasses] = useState<ClassItem[]>([]);

  useEffect(() => {
    const fetchTeacherAndClasses = async () => {
      if (!id || typeof id !== "string") {
        Alert.alert("Erro", "ID do professor inválido.");
        return;
      }

      try {
        const userRef = doc(firebaseDb, "userRole", id);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          Alert.alert("Erro", "Professor não encontrado.");
          return;
        }

        const userData = userSnap.data();

        setTeacher({
          id: userSnap.id,
          name: userData.displayName || "Sem nome",
          email: userData.mail || "Sem email",
          avatar: userData.profilePicture || "https://via.placeholder.com/96",
        });

        const classesRef = collection(firebaseDb, "classes");
        const q = query(classesRef, where("teacherId", "==", id));
        const snapshot = await getDocs(q);

        const fetchedClasses = snapshot.docs.map((doc) => ({
          name: doc.data().name,
          date: doc.data().date,
          shift: doc.data().shift,
          status: doc.data().status || "ativa",
        }));

        setClasses(fetchedClasses);
      } catch (err: any) {
        Alert.alert("Erro", err.message || "Erro ao buscar dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherAndClasses();
  }, [id]);

  if (loading) return <Text style={{ padding: 24 }}>Carregando...</Text>;

  return (
    <PageContainer as={View} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Perfil</Text>

        <Image source={{ uri: teacher.avatar }} style={styles.avatar} />

        <Text type="subtitle" style={styles.name}>{teacher.name}</Text>
        <Text style={styles.email}>{teacher.email}</Text>
        <Text style={styles.id}>{`ID: ${teacher.id}`}</Text>

        <View style={styles.classList}>
          {classes.length > 0 ? (
            classes
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((item) => (
                <View key={item.name + item.date} style={styles.classItem}>
                  <View>
                    <Text style={styles.className}>{item.name}</Text>
                    <Text style={styles.classDate}>{item.date}</Text>
                    {item.status && (
                      <Text
                        style={[
                          styles.classStatus,
                          {
                            color:
                              item.status === "finalizada"
                                ? "#10b981"
                                : item.status === "cancelada"
                                ? "#ef4444"
                                : "#6b7280",
                          },
                        ]}
                      >
                        Status: {item.status}
                      </Text>
                    )}
                  </View>
                  <View style={styles.shiftBadge}>
                    <Text style={styles.shiftText}>{item.shift}</Text>
                  </View>
                </View>
              ))
          ) : (
            <Text style={{ fontSize: 14, color: "#6b7280", textAlign: "center", marginTop: 16 }}>
              Nenhuma aula atribuída a este professor.
            </Text>
          )}
        </View>

        {/* Botão para adicionar aulas */}
        <Pressable
          style={styles.button}
          onPress={async () => {
            if (!id || typeof id !== "string") return;

            try {
              const newClass = {
                name: "Nova Aula",
                date: new Date().toLocaleDateString("pt-PT"),
                shift: "Turno A",
                status: "ativa",
                teacherId: id,
              };

              await addDoc(collection(firebaseDb, "classes"), newClass);
              setClasses((prev) => [...prev, newClass]);
              Alert.alert("Aula adicionada com sucesso!");
            } catch (err: any) {
              Alert.alert("Erro", err.message || "Erro ao adicionar aula.");
            }
          }}
        >
          <Text style={styles.buttonText}>Adicionar Aula</Text>
        </Pressable>

        {/* Botão para editar aulas */}
        <Pressable
          style={[styles.button, { backgroundColor: "#10b981" }]}
          onPress={async () => {
            if (!id || typeof id !== "string") return;

            const q = query(collection(firebaseDb, "classes"), where("teacherId", "==", id));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
              Alert.alert("Este professor ainda não possui aulas.");
              return;
            }

            const aulaDocs = snapshot.docs;

            const nomes = aulaDocs.map((doc, i) => `${i + 1}. ${doc.data().name}`).join("\n");

            Alert.prompt(
              "Editar Aula",
              `Digite o número da aula para editar status:\n\n${nomes}`,
              async (input) => {
                const index = Number(input) - 1;
                if (isNaN(index) || index < 0 || index >= aulaDocs.length) {
                  Alert.alert("Índice inválido.");
                  return;
                }

                const aulaDoc = aulaDocs[index];
                const aulaId = aulaDoc.id;
                const aulaData = aulaDoc.data();

                Alert.alert(
                  "Novo status",
                  `Escolha o novo status para "${aulaData.name}"`,
                  [
                    {
                      text: "Finalizar",
                      onPress: async () => {
                        await updateDoc(doc(firebaseDb, "classes", aulaId), { status: "finalizada" });
                        setClasses((prev) =>
                          prev.map((a) =>
                            a.name === aulaData.name ? { ...a, status: "finalizada" } : a
                          )
                        );
                      },
                    },
                    {
                      text: "Cancelar",
                      onPress: async () => {
                        await updateDoc(doc(firebaseDb, "classes", aulaId), { status: "cancelada" });
                        setClasses((prev) =>
                          prev.map((a) =>
                            a.name === aulaData.name ? { ...a, status: "cancelada" } : a
                          )
                        );
                      },
                    },
                    { text: "Fechar", style: "cancel" },
                  ]
                );
              }
            );
          }}
        >
          <Text style={styles.buttonText}>Editar Aulas</Text>
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
    shadowOpacity: 0.08,
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
    color: "#6b7280",
  },
  id: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 16,
  },
  classList: {
    width: "100%",
    marginTop: 8,
    gap: 16,
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
    color: "#6b7280",
  },
  classStatus: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  shiftBadge: {
    backgroundColor: "#d1fae5",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 9999,
  },
  shiftText: {
    color: "#059669",
    fontWeight: "600",
    fontSize: 12,
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