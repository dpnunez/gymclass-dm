import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { Image, View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { useTheme } from "@/context/ThemeContext";
import Icon from "@expo/vector-icons/AntDesign";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { GestorClassProps, GestorPagProps } from "@/types/ManagerTypes";
import { useUser } from "@/context/AuthContext";
import { useClasses } from "@/context/ClassContext";
import { Snackbar } from "react-native-paper";
import { collection, getDocs, updateDoc, doc, Timestamp } from "firebase/firestore";
import { firebaseDb } from "@/firebase.config";

const refDate = new Date(2025, 3, 17, 8, 15);

// Função utilitária para garantir que o avatar seja válido
function getAvatarSource(avatar?: string) {
  return { uri: avatar || "https://reactnative.dev/img/tiny_logo.png" };
}

export default function ManagerHome() {
  const { user } = useUser();
  const { loading, classes } = useClasses();
  const { theme } = useTheme();
  const router = useRouter();

  const [paymentData, setPaymentData] = useState<GestorPagProps[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // ======= BUSCA DOS PAGAMENTOS REAIS DO FIRESTORE =======
  useEffect(() => {
    const fetchPayments = async () => {
      const snapshot = await getDocs(collection(firebaseDb, "userRole"));
      const payments: GestorPagProps[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.nextPayment) {
          payments.push({
            id: docSnap.id,
            name: data.displayName || "Sem nome",
            vencimento: data.nextPayment.toDate(),
            avatar: data.profilePicture || "https://reactnative.dev/img/tiny_logo.png",
          });
        }
      });

      setPaymentData(payments);
    };

    fetchPayments();
  }, []);

  const handleMarkAsPaid = async (userId: string) => {
    const userDoc = doc(firebaseDb, "userRole", userId);
    const newPaymentDate = new Date();
    newPaymentDate.setMonth(newPaymentDate.getMonth() + 1);

    await updateDoc(userDoc, {
      nextPayment: Timestamp.fromDate(newPaymentDate),
    });

    setPaymentData((prevData) =>
      prevData.map((item) =>
        item.id === userId ? { ...item, vencimento: newPaymentDate } : item
      )
    );

    // ======= MENSAGEM DE CONFIRMAÇÃO (SNACKBAR) =======
    setSnackbarMessage("Pagamento marcado como realizado.");
    setSnackbarVisible(true);
  };

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

  const nextClasses = classes
    .filter((item) => refDate < item.startingDate)
    .slice(0, 2);

  const nextPags = [...paymentData]
    .sort((a, b) => a.vencimento.getTime() - b.vencimento.getTime())
    .slice(0, 2);

  return (
    <PageContainer as={ScrollView}>
      <View style={{ width: "95%", alignSelf: "center" }}>
        <InfoBox
          colorPrimary={theme.colors.primary}
          numberClasses={classes.length}
          numberMembers={paymentData.length}
        />

        <View style={{ marginTop: 40 }}>
          <View style={stylesItem.headerTitle}>
            <Text type="subtitle">Próximas Aulas</Text>
            <Pressable onPress={() => router.push("/(auth)/manager/classes")}>
              <Text lightColor={theme.colors.primary}>Ver Todas</Text>
            </Pressable>
          </View>
          <View style={stylesItem.container}>
            {nextClasses.map((item) => (
              <NextClassItem key={item.id} {...item} />
            ))}
          </View>
        </View>

        <View style={{ marginVertical: 40 }}>
          <View style={stylesItem.headerTitle}>
            <Text type="subtitle">Pagamentos Pendentes</Text>
            <Pressable onPress={() => router.push("/(auth)/manager/members")}>
              <Text lightColor={theme.colors.primary}>Ver Todos</Text>
            </Pressable>
          </View>
          <View style={stylesItem.container}>
            {nextPags.map((item) => (
              <PagamentosPendentes
                key={item.id}
                {...item}
                onMarkAsPaid={handleMarkAsPaid}
              />
            ))}
          </View>
        </View>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ alignSelf: "center", marginBottom: 20 }}
      >
        {snackbarMessage}
      </Snackbar>
    </PageContainer>
  );
}

function NextClassItem({ name, prof, startingDate, minuteLength, inscritos }: GestorClassProps) {
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
        {toTimeString(startingDate)} - {toTimeString(startingDate, minuteLength)}
      </Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flexDirection: "row" }}>
          <Image style={stylesItem.imageClass} source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }} />
          <Image style={stylesItem.imageClass} source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }} />
        </View>
        <Text>{inscritos} alunos</Text>
      </View>
    </View>
  );
}

function PagamentosPendentes({ id, name, vencimento, avatar, onMarkAsPaid }: GestorPagProps & { onMarkAsPaid: (id: string) => void }) {
  const daysBetween = (a: Date, b: Date) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((a.getTime() - b.getTime()) / msPerDay);
  };

  const isOverdue = vencimento < new Date();
  const daysDiff = daysBetween(new Date(), vencimento);

  return (
    <View style={[stylesItem.itemBox, { flexDirection: "row", gap: 15 }]}>
      <Image
        style={stylesItem.imagePayment}
        source={{ uri: avatar || "https://reactnative.dev/img/tiny_logo.png" }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15 }} type="subtitle">{name}</Text>
        <Text style={{ fontSize: 13, color: isOverdue ? "#EF4444" : "#6b7280" }}>
          {isOverdue
            ? `Atrasado ${Math.abs(daysDiff)} dias`
            : `Vence em ${vencimento.toLocaleDateString("pt-PT")}`}
        </Text>
      </View>

      <Pressable onPress={() => onMarkAsPaid(id)}>
        <Text style={{ color: "#3b82f6", fontSize: 13 }}>Marcar como pago</Text>
      </Pressable>
    </View>
  );
}

function InfoBox({ colorPrimary, numberClasses, numberMembers }: { colorPrimary: string; numberClasses: number; numberMembers: number }) {
  return (
    <View style={stylesItem.infoContainer}>
      <View style={stylesItem.infoBox}>
        <View style={{ marginLeft: 20 }}>
          <Text>Aulas Hoje</Text>
          <Text type="subtitle">{numberClasses}</Text>
        </View>
        <Icon name="calendar" size={20} color={colorPrimary} style={stylesItem.boxIcon} />
      </View>
      <View style={stylesItem.infoBox}>
        <View style={{ marginLeft: 20 }}>
          <Text>Alunos Ativos</Text>
          <Text type="subtitle">{numberMembers}</Text>
        </View>
        <Icon name="team" size={20} color={colorPrimary} style={stylesItem.boxIcon} />
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
    borderRadius: 8,
    paddingVertical: 14,
    width: "50%",
    flexDirection: "row",
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