import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { Image, StyleSheet, View, Alert, TextInput } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useState } from "react";
import { Menu, IconButton, Snackbar } from "react-native-paper";

const MOCK_DATA: AtletaItemProps[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria.silva@gmail.com",
    birthdate: "07/04/2000",
    registration: "Jan 2025",
    status: "ativo",
  },
  {
    id: "2",
    name: "João Silva",
    email: "joao.silva@gmail.com",
    birthdate: "10/10/2002",
    registration: "Mar 2025",
    status: "aguarda_validacao",
  },
  {
    id: "3",
    name: "Carlos Ferreira",
    email: "carlos1997@gmail.com",
    birthdate: "01/11/1997",
    registration: "Mar 2025",
    status: "ativo",
  },
];

type AtletaStatus = "ativo" | "aguarda_validacao";

export default function AdminUsersPage() {
  const [data, setData] = useState(MOCK_DATA);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <PageContainer as={View}>
      <TextInput
        placeholder="Pesquisar por nome..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={stylesItem.searchInput} />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AtletaItem
            id={item.id}
            name={item.name}
            email={item.email}
            birthdate={item.birthdate}
            registration={item.registration}
            status={item.status}
            setData={setData}
            showSnackbar={(message: string) => {
              setSnackbarMessage(message);
              setSnackbarVisible(true);
            }}
          />
        )}
        contentContainerStyle={{ gap: 32 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ width: "100%" }}
        horizontal={false}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </PageContainer>
  );
}

interface AtletaItemProps {
  id: string;
  name: string;
  email: string;
  birthdate: string;
  registration: string;
  status: AtletaStatus;
}

interface AtletaItemFullProps extends AtletaItemProps {
  setData: React.Dispatch<React.SetStateAction<AtletaItemProps[]>>;
  showSnackbar: (message: string) => void;
}

interface MenuAtletaProps {
  id: string;
  name: string;
  status: AtletaStatus;
  setData: React.Dispatch<React.SetStateAction<AtletaItemProps[]>>;
  showSnackbar: (message: string) => void;
}


function AtletaItem({ name, email, birthdate, registration, status, id, setData, showSnackbar }: AtletaItemFullProps) {
  const colors = {
    ativo: "#D1FAE5",
    aguarda_validacao: "#FBFFC1",
  };
  const colors2 = {
    ativo: "#047857",
    aguarda_validacao: "#78780E",
  };

  const statusLabel = {
    ativo: "Ativo",
    aguarda_validacao: "Aguarda Validação",
  } as const;

  return (
    <View style={stylesItem.container}>
      <AtletaMenu name={name} status={status} id={id} setData={setData} showSnackbar={showSnackbar} />
      <View style={stylesItem.container2}>
        <Image
          style={stylesItem.image}
          source={{
            uri: "https://reactnative.dev/img/tiny_logo.png",
          }}
        />
        <View style={{ gap: 5, padding: 10 }}>
          <Text type="subtitle">{name}</Text>
          <Text>{email}</Text>
          <Text>{`Nascido(a): ${birthdate}`}</Text>

        </View>
      </View>
      <View style={stylesItem.bottomSection}>
        <View style={{ backgroundColor: colors[status], ...stylesItem.detailSection }}>
          <Text lightColor={colors2[status]}>{statusLabel[status]}</Text>
        </View>
        <View style={stylesItem.detailSection}>
          <Text>{`Registo: ${registration}`}</Text>
        </View>
      </View>
    </View>
  );
}

type ActionType = "validar" | "remover";

function AtletaMenu({ name, status, id, setData, showSnackbar }: MenuAtletaProps) {
  const options = { validar: "Validar Atleta", remover: "Remover Atleta" };
  const optionLabels = { validar: "validar o atleta ", remover: "remover o atleta " };

  const [visible, setVisible] = useState(false);

  function confirmAction(action: ActionType) {
    Alert.alert(
      `Confirmar ${options[action]}`,
      `Tens certeza de que desejas ${optionLabels[action] + name}?\n\nEsta ação não poderá ser desfeita.`,
      [
        {
          text: 'Cancelar',
          style: 'destructive',
        },
        {
          text: 'Confirmar',
          onPress: () => {
            switch (action) {
              case "validar":
                setData(data => data.map((atleta) => atleta.id === id ? { ...atleta, status: "ativo" } : atleta));
                showSnackbar(`Atleta ${name} validado com sucesso.`);
                break;
              case "remover":
                setData(data => data.filter(atleta => atleta.id !== id));
                showSnackbar(`Atleta ${name} removido com sucesso.`);
                break;
            }
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
            size={30}
            onPress={() => setVisible(true)}
          />
        }
      >
        {status === "aguarda_validacao" ? <Menu.Item onPress={() => { confirmAction("validar"); setVisible(false); }} title={options["validar"]}></Menu.Item> : <></>}
        <Menu.Item onPress={() => { confirmAction("remover"); setVisible(false); }} title={options["remover"]}></Menu.Item>
      </Menu>
    </View>
  );
}

const stylesItem = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "solid",
    padding: 8,
    position: "relative",
  },
  container2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  detailSection: {
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  bottomSection: {
    flexDirection: "row",
    gap: 7,
    marginLeft: 4,
  },
  more: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  searchInput: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  }
});

