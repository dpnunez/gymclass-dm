import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ThemedButton";
import { Text } from "@/components/ThemedText";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import Icon from "@expo/vector-icons/AntDesign";

const MOCK_DATA = {
  class: {
    id: "123456",
    description: "Aula de Matemática para iniciantes",
    name: "Matemática",
    teacher: "João Silva",
    date: "2023-10-01",
    time: "10:00",
    location: "Sala 101",
  },
};

export default function ClassConfirmSubscribe() {
  const { classId } = useGlobalSearchParams();
  const router = useRouter();

  const handleNavigateToClassSubscription = () => {
    router.replace("/(auth)/user/classes");
  };

  return (
    <PageContainer contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{MOCK_DATA.class.name}</Text>
        <Text>{MOCK_DATA.class.description}</Text>
        <View style={styles.itemWithIcon}>
          <Icon name="user" size={20} color="#000" />
          <Text>{MOCK_DATA.class.teacher}</Text>
        </View>
        <View style={styles.itemWithIcon}>
          <Icon name="calendar" size={20} color="#000" />
          <Text>{MOCK_DATA.class.date}</Text>
        </View>
        <View style={styles.itemWithIcon}>
          <Icon name="clockcircleo" size={20} color="#000" />
          <Text>{MOCK_DATA.class.time}</Text>
        </View>
        <View style={styles.itemWithIcon}>
          <Icon name="enviromento" size={20} color="#000" />
          <Text>{MOCK_DATA.class.location}</Text>
        </View>
      </View>
      <View style={{ marginBottom: 20, gap: 10 }}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Você deseja se inscrever nesta aula?
        </Text>
        <Button size="large" onPress={handleNavigateToClassSubscription}>
          Confirmar Inscrição
        </Button>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  card: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#F9FAFB",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  itemWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
