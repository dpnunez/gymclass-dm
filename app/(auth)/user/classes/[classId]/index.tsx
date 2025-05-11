import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ThemedButton";
import { Text } from "@/components/ThemedText";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View, ActivityIndicator, Image } from "react-native";
import Icon from "@expo/vector-icons/AntDesign";
import { useUser } from "@/context/AuthContext";
import { useClasses } from "@/context/ClassContext";

export default function ClassConfirmSubscribe() {
  const { user } = useUser();
  const {
    loading,
    isUserEnrolled,
    enrollInClass,
    cancelEnrollment,
    getClassById
  } = useClasses();

  if (loading) {
    return (
      <PageContainer contentContainerStyle={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Carregando aulas...</Text>
        </View>
      </PageContainer>
    );
  }

  const { classId } = useGlobalSearchParams();
  const selectedClass = getClassById(classId as string);

  const availableSpots = selectedClass?.vagas! - selectedClass?.inscritos!;
  const isFull = availableSpots === 0;
  const isEnrolled = isUserEnrolled(classId as string);
  return (
    <PageContainer contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{selectedClass?.name}</Text>
        <Text>{selectedClass?.description}</Text>
        <View style={styles.itemWithIcon}>
          <Icon name="user" size={20} color="#000" />
          <Text>{selectedClass?.prof}</Text>
        </View>
        <View style={styles.itemWithIcon}>
          <Icon name="calendar" size={20} color="#000" />
          <Text>{selectedClass?.startingDate.toLocaleDateString("en-GB")}</Text>
        </View>
        <View style={styles.itemWithIcon}>
          <Icon name="clockcircleo" size={20} color="#000" />
          <Text>{`${selectedClass?.startingDate.getHours()}:${selectedClass?.startingDate.getMinutes()} - ${selectedClass?.minuteLength} min`}</Text>
        </View>
        <View style={styles.itemWithIcon}>
          <Icon name="enviromento" size={20} color="#000" />
          <Text>{"Sala " + selectedClass?.sala}</Text>
        </View>
      </View>

      {isEnrolled ? (<View style={{ gap: 10 }}>
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
      ) : (<></>)}

      <View style={{ marginBottom: 20, gap: 10 }}>
        {!isEnrolled ? (
          <Button size="large" onPress={() => enrollInClass(classId as string)}
            disabled={isFull}
          >
            {isFull ? "Lotada" : "Inscrever-se"}
          </Button>) :
          (<Button size="large" onPress={() => cancelEnrollment(classId as string)}
            lightColor="#f40000"
          >
            {"Desinscrever-se"}
          </Button>)
        }
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});
