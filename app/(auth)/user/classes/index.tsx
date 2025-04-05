import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { Image, StyleSheet, View } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { FlatList, Pressable } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

const MOCK_DATA: ClassItemProps[] = [
  {
    id: "1",
    name: "Matemática",
    date: "10 de Outubro de 2025",
    duration: "2 horas",
    status: "upcoming",
  },
  {
    id: "2",
    name: "Física",
    date: "15 de Outubro de 2025",
    duration: "1 hora",
    status: "canceled",
  },
  {
    id: "3",
    name: "Química",
    date: "20 de Outubro de 2025",
    duration: "3 horas",
    status: "completed",
  },
  {
    id: "4",
    name: "Biologia",
    date: "25 de Outubro de 2025",
    duration: "2 horas",
    status: "missed",
  },
  {
    id: "5",
    name: "História",
    date: "30 de Outubro de 2025",
    duration: "1 hora",
    status: "upcoming",
  },
  {
    id: "6",
    name: "Geografia",
    date: "5 de Novembro de 2025",
    duration: "2 horas",
    status: "canceled",
  },
  {
    id: "7",
    name: "Educação Física",
    date: "10 de Novembro de 2025",
    duration: "1 hora",
    status: "completed",
  },
  {
    id: "8",
    name: "Artes",
    date: "15 de Novembro de 2025",
    duration: "3 horas",
    status: "missed",
  },
];

type ClassStatus = "upcoming" | "canceled" | "completed" | "missed";

export default function ClassesPage() {
  return (
    <PageContainer as={View}>
      <FlatList
        data={MOCK_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ClassItem
            id={item.id}
            name={item.name}
            date={item.date}
            duration={item.duration}
            status={item.status}
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
  date: string;
  duration: string;
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

  return (
    <Pressable
      style={stylesItem.container}
      onPress={() => router.push(`/(auth)/user/classes/${id}`)}
    >
      <Image
        style={stylesItem.image}
        source={{
          uri: "https://reactnative.dev/img/tiny_logo.png",
        }}
      />
      <View style={{ gap: 10, padding: 10 }}>
        <Text type="subtitle">{name}</Text>
        <Text>{date}</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={stylesItem.detailSection}>
            <Icon name="punch-clock" size={20} />
            <Text>{duration}</Text>
          </View>
          <View style={stylesItem.detailSection}>
            <Icon name={iconNames[status]} size={20} color={colors[status]} />
            <Text lightColor={colors[status]}>{statusLabel[status]}</Text>
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
