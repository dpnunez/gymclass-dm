import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { Button } from "@/components/ThemedButton";
import { TextInput } from "@/components/ThemedTextInput";
import { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Router, useRouter } from "expo-router";
import { GestorItemProps } from "@/types/AdminTypes";

let nextId = 3;

export default function NewManager() {
  const defaultData: GestorItemProps = {
    id: (nextId++).toString(),
    name: "",
    email: "",
    birthdate: "",
    registration: "Abr 2025",
    status: "convidado",
  }
  const [data, setData] = useState(defaultData);

  const router = useRouter();

  return (
    <PageContainer as={View}>
      <View style={stylesItem.container}>
        <TextInput
          placeholder="Digite o nome..."
          label="Nome Completo"
          value={data.name}
          onChangeText={s => setData(data => ({ ...data, name: s }))}
        />
        <TextInput
          placeholder="Digite o email..."
          label="Email"
          value={data.email}
          onChangeText={s => setData(data => ({ ...data, email: s }))}
        />
        <TextInput
          placeholder="dd/mm/yyyy"
          label="Data de Nascimento"
          value={data.birthdate}
          onChangeText={s => setData(data => ({ ...data, birthdate: s }))}
        />
        <Button style={{ alignItems: "center" }} size="large" onPress={() => dataConfirmationHandler(data, router)}>
          <Text lightColor="#fff">Adicionar Gestor</Text>
        </Button>
      </View>
    </PageContainer>
  );
}

function dataConfirmationHandler(data: GestorItemProps, router: Router) {
  if (!data.name.trim().includes(" ") || data.name.trim().split(" ").some(word => word.length < 2)) {
    Alert.alert("Nome inválido", "O nome completo deve conter pelo menos nome e sobrenome.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email.trim())) {
    Alert.alert("Email inválido", "Insira um email válido.");
    return;
  }

  const birthdateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!birthdateRegex.test(data.birthdate.trim())) {
    Alert.alert("Data de nascimento inválida", "Insira uma data válida no formato dd/mm/yyyy.");
    return;
  }

  const [day, month, year] = data.birthdate.trim().split("/").map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
    Alert.alert("Data de nascimento inválida", "A data inserida não é válida.");
    return;
  }

  router.push({
    pathname: `/(auth)/admin/gestores`, params: {
      id: data.id,
      name: data.name,
      email: data.email,
      birthdate: data.birthdate,
      registration: data.registration,
      status: data.status,
    }
  })
}

const stylesItem = StyleSheet.create({
  container: {
    marginTop: 50,
    gap: 20,
    width: "95%",
    alignSelf: "center",
  },
});
