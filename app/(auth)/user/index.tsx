import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { WarningBanner } from "@/components/WarningBanner";
import { ScrollView, StyleSheet, View, TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from "@expo/vector-icons/AntDesign";
import { Button } from "@/components/ThemedButton";
import { useRouter } from "expo-router";
import { Badge } from "@/components/Badge";
import { DateDayButton } from "@/components/DateButton";
import { FilterButton } from "@/components/FilterButton";
import { GestorClassProps } from "@/types/ManagerTypes";
import { useUser } from "@/context/AuthContext";
import { useClasses } from "@/context/ClassContext";

export default function UserHome() {
  const { user } = useUser();
  const {
    loading,
    maxClassesReached,
    currentDate,
    setCurrentDate,
    getClassesForCurrentDate,
    isUserEnrolled,
    classes
  } = useClasses();

  const router = useRouter();
  const selectedClasses = getClassesForCurrentDate();

  const userName = user?.displayName?.split(" ")[0] || "Usuário";

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
    <PageContainer contentContainerStyle={styles.container}>
      <View>
        <Text type="subtitle">Olá {userName}</Text>
        <Text>Bem-vindo à tela inicial do usuário!</Text>
      </View>

      {maxClassesReached && (
        <WarningBanner title="Limite máximo de aulas atingido!" />
      )}

      <View style={styles.sectionTitle}>
        <Text type="subtitle">Aulas Disponíveis</Text>
        <FilterButton />
      </View>

      <DateButtons
        data={classes}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />

      <ClassTimeGroup
        itemGroup={selectedClasses}
        isUserEnrolled={isUserEnrolled}
        router={router}
      />
    </PageContainer>
  );
}

function ClassItem({
  id,
  name,
  prof,
  startingDate,
  minuteLength,
  vagas,
  sala,
  inscritos,
  isUserEnrolled,
  router
}: GestorClassPropsFull) {

  const toTimeString = (date: Date, extraMin: number = 0) => {
    const temp = new Date(date);
    if (extraMin > 0) temp.setMinutes(temp.getMinutes() + extraMin);
    return temp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const availableSpots = vagas - inscritos;
  const enrolled = isUserEnrolled(id);
  const isFull = availableSpots <= 0;

  return (
    <View style={stylesAvailableClassItem.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text style={stylesAvailableClassItem.title}>{name}</Text>
          <Text>{prof}</Text>
        </View>
        <Badge
          text={`${availableSpots} vagas`}
          color={"#ffffff"}
          backgroundColor={isFull ? "#ff6b6b" : "#ffffff"}
        />
      </View>
      <View style={{ flexDirection: "row", gap: 24 }}>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Icon name="clockcircleo" size={16} color="#000" />
          <Text>{`${toTimeString(startingDate)} - ${minuteLength} min`}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Icon name="enviromento" size={16} color="#000" />
          <Text>{`Sala ${sala}`}</Text>
        </View>
      </View>
      {!enrolled ?
        (<Button
          disabled={isFull}
          onPress={() => router.push(`/(auth)/user/classes/${id}`)}
        >
          {isFull ? "Lotada" : "Inscrever-se"}
        </Button>) :
        (<Button
          onPress={() => router.push(`/(auth)/user/classes/${id}`)}
          lightColor="#c2c2c2"
        >
          {"Ver Detalhes"}
        </Button>)
      }
    </View>
  );
}

function ClassTimeGroup({
  itemGroup,
  isUserEnrolled,
  router
}: GestorClassGroup) {
  return (
    <>
      {itemGroup.length === 0 ? (
        <View style={styles.noClassesContainer}>
          <Text>Nenhuma aula disponível nesta data.</Text>
        </View>
      ) : (
        <View>
          {itemGroup.map(item => (
            <ClassItem
              key={item.id}
              {...item}
              isUserEnrolled={isUserEnrolled}
              router={router}
            />
          ))}
        </View>
      )}
    </>
  );
}

const stylesAvailableClassItem = StyleSheet.create({
  container: {
    gap: 10,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
  },
});

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  filter: {
    backgroundColor: "#F3F4F6",
  },
  sectionTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  noClassesContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

function DateButtons({ data, currentDate, setCurrentDate }: DateButtonsProps) {
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const today = new Date();
  const todayMidnight =
    new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const uniqueDays = Array.from(
    new Set(
      data
        .filter(aula => aula.startingDate >= todayMidnight)
        .map(aula => aula.startingDate.toLocaleDateString("en-GB"))
    )
  ).map(date => {
    const [day, month, year] = date.split("/").map(Number);
    return new Date(year, month - 1, day);
  });

  return (
    <ScrollView
      horizontal
      contentContainerStyle={stylesItem.dateFilterContainer}
      showsHorizontalScrollIndicator
    >
      {uniqueDays.length > 0 ? (
        uniqueDays.map((date: Date) => (
          <TouchableOpacity
            key={date.toString()}
            onPress={() => setCurrentDate(date)}
          >
            <DateDayButton
              monthDay={date.getDate()}
              weekDay={weekDays[date.getDay()]}
              active={date.getTime() === currentDate.getTime() ? true : false}
            />
          </TouchableOpacity>
        ))
      ) : (
        <Text>Nenhuma aula disponível</Text>
      )}
    </ScrollView>
  );
}

interface DateButtonsProps {
  data: GestorClassProps[];
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
}

interface GestorClassUtils {
  isUserEnrolled: (classId: string) => boolean;
  router: any;
}

interface GestorClassPropsFull extends GestorClassProps, GestorClassUtils {
}

interface GestorClassGroup extends GestorClassUtils {
  itemGroup: GestorClassProps[];
}

const stylesItem = StyleSheet.create({
  dateFilterContainer: {
    gap: 10,
    height: 80,
    marginTop: 20,
  },
  sectionTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  itemContainer: {
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
  },
  labels: {
    flexDirection: "row",
    gap: 10,
  },
  more: {
    position: "absolute",
    right: 0,
    top: 5,
  },
  buttonContainer: {
    alignSelf: "flex-end",
    marginVertical: 15,
  },
});