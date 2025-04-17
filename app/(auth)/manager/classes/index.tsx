import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { Button } from "@/components/ThemedButton";
import { DateDayButton } from "@/components/DateButton";
import { FilterButton } from "@/components/FilterButton";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import Icon from "@expo/vector-icons/AntDesign";
import { Badge } from "@/components/Badge";
import { Menu, IconButton, Snackbar } from "react-native-paper";
import { useState } from "react";
import { useRouter, Router } from "expo-router";
import { GestorClassProps } from "@/types/ManagerTypes";

const MOCK_DATA: GestorClassProps[] = [
  {
    id: "1",
    name: "Atletismo",
    prof: "Marcos Dias",
    startingDate: new Date(2025, 3, 17, 14, 0),
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
  {
    id: "4",
    name: "Crossfit",
    prof: "Renato Torres",
    startingDate: new Date(2025, 3, 17, 9, 30),
    minuteLength: 45,
    vagas: 11,
    inscritos: 3,
  },
  {
    id: "5",
    name: "Muay Thai",
    prof: "Renato Torres",
    startingDate: new Date(2025, 3, 17, 19, 30),
    minuteLength: 60,
    vagas: 18,
    inscritos: 13,
  },
];

export default function ManagerHome() {
  MOCK_DATA.sort((a, b) => a.startingDate.getTime() - b.startingDate.getTime());
  const [data, setData] = useState(MOCK_DATA);
  const matutinas = data.filter(a => a.startingDate.getHours() < 12);
  const vespertinas = data.filter(a => a.startingDate.getHours() >= 12 && a.startingDate.getHours() < 18);
  const noturnas = data.filter(a => a.startingDate.getHours() >= 18);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const router = useRouter();

  return (
    <PageContainer as={ScrollView} style={{ gap: 24 }}>
      <ScrollView
        horizontal
        contentContainerStyle={stylesItem.dateFilterContainer}
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

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={stylesItem.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </PageContainer>
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

function ClassTimeGroup({itemGroup, setData, showSnackbar, router, title}: GestorClassGroup) {
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
            router={router}/>
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
