import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { Image, View, ScrollView, StyleSheet } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { useTheme } from "@/context/ThemeContext";
import Icon from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import { useRouter } from "expo-router";

const MOCK_DATA_CLASS: GestorClassProps[] = [
  {
    id: "1",
    name: "Atletismo",
    prof: "Marcos Dias",
    startingDate: new Date(2025, 3, 16, 11, 0),
    minuteLength: 60,
    vagas: 20,
    inscritos: 18,
  },
  {
    id: "2",
    name: "Yoga Iniciante",
    prof: "Maria Silva",
    startingDate: new Date(2025, 3, 17, 9, 0),
    minuteLength: 60,
    vagas: 18,
    inscritos: 6,
  },
  {
    id: "3",
    name: "Musculação",
    prof: "João Santos",
    startingDate: new Date(2025, 3, 17, 11, 30),
    minuteLength: 60,
    vagas: 10,
    inscritos: 4,
  },
];
const MOCK_DATA_PAG: GestorPagProps[] = [
  {
    id: "1",
    name: "Ana Oliveira",
    vencimento: new Date(2025, 3, 20),
  },
  {
    id: "2",
    name: "Carlos Lima",
    vencimento: new Date(2025, 3, 14),
  },
  {
    id: "3",
    name: "Marcelo Torres",
    vencimento: new Date(2025, 4, 14),
  },
  {
    id: "4",
    name: "Tiago Dias",
    vencimento: new Date(2025, 4, 10),
  },
  {
    id: "5",
    name: "João Costa",
    vencimento: new Date(2025, 4, 10),
  },
  {
    id: "6",
    name: "Tadeu Abreu",
    vencimento: new Date(2025, 4, 10),
  },
];
const refDate = new Date(2025, 3, 17, 8, 15);

export default function ManagerHome() {
  const { theme } = useTheme();

  const [classData, setClassData] = useState(MOCK_DATA_CLASS);
  const [paymentData, setPaymentData] = useState(MOCK_DATA_PAG);

  const router = useRouter();

  return (
    <PageContainer as={ScrollView}>
      <View style={{ width: "95%", alignSelf: "center" }}>
        <InfoBox
          colorPrimary={theme.colors.primary}
          classData={classData}
          paymentData={paymentData} />
        <View style={{ marginTop: 40 }}>
          <View style={{ position: "relative" }}>
            <Text type="subtitle">Próximas Aulas</Text>
            <Pressable
              style={{ position: "absolute", right: 0, top: 2 }}
              onPress={() => router.push("/(auth)/manager/classes")}
            >
              <Text lightColor={theme.colors.primary}>Ver Todas</Text>
            </Pressable>
          </View>
          <ProximasAulas classData={classData} />
        </View>

        <View style={{ marginVertical: 40 }}>
          <View style={{ position: "relative" }}>
            <Text type="subtitle">Pagamentos Pendentes</Text>
            <Pressable
              style={{ position: "absolute", right: 0, top: 2 }}
              onPress={() => router.push("/(auth)/manager/members")}
            >
              <Text lightColor={theme.colors.primary}>Ver Todos</Text>
            </Pressable>
          </View>
          <PagamentosPendentes paymentData={paymentData} />
        </View>
      </View>
    </PageContainer>
  );
}

function ProximasAulas({ classData }: { classData: GestorClassProps[] }) {
  const nextClasses = classData
    .filter((item) => refDate < item.startingDate)
    .slice(0, 2);

  const toTimeString = (date: Date, extraMin: number = 0) => {
    const temp = new Date(date);
    if (extraMin > 0) temp.setMinutes(temp.getMinutes() + extraMin);
    return temp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <View style={{ marginTop: 24, gap: 20 }}>
      {nextClasses.map((item) => (
        <View key={item.id} style={stylesItem.itemBox}>
          <Text type="subtitle">{item.name}</Text>
          <Text>{item.prof}</Text>
          <Text>
            {toTimeString(item.startingDate) +
              " - " +
              toTimeString(item.startingDate, item.minuteLength)}
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Image
                style={stylesItem.imageClass}
                source={{
                  uri: "https://reactnative.dev/img/tiny_logo.png",
                }}
              />
              <Image
                style={stylesItem.imageClass}
                source={{
                  uri: "https://reactnative.dev/img/tiny_logo.png",
                }}
              />
            </View>
            <Text>{item.inscritos} alunos</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function PagamentosPendentes({
  paymentData,
}: {
  paymentData: GestorPagProps[];
}) {
  const nextPags = [...paymentData]
    .sort((a, b) => a.vencimento.getTime() - b.vencimento.getTime())
    .slice(0, 2);

  const daysBetween = (a: Date, b: Date) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((a.getTime() - b.getTime()) / msPerDay);
  };

  return (
    <View style={{ marginTop: 24, gap: 20 }}>
      {nextPags.map((item) => (
        <View
          key={item.id}
          style={[stylesItem.itemBox, { flexDirection: "row", gap: 15 }]}
        >
          <Image
            style={stylesItem.imagePayment}
            source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
          />
          <View>
            <Text style={{ fontSize: 15 }} type="subtitle">
              {item.name}
            </Text>
            {refDate < item.vencimento ? (
              <Text
                style={{ fontSize: 13 }}
              >{`Vence em ${item.vencimento.toLocaleDateString("en-GB")}`}</Text>
            ) : (
              <Text
                lightColor="#EF4444"
                style={{ fontSize: 13 }}
              >{`Atrasado ${daysBetween(refDate, item.vencimento)} dias`}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

function InfoBox({ colorPrimary, classData, paymentData }:
  {
    colorPrimary: string, classData: GestorClassProps[],
    paymentData: GestorPagProps[]
  }) {
  return (
    <View style={stylesItem.infoContainer}>
      <View style={stylesItem.infoBox}>
        <View style={{ marginLeft: 20 }}>
          <Text>Aulas Hoje</Text>
          <Text type="subtitle">{classData.length}</Text>
        </View>
        <Icon
          name="calendar"
          size={20}
          color={colorPrimary}
          style={stylesItem.boxIcon}
        />
      </View>
      <View style={stylesItem.infoBox}>
        <View style={{ marginLeft: 20 }}>
          <Text>Alunos Ativos</Text>
          <Text type="subtitle">{paymentData.length}</Text>
        </View>
        <Icon
          name="team"
          size={20}
          color={colorPrimary}
          style={stylesItem.boxIcon}
        />
      </View>
    </View>
  );
}

interface GestorClassProps {
  id: string;
  name: string;
  prof: string;
  startingDate: Date;
  minuteLength: number;
  vagas: number;
  inscritos: number;
}

interface GestorPagProps {
  id: string;
  name: string;
  vencimento: Date;
}

const stylesItem = StyleSheet.create({
  infoContainer: {
    flexDirection: "row",
    gap: 10,
    alignSelf: "center",
    marginTop: 20,
  },
  infoBox: {
    borderColor: "#727272",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 8,
    paddingVertical: 14,
    width: "50%",
    flexDirection: "row",
    position: "relative",
  },
  boxIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  imageClass: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 7,
  },
  imagePayment: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  itemBox: {
    borderColor: "#727272",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
