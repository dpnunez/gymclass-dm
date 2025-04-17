import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { Image, View, ScrollView, StyleSheet } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { useTheme } from "@/context/ThemeContext";
import Icon from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import { useRouter } from "expo-router";
import { GestorClassProps, GestorPagProps } from "@/types/ManagerTypes";

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
  const nextClasses = classData
    .filter((item) => refDate < item.startingDate)
    .slice(0, 2);

  const [paymentData, setPaymentData] = useState(MOCK_DATA_PAG);
  const nextPags = [...paymentData]
    .sort((a, b) => a.vencimento.getTime() - b.vencimento.getTime())
    .slice(0, 2);

  const router = useRouter();

  return (
    <PageContainer as={ScrollView}>
      <View style={{ width: "95%", alignSelf: "center" }}>
        <InfoBox
          colorPrimary={theme.colors.primary}
          numberClasses={paymentData.length}
          numberMembers={classData.length} />
        <View style={{ marginTop: 40 }}>
          <View style={stylesItem.headerTitle}>
            <Text type="subtitle">Próximas Aulas</Text>
            <Pressable
              onPress={() => router.push("/(auth)/manager/classes")}
            >
              <Text lightColor={theme.colors.primary}>Ver Todas</Text>
            </Pressable>
          </View>
          <View style={stylesItem.container}>
            {nextClasses.map((item) => (
              <NextClassItem 
              key={item.id} id={item.id} name={item.name}
              prof={item.prof} startingDate={item.startingDate}
              minuteLength={item.minuteLength} vagas={item.vagas}
              inscritos={item.inscritos} />))}
          </View>
        </View>

        <View style={{ marginVertical: 40 }}>
          <View style={stylesItem.headerTitle}>
            <Text type="subtitle">Pagamentos Pendentes</Text>
            <Pressable
              onPress={() => router.push("/(auth)/manager/members")}
            >
              <Text lightColor={theme.colors.primary}>Ver Todos</Text>
            </Pressable>
          </View>
          <View style={stylesItem.container}>
            {nextPags.map((item) => (
              <PagamentosPendentes 
              key={item.id} id={item.id} name={item.name}
              vencimento={item.vencimento} />))}
          </View>
        </View>
      </View>
    </PageContainer>
  );
}

function NextClassItem({ id, name, prof, startingDate, minuteLength, vagas, inscritos }: GestorClassProps) {

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
    <View style={stylesItem.itemBox}>
      <Text type="subtitle">{name}</Text>
      <Text>{prof}</Text>
      <Text>
        {toTimeString(startingDate) +
          " - " +
          toTimeString(startingDate, minuteLength)}
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
        <Text>{inscritos} alunos</Text>
      </View>
    </View>

  );
}

function PagamentosPendentes({ id, name, vencimento }: GestorPagProps) {

  const daysBetween = (a: Date, b: Date) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((a.getTime() - b.getTime()) / msPerDay);
  };

  return (

    <View
      key={id}
      style={[stylesItem.itemBox, { flexDirection: "row", gap: 15 }]}
    >
      <Image
        style={stylesItem.imagePayment}
        source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
      />
      <View>
        <Text style={{ fontSize: 15 }} type="subtitle">
          {name}
        </Text>
        {refDate < vencimento ? (
          <Text
            style={{ fontSize: 13 }}
          >{`Vence em ${vencimento.toLocaleDateString("en-GB")}`}</Text>
        ) : (
          <Text
            lightColor="#EF4444"
            style={{ fontSize: 13 }}
          >{`Atrasado ${daysBetween(refDate, vencimento)} dias`}</Text>
        )}
      </View>
    </View>

  );
}

function InfoBox({ colorPrimary, numberClasses, numberMembers }:
  {
    colorPrimary: string, numberClasses: number,
    numberMembers: number 
  }) {
  return (
    <View style={stylesItem.infoContainer}>
      <View style={stylesItem.infoBox}>
        <View style={{ marginLeft: 20 }}>
          <Text>Aulas Hoje</Text>
          <Text type="subtitle">{numberClasses}</Text>
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
          <Text type="subtitle">{numberMembers}</Text>
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

const stylesItem = StyleSheet.create({
  infoContainer: {
    flexDirection: "row",
    gap: 10,
    alignSelf: "center",
    marginTop: 20,
  },
  infoBox: {
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: 8,
    paddingVertical: 14,
    width: "50%",
    flexDirection: "row",
    position: "relative",
    justifyContent: "space-between",
  },
  boxIcon: {
    marginRight: 15,
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
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    marginTop: 24,
    gap: 20,
  }
});
