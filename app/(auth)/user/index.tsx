import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { WarningBanner } from "@/components/WarningBanner";
import { ScrollView, StyleSheet, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Icon from "@expo/vector-icons/AntDesign";
import { useTheme } from "@react-navigation/native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Button } from "@/components/ThemedButton";
import { useRouter } from "expo-router";
import { Badge } from "@/components/Badge";

export default function UserHome() {
  const secondaryBackground = useThemeColor({}, "secondary");
  return (
    <PageContainer contentContainerStyle={styles.container}>
      <View>
        <Text type="subtitle">Olá Mária</Text>
        <Text>Bem-vindo à tela inicial do usuário!</Text>
      </View>

      <WarningBanner title="Limite máximo de aulas atingido!" />

      <View style={styles.sectionTitle}>
        <Text type="subtitle">Aulas Disponíveis</Text>
        <FilterButton />
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.dateFilterContainer}
        showsHorizontalScrollIndicator
      >
        <DateDayButton monthDay={1} weekDay="Seg" />
        <DateDayButton monthDay={2} weekDay="Ter" />
        <DateDayButton monthDay={3} weekDay="Qua" active />
        <DateDayButton monthDay={4} weekDay="Qui" />
        <DateDayButton monthDay={5} weekDay="Sex" />
        <DateDayButton monthDay={6} weekDay="Sab" />
        <DateDayButton monthDay={7} weekDay="Dom" />
      </ScrollView>

      <View>
        <AvaliableClassItem
          title="Matemática"
          professor="Prof. João"
          vacancies={2}
          time="10:00 - 11:00"
          room="Sala 3"
        />
        <AvaliableClassItem
          title="História"
          professor="Prof. Ana"
          vacancies={5}
          time="11:00 - 12:00"
          room="Sala 2"
        />
        <AvaliableClassItem
          title="Química"
          professor="Prof. Carlos"
          vacancies={0}
          time="13:00 - 14:00"
          room="Laboratório 1"
        />
        <AvaliableClassItem
          title="Física"
          professor="Prof. Beatriz"
          vacancies={10}
          time="14:00 - 15:00"
          room="Sala 4"
        />
        <AvaliableClassItem
          title="Inglês"
          professor="Prof. Marcos"
          vacancies={3}
          time="15:00 - 16:00"
          room="Sala 5"
        />
        <AvaliableClassItem
          title="Educação Física"
          professor="Prof. Clara"
          vacancies={8}
          time="16:00 - 17:00"
          room="Quadra"
        />
      </View>
    </PageContainer>
  );
}

function FilterButton() {
  return (
    <Pressable
      style={[
        {
          backgroundColor: "#F3F4F6",
        },
        filterButtonStyles.filterButton,
      ]}
    >
      <Icon name="filter" size={24} color="#000" />
    </Pressable>
  );
}

const filterButtonStyles = StyleSheet.create({
  filterButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 10,
  },
});

interface DateButtonProps {
  monthDay: number;
  weekDay: string;
  active?: boolean;
}

function DateDayButton({ monthDay, weekDay, active = false }: DateButtonProps) {
  const notActiveBg = useThemeColor({}, "secondary");
  const activeBg = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");
  const backgroundColor = active ? activeBg : notActiveBg;

  return (
    <Pressable
      style={[
        {
          backgroundColor,
        },
        dateButtonStyles.dateButton,
      ]}
    >
      <Text
        style={[
          dateButtonStyles.weekDay,
          { color: active ? "#fff" : textColor },
        ]}
      >
        {weekDay}
      </Text>
      <Text
        style={[
          dateButtonStyles.monthDay,
          {
            color: active ? "#fff" : textColor,
          },
        ]}
      >
        {monthDay}
      </Text>
    </Pressable>
  );
}

const dateButtonStyles = StyleSheet.create({
  dateButton: {
    borderRadius: 10,
    padding: 10,
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  monthDay: {
    fontSize: 20,
    fontWeight: "bold",
  },
  weekDay: {
    opacity: 0.8,
    fontSize: 16,
    fontWeight: "bold",
  },
});

interface AvaliableClassItemProps {
  title: string;
  professor: string;
  vacancies: number;
  time: string;
  room: string;
}

const AvaliableClassItem = ({
  title,
  professor,
  vacancies,
  time,
  room,
}: AvaliableClassItemProps) => {
  const badgeColor = vacancies < 3 ? "#B91C1C" : "#047857";
  const badgeBgColor = vacancies < 3 ? "#FEE2E2" : "#D1FAE5";

  const router = useRouter();

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
          <Text style={stylesAvailableClassItem.title}>{title}</Text>
          <Text>{professor}</Text>
        </View>
        <Badge
          text={`${vacancies} vagas`}
          color={badgeColor}
          backgroundColor={badgeBgColor}
        />
      </View>
      <View style={{ flexDirection: "row", gap: 24 }}>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Icon name="clockcircleo" size={16} color="#000" />
          <Text>{time}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Icon name="enviromento" size={16} color="#000" />
          <Text>{room}</Text>
        </View>
      </View>
      <Button
        disabled={vacancies === 0}
        onPress={() => router.push(`/(auth)/user/classes/abc/confirm`)}
      >
        {vacancies === 0 ? "Lotada" : "Inscrever-se"}
      </Button>
    </View>
  );
};

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
  dateFilterContainer: {
    gap: 10,
  },
});
