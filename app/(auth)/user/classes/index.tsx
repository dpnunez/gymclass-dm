import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { FlatList, Pressable } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { useUser } from "@/context/AuthContext";
import { useClasses } from "@/context/ClassContext";

type ClassStatus = "upcoming" | "canceled" | "completed" | "missed";

export default function ClassesPage() {
  const { user } = useUser();
  const {
    loading,
    isUserEnrolled,
    classes
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


  return (
    <PageContainer as={View}>
      <FlatList
        data={classes.filter(({ id }) => isUserEnrolled(id))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ClassItem
            id={item.id}
            name={item.name}
            date={item.startingDate}
            duration={item.minuteLength}
            status={item.status as ClassStatus}
          />
        )}
        contentContainerStyle={{ gap: 32 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ width: "100%" }}
        horizontal={false}
      />
    </PageContainer>
  );
}

interface ClassItemProps {
  id: string;
  name: string;
  date: Date;
  duration: number;
  status: ClassStatus;
}

function ClassItem({ name, date, duration, status, id }: ClassItemProps) {
  const router = useRouter();
  const colors = {
    upcoming: "#4CAF50",
    canceled: "#F44336",
    completed: "#2196F3",
    missed: "#FF9800",
  };

  const iconNames = {
    upcoming: "check-circle",
    canceled: "cancel",
    completed: "check-circle",
    missed: "cancel",
  } as const;

  const statusLabel = {
    upcoming: "Próxima",
    canceled: "Cancelada",
    completed: "Concluída",
    missed: "Perdida",
  } as const;

  const getStatusData = (status: string) => {
    switch (status) {
      case "upcoming":
        return "upcoming" as ClassStatus;
      case "canceled":
        return "canceled" as ClassStatus;
      case "completed":
        return "completed" as ClassStatus;
      case "missed":
        return "missed" as ClassStatus;
      default:
        return "upcoming" as ClassStatus;
    }
  }

  const statusFinal = getStatusData(status);
  return (
    <Pressable
      style={stylesItem.container}
      onPress={() => router.push(`/(auth)/user/classes/${id}`)}
    >
      <View style={{ gap: 10, padding: 10 }}>
        <Text type="subtitle">{name}</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Text>{date.toLocaleDateString("en-GB")}</Text>
          <View style={stylesItem.detailSection}>
            <Icon name="punch-clock" size={20} />
            <Text>{duration + " min"}</Text>
          </View>
          <View style={stylesItem.detailSection}>
            <Icon name={iconNames[statusFinal]} size={20} color={colors[statusFinal]} />
            <Text lightColor={colors[statusFinal]}>{statusLabel[statusFinal]}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const stylesItem = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  detailSection: {
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});
