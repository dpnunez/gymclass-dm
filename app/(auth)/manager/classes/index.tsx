import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { Button } from "@/components/ThemedButton";
import { DateDayButton } from "@/components/DateButton";
import { FilterButton } from "@/components/FilterButton";
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import Icon from "@expo/vector-icons/AntDesign";
import { Badge } from "@/components/Badge";
import { Menu, IconButton, Snackbar } from "react-native-paper";
import { useState } from "react";
import { useRouter, Router, useLocalSearchParams } from "expo-router";
import { GestorClassProps } from "@/types/ManagerTypes";

const MOCK_DATA: GestorClassProps[] = [
  {
    id: "1",
    name: "Atletismo",
    prof: "Marcos Dias",
    startingDate: new Date(2025, 3, 18, 14, 0),
    minuteLength: 60,
    vagas: 20,
    inscritos: 18,
  },
  {
    id: "2",
    name: "Yoga Iniciante",
    prof: "Maria Silva",
    startingDate: new Date(2025, 3, 18, 9, 0),
    minuteLength: 60,
    vagas: 18,
    inscritos: 6,
  },
  {
    id: "3",
    name: "Musculação",
    prof: "João Santos",
    startingDate: new Date(2025, 3, 18, 11, 30),
    minuteLength: 60,
    vagas: 10,
    inscritos: 4,
  },
  {
    id: "4",
    name: "Crossfit",
    prof: "Renato Torres",
    startingDate: new Date(2025, 3, 18, 9, 30),
    minuteLength: 45,
    vagas: 11,
    inscritos: 3,
  },
  {
    id: "5",
    name: "Muay Thai",
    prof: "Renato Torres",
    startingDate: new Date(2025, 3, 18, 19, 30),
    minuteLength: 60,
    vagas: 18,
    inscritos: 13,
  },
  {
    id: "6",
    name: "Pilates",
    prof: "Ana Lima",
    startingDate: new Date(2025, 3, 20, 8, 0),
    minuteLength: 50,
    vagas: 10,
    inscritos: 7,
  },
  {
    id: "7",
    name: "Yoga",
    prof: "Luiza Souza",
    startingDate: new Date(2025, 3, 21, 7, 30),
    minuteLength: 60,
    vagas: 12,
    inscritos: 5,
  },
  {
    id: "8",
    name: "Functional Training",
    prof: "Carlos Mendes",
    startingDate: new Date(2025, 3, 23, 18, 0),
    minuteLength: 45,
    vagas: 15,
    inscritos: 12,
  },
  {
    id: "9",
    name: "Boxe",
    prof: "Renato Torres",
    startingDate: new Date(2025, 3, 24, 20, 0),
    minuteLength: 60,
    vagas: 16,
    inscritos: 9,
  },
  {
    id: "10",
    name: "Zumba",
    prof: "Fernanda Alves",
    startingDate: new Date(2025, 3, 26, 18, 30),
    minuteLength: 50,
    vagas: 20,
    inscritos: 14,
  },
  {
    id: "11",
    name: "Stretching",
    prof: "Ana Lima",
    startingDate: new Date(2025, 3, 27, 9, 0),
    minuteLength: 40,
    vagas: 8,
    inscritos: 4,
  },
  {
    id: "12",
    name: "Crossfit",
    prof: "Renato Torres",
    startingDate: new Date(2025, 3, 29, 9, 30),
    minuteLength: 45,
    vagas: 11,
    inscritos: 6,
  },
  {
    id: "13",
    name: "Muay Thai",
    prof: "Renato Torres",
    startingDate: new Date(2025, 3, 29, 19, 30),
    minuteLength: 60,
    vagas: 18,
    inscritos: 15,
  },
  {
    id: "14",
    name: "Muay Thai",
    prof: "Renato Torres",
    startingDate: new Date(2025, 3, 16, 19, 30),
    minuteLength: 60,
    vagas: 13,
    inscritos: 7,
  },
  {
    id: "15",
    name: "Muay Thai",
    prof: "Renato Torres",
    startingDate: new Date(2025, 4, 2, 19, 30),
    minuteLength: 60,
    vagas: 13,
    inscritos: 0,
  },
];

export default function ManagerClasses() {
  const params = useLocalSearchParams();
  if (params.id && !MOCK_DATA.some(item => item.id === params.id)) {
    const newClass: GestorClassProps = {
      id: params.id.toString(),
      name: params.name.toString(),
      prof: params.prof.toString(),
      startingDate: new Date(params.startingDate.toString()),
      minuteLength: parseInt(params.minuteLength.toString()),
      vagas: parseInt(params.vagas.toString()),
      inscritos: parseInt(params.inscritos.toString()),
    }
    MOCK_DATA.push(newClass);
  }

  const today = new Date();
  const todayMidnight =
    new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const [currentDate, setCurrentDate] = useState(todayMidnight);
  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + 1);

  MOCK_DATA.sort((a, b) => a.startingDate.getTime() - b.startingDate.getTime());
  const [data, setData] = useState(MOCK_DATA);

  const selecionado = data.filter(aula => aula.startingDate >= currentDate && aula.startingDate < nextDate);
  const matutinas = selecionado.filter(a => a.startingDate.getHours() < 12);
  const vespertinas = selecionado.filter(a => a.startingDate.getHours() >= 12 && a.startingDate.getHours() < 18);
  const noturnas = selecionado.filter(a => a.startingDate.getHours() >= 18);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <PageContainer as={ScrollView} style={{ gap: 24 }}>
        <DateButtons data={data} currentDate={currentDate}
          setCurrentDate={setCurrentDate} />


        <View style={stylesItem.buttonContainer}>
          <Button size="small"
            onPress={() => router.push("/(auth)/manager/classes/novo")}>
            <Text lightColor="#fff"><Icon name="plus" size={12} color="#fff" /> Nova Aula</Text>
          </Button>
        </View>

        <ClassTimeGroup itemGroup={matutinas} setData={setData}
          showSnackbar={showSnackbar} router={router}
          title={"Aulas Matutinas"} />
        <ClassTimeGroup itemGroup={vespertinas} setData={setData}
          showSnackbar={showSnackbar} router={router}
          title={"Aulas Vespertinas"} />
        <ClassTimeGroup itemGroup={noturnas} setData={setData}
          showSnackbar={showSnackbar} router={router}
          title={"Aulas Noturnas"} />


      </PageContainer>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={stylesItem.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

function ClassItem({ name, id, prof, startingDate, minuteLength, vagas, inscritos, setData, showSnackbar, router }: GestorClassPropsFull) {

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
    <View style={stylesItem.itemContainer}>
      <View>
        <View style={stylesItem.labels}>
          <Text style={{ marginTop: 5 }} type="subtitle">{name}</Text>
          <Badge text={toTimeString(startingDate)} color={"#047857"} backgroundColor="#D1FAE5" />
        </View>
        <Text>Prof. {prof}</Text>
        <View style={stylesItem.labels}>
          <Text><Icon name="clockcircleo" size={14} /> {minuteLength} min</Text>
          <Text><Icon name="team" size={14} /> {vagas - inscritos} vagas</Text>
        </View>
      </View>
      <ClassMenu name={name} id={id} setData={setData} showSnackbar={showSnackbar} router={router} />
    </View>
  );
}

function ClassTimeGroup({ itemGroup, setData, showSnackbar, router, title }: GestorClassGroup) {
  return (
    <>
      {itemGroup.length === 0 ? <></> :
        <><View style={stylesItem.sectionTitle}>
          <Text type="subtitle">{title}</Text>
          <FilterButton />
        </View>
          <View>
            {itemGroup.map(item => (
              <ClassItem key={item.id} name={item.name} id={item.id} prof={item.prof}
                startingDate={item.startingDate}
                minuteLength={item.minuteLength}
                vagas={item.vagas} inscritos={item.inscritos}
                setData={setData} showSnackbar={showSnackbar}
                router={router} />
            ))}
          </View></>}
    </>
  );
}

function ClassMenu({ name, id, setData, showSnackbar, router }: MenuClassProps) {
  const [visible, setVisible] = useState(false);

  function confirmAction() {
    Alert.alert(
      `Confirmar Remover Aula`,
      `Tens certeza de que desejas remover a aula ${name}?\n\nEsta ação não poderá ser desfeita.`,
      [
        {
          text: 'Cancelar',
          style: 'destructive',
        },
        {
          text: 'Confirmar',
          onPress: () => {
            setData(data => data.filter(aula => aula.id !== id));
            showSnackbar(`Aula ${name} removida com sucesso.`)
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={stylesItem.more}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <IconButton
            icon="dots-vertical"
            iconColor="#545454"
            size={27}
            onPress={() => setVisible(true)} />
        }
      >
        <Menu.Item onPress={() => { router.push(`/(auth)/manager/classes/${id}`); setVisible(false); }} title="Editar Aula"></Menu.Item>
        <Menu.Item onPress={() => { confirmAction(); setVisible(false); }} title="Remover Aula"></Menu.Item>
      </Menu>
    </View>
  );
}

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
      {uniqueDays.map((date: Date) => (
        <TouchableOpacity key={date.toString()}
          onPress={() => setCurrentDate(date)}>
          <DateDayButton monthDay={date.getDate()}
            weekDay={weekDays[date.getDay()]}
            active={date.getTime() === currentDate.getTime() ? true : false} />
        </TouchableOpacity>

      ))}
    </ScrollView>
  );
}

interface DateButtonsProps {
  data: GestorClassProps[];
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
}

interface GestorClassUtils {
  setData: React.Dispatch<React.SetStateAction<GestorClassProps[]>>;
  showSnackbar: (message: string) => void;
  router: Router;
}

interface GestorClassPropsFull extends GestorClassProps, GestorClassUtils {
}

interface GestorClassGroup extends GestorClassUtils {
  itemGroup: GestorClassProps[];
  title: string;
}

interface MenuClassProps extends GestorClassUtils {
  id: string;
  name: string;
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
  snackbar: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  buttonContainer: {
    alignSelf: "flex-end",
    marginVertical: 15,
  },
});
