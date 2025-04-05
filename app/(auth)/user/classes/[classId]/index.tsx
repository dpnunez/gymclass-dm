import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ThemedButton";
import { Text } from "@/components/ThemedText";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
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

export default function ClassSubscribedDetails() {
  const { classId } = useGlobalSearchParams();
  const router = useRouter();

  const handleCancelate = () => {
    router.back();
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

      <View style={{ gap: 10 }}>
        <View style={[styles.itemWithIcon, { justifyContent: "center" }]}>
          <Icon name="checkcircle" size={24} color="#4CAF50" />
          <Text style={{ color: "#4CAF50" }}>Inscrito com sucesso!</Text>
        </View>
        <Image
          source={{
            uri: "https://www.shutterstock.com/shutterstock/photos/2429446241/display_1500/stock-vector-qr-code-isolated-on-white-background-2429446241.jpg",
          }}
          style={{ width: 200, height: 200, alignSelf: "center" }}
        />
        <Text style={{ textAlign: "center" }}>
          Apresente este QR Code na entrada da sala para confirmar sua presença.
        </Text>
      </View>
      <View style={{ marginBottom: 20, gap: 10 }}>
        <Button size="large" onPress={handleCancelate} lightColor="#EF4444">
          Cancelar Inscrição
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
