import { useEffect, useState } from "react";
import { View, TextInput, Alert, StyleSheet, Image } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Snackbar, IconButton, Menu } from "react-native-paper";
import Icon from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firebaseDb } from "@/firebase.config";

import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { Button } from "@/components/ThemedButton";
import { GestorStatus, GestorItemProps } from "@/types/AdminTypes";

export default function AdminManagersPage() {
    const router = useRouter();
    const [data, setData] = useState<GestorItemProps[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const loadData = async () => {
        try {
            const snapshot = await getDocs(collection(firebaseDb, "administradores"));
            const gestores: GestorItemProps[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as GestorItemProps[];
            setData(gestores);
        } catch (err) {
            setSnackbarMessage("Erro ao carregar gestores.");
            setSnackbarVisible(true);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <PageContainer as={View}>
            <View style={{ alignSelf: "flex-end" }}>
                <Button size="small" style={styles.button} onPress={() => router.push("/(auth)/admin/gestores/novo")}>
                    <Text lightColor="#fff"><Icon name="plus" size={12} color="#fff" /> Novo Gestor</Text>
                </Button>
            </View>

            <TextInput
                placeholder="Pesquisar por nome..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
            />

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <GestorItem {...item} setData={setData} showSnackbar={(message) => {
                        setSnackbarMessage(message);
                        setSnackbarVisible(true);
                    }} />
                )}
                contentContainerStyle={{ gap: 32 }}
                style={{ width: "100%" }}
                horizontal={false}
                showsVerticalScrollIndicator={false}
            />

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                style={styles.snackbar}
            >
                {snackbarMessage}
            </Snackbar>
        </PageContainer>
    );
}

function GestorItem({ id, name, email, birthdate, registration, status, setData, showSnackbar }: GestorItemProps & {
    setData: React.Dispatch<React.SetStateAction<GestorItemProps[]>>;
    showSnackbar: (message: string) => void;
}) {
    const colors = {
        ativo: "#D1FAE5",
        convidado: "#FFC067",
    };
    const colors2 = {
        ativo: "#047857",
        convidado: "#C77400",
    };

    return (
        <View style={styles.container}>
            <GestorMenu id={id} name={name} setData={setData} showSnackbar={showSnackbar} />
            <View style={styles.container2}>
                <Image
                    style={styles.image}
                    source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
                />
                <View style={{ gap: 5, padding: 10 }}>
                    <Text type="subtitle">{name}</Text>
                    <Text>{email}</Text>
                    <Text>{`Nascido(a): ${birthdate}`}</Text>
                </View>
            </View>
            <View style={styles.bottomSection}>
                <View style={[styles.detailSection, { backgroundColor: colors[status] }]}>
                    <Text lightColor={colors2[status]}>{status}</Text>
                </View>
                <View style={styles.detailSection}>
                    <Text>{`Registo: ${registration}`}</Text>
                </View>
            </View>
        </View>
    );
}

function GestorMenu({ id, name, setData, showSnackbar }: {
    id: string;
    name: string;
    setData: React.Dispatch<React.SetStateAction<GestorItemProps[]>>;
    showSnackbar: (message: string) => void;
}) {
    const [visible, setVisible] = useState(false);

    const removeGestor = async () => {
        try {
            await deleteDoc(doc(firebaseDb, "administradores", id));
            setData(prev => prev.filter(item => item.id !== id));
            showSnackbar(`Gestor ${name} removido com sucesso.`);
        } catch (error) {
            showSnackbar(`Erro ao remover o gestor ${name}.`);
        }
    };

    const confirmAction = () => {
        Alert.alert(
            "Confirmar Remoção",
            `Deseja realmente remover o gestor ${name}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Confirmar",
                    onPress: removeGestor,
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <View style={styles.more}>
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
                <Menu.Item onPress={() => { confirmAction(); setVisible(false); }} title="Remover Gestor" />
            </Menu>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        padding: 8,
        backgroundColor: "#fff",
        elevation: 2,
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
