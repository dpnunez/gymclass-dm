import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { Button } from "@/components/ThemedButton";
import { GestorStatus, GestorItemProps } from "@/types/AdminTypes";
import { Image, StyleSheet, View, Alert, TextInput } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useState } from "react";
import { Menu, IconButton, Snackbar } from "react-native-paper";
import Icon from "@expo/vector-icons/AntDesign";
import { useRouter, useLocalSearchParams } from "expo-router";

const MOCK_DATA: GestorItemProps[] = [
    {
        id: "1",
        name: "Pedro Rodrigues",
        email: "pedror98@gmail.com",
        birthdate: "01/01/1988",
        registration: "Jan 2019",
        status: "ativo",
    },
    {
        id: "2",
        name: "Renato Goes",
        email: "renato.goes@gmail.com",
        birthdate: "22/04/1996",
        registration: "Mar 2025",
        status: "convidado",
    },
];

export default function AdminManagersPage() {
    const params = useLocalSearchParams();
    if (params.id) {
        const newGestor: GestorItemProps = {
            id: params.id.toString(),
            name: params.name.toString(),
            email: params.email.toString(),
            birthdate: params.birthdate.toString(),
            registration: params.registration.toString(),
            status: params.status.toString() as GestorStatus,
        }
        MOCK_DATA.push(newGestor);
    }

    const [data, setData] = useState(MOCK_DATA);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const filteredData = data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const router = useRouter();

    return (
        <PageContainer as={View}>
            <View style={{ alignSelf: "flex-end" }}>
                <Button size="small" style={stylesItem.button} onPress={() => router.push(`/(auth)/admin/gestores/novo`)}>
                    <Text lightColor="#fff"><Icon name="plus" size={12} color="#fff" /> Novo Gestor</Text>
                </Button>
            </View>


            <TextInput
                placeholder="Pesquisar por nome..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={stylesItem.searchInput} />
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <GestorItem
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
                style={stylesItem.snackbar}
            >
                {snackbarMessage}
            </Snackbar>
        </PageContainer>
    );
}

interface GestorItemFullProps extends GestorItemProps {
    setData: React.Dispatch<React.SetStateAction<GestorItemProps[]>>;
    showSnackbar: (message: string) => void;
}

interface MenuGestorProps {
    id: string;
    name: string;
    setData: React.Dispatch<React.SetStateAction<GestorItemProps[]>>;
    showSnackbar: (message: string) => void;
}


function GestorItem({ name, email, birthdate, registration, status, id, setData, showSnackbar }: GestorItemFullProps) {
    const colors = {
        ativo: "#D1FAE5",
        convidado: "#FFC067",
    };
    const colors2 = {
        ativo: "#047857",
        convidado: "#C77400",
    };
    const statusLabel = {
        ativo: "Ativo",
        convidado: "Convidado",
    } as const;

    return (
        <View style={stylesItem.container}>
            <GestorMenu name={name} id={id} setData={setData} showSnackbar={showSnackbar} />
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

type ActionType = "remover";

function GestorMenu({ name, id, setData, showSnackbar }: MenuGestorProps) {
    const [visible, setVisible] = useState(false);

    function confirmAction(action: ActionType) {
        Alert.alert(
            `Confirmar Remover Gestor`,
            `Tens certeza de que desejas remover o gestor ${name}?\n\nEsta ação não poderá ser desfeita.`,
            [
                {
                    text: 'Cancelar',
                    style: 'destructive',
                },
                {
                    text: 'Confirmar',
                    onPress: () => {
                        setData(data => data.filter(gestor => gestor.id !== id));
                        showSnackbar(`Gestor ${name} removido com sucesso.`);
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
                <Menu.Item onPress={() => { confirmAction("remover"); setVisible(false); }} title="Remover Gestor"></Menu.Item>
            </Menu>
        </View>
    );
}

const stylesItem = StyleSheet.create({
    container: {
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: 10,
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
    },
    button: {
        width: "35%",
        alignItems: "center",
        marginBottom: 15,
        padding: 7,
    },
    snackbar: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
    },
});

