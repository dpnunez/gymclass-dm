import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { Button } from "@/components/ThemedButton";
import { TextInput } from "@/components/ThemedTextInput";
import { useState } from "react";
import { StyleSheet, View, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { GestorItemProps } from "@/types/AdminTypes";
import { addDoc, collection } from "firebase/firestore";
import { firebaseDb } from "@/firebase.config";

export default function NewManager() {
  const router = useRouter();

  const defaultData: Omit<GestorItemProps, "id"> = {
    name: "",
    email: "",
    birthdate: "",
    registration: "Abr 2025",
    status: "convidado",
  };

  const [data, setData] = useState(defaultData);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await addDoc(collection(firebaseDb, "administradores"), data);
      Alert.alert("Sucesso", "Gestor adicionado com sucesso!");
      router.replace("/(auth)/admin/gestores"); // voltar à listagem
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar o gestor.");
    }
  };

  const validateForm = () => {
    if (!data.name.trim().includes(" ") || data.name.trim().split(" ").some(word => word.length < 2)) {
      Alert.alert("Nome inválido", "O nome completo deve conter pelo menos nome e sobrenome.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      Alert.alert("Email inválido", "Insira um email válido.");
      return false;
    }

    const birthdateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!birthdateRegex.test(data.birthdate.trim())) {
      Alert.alert("Data de nascimento inválida", "Insira uma data válida no formato dd/mm/yyyy.");
      return false;
    }

    const [day, month, year] = data.birthdate.trim().split("/").map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      Alert.alert("Data de nascimento inválida", "A data inserida não é válida.");
      return false;
    }

    return true;
  };

  return (
    <PageContainer as={ScrollView}>
      <View style={stylesItem.container}>
        <TextInput
          placeholder="Digite o nome..."
          label="Nome Completo"
          value={data.name}
          onChangeText={s => setData(d => ({ ...d, name: s }))}
        />
        <TextInput
          placeholder="Digite o email..."
          label="Email"
          value={data.email}
          onChangeText={s => setData(d => ({ ...d, email: s }))}
        />
        <TextInput
          placeholder="dd/mm/yyyy"
          label="Data de Nascimento"
          value={data.birthdate}
          onChangeText={s => setData(d => ({ ...d, birthdate: s }))}
        />
        <Button style={{ alignItems: "center" }} size="large" onPress={handleSubmit}>
          <Text lightColor="#fff">Adicionar Gestor</Text>
        </Button>
      </View>
    </PageContainer>
  );
}

const stylesItem = StyleSheet.create({
  container: {
    marginTop: 50,
    gap: 20,
    width: "95%",
    alignSelf: "center",
  },
});