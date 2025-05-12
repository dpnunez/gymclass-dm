import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { firebaseDb } from "@/firebase.config";
import { useEffect, useState } from "react";

interface Modality {
  name: string;
  date: string;
  duration: string;
  professor: string;
  image: string;
}

export default function ModalitiesScreen() {
  const [modalities, setModalities] = useState<Modality[]>([]);

  useEffect(() => {
    const fetchModalities = async () => {
      // ======= BUSCA DOS DADOS REAIS DO FIRESTORE =======
      const snapshot = await getDocs(collection(firebaseDb, "classes"));

      const result = snapshot.docs.map(doc => {
        const data = doc.data();

        return {
          name: data.name || "Sem nome",
          date: data.date || "Sem data",
          duration: data.duration || "Indefinido",
          professor: data.teacherName || "Desconhecido",

          // ======= IMAGEM COM FALLBACK =======
          image: data.imageUrl || `https://source.unsplash.com/featured/?${data.name || "fitness"}`,
        };
      });

      setModalities(result);
    };

    fetchModalities();
  }, []);

  return (
    <PageContainer as={View} style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Modalidades em Aberto</Text>
        <Text style={styles.summaryCount}>{modalities.length}</Text>
      </View>

      <FlatList
        data={modalities}
        keyExtractor={(item) => item.name + item.date}
        contentContainerStyle={{ paddingBottom: 40 }}

        // ======= RENDERIZAÇÃO DE CADA MODALIDADE =======
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
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
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: "#f3f4f6",
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
    color: "#6b7280",
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
    marginRight: 8,
  },
});