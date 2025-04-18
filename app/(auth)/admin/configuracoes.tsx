import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { Button } from "@/components/ThemedButton";
import { TextInput } from "@/components/ThemedTextInput";
import { useState } from "react";
import { ScrollView, StyleSheet, View, Alert, TouchableOpacity } from "react-native";
import { Snackbar } from "react-native-paper";
import Icon from "@expo/vector-icons/AntDesign";
import { useTheme } from "@/context/ThemeContext";

interface AppConfigProps {
  name: string;
  phone: string;
  email: string;
  address: string;
  color: string;
  logo: string;
}

export default function ConfiguracoesAdmin() {
  const { updatePrimaryColor } = useTheme();

  const defaultData: AppConfigProps = {
    name: "Ginásio Novo",
    phone: "+351920421443",
    email: "example@mail.com",
    address: "Av Sá Carneiro 320, Bragança, Bragança, Portugal",
    color: "#007AFF",
    logo: "https://i.imgur.com/3FtD3k5.png",
  };
  const [data, setData] = useState(defaultData);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const colorOptions = [
    "#FCA82A",
    "#1F2937",
    "#007AFF",
    "#8B5CF6",
  ];

  return (
    <View style={{ flex: 1 }}>
      <PageContainer as={ScrollView}>
        <View style={stylesItem.container}>
          <Text type="subtitle">Dados do Ginásio</Text>
          <TextInput
            placeholder="Digite o nome..."
            label="Nome do Ginásio"
            value={data.name}
            onChangeText={s => setData(data => ({ ...data, name: s }))}
          />
          <TextInput
            placeholder="Digite o número de telemóvel..."
            label="Número de Telemóvel"
            value={data.phone}
            onChangeText={s => setData(data => ({ ...data, phone: s }))}
          />
          <TextInput
            placeholder="Digite o email..."
            label="Email de Contacto"
            value={data.email}
            onChangeText={s => setData(data => ({ ...data, email: s }))}
          />
          <TextInput
            placeholder="Digite a morada..."
            label="Morada do Ginásio"
            value={data.address}
            onChangeText={s => setData(data => ({ ...data, address: s }))}
          />
          <View>
            <Text>Cor Principal</Text>
            <View style={stylesItem.colorGrid}>
              {colorOptions.map(color => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setData(data => ({ ...data, color: color }))}
                  style={[stylesItem.colorBox, data.color === color && stylesItem.selectedBox]}

                >
                  <View style={[stylesItem.innerColorBox, { backgroundColor: color }]} />
                </TouchableOpacity>))}
            </View>
          </View>

          <View>
            <Text>Alterar Logo</Text>
            <TouchableOpacity
              onPress={() => console.log("upload")}
              style={stylesItem.uploadBox}>
              <Icon name="upload" size={50} color="#000"></Icon>
            </TouchableOpacity>
          </View>
          <Button style={{ alignItems: "center", marginBottom: 50 }} size="large" onPress={() => dataConfirmationHandler(data, updatePrimaryColor, showSnackbar)}>
            <Text lightColor="#fff">Salvar Alterações</Text>
          </Button>
        </View>
      </PageContainer>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={stylesItem.snackbar}>
        {snackbarMessage}
      </Snackbar>
    </View>

  );
}

function dataConfirmationHandler(data: AppConfigProps, updatePrimaryColor: (color: string) => void, showSnackbar: (message: string) => void) {
  if (data.name.trim().length < 2) {
    Alert.alert("Nome inválido", "Insira um nome com mais de 2 caracteres.")
    return;
  }

  const phoneRegex = /^\+?\d{8,}$/;
  if (!phoneRegex.test(data.phone.trim())) {
    Alert.alert("Telemóvel inválido", "Insira um número de telemóvel válido.")
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email.trim())) {
    Alert.alert("Email inválido", "Insira um email válido.");
    return;
  }

  if (data.address.trim().length < 10) {
    Alert.alert("Morada inválida", "Insira uma morada válida.")
    return;
  }

  updatePrimaryColor(data.color);
  showSnackbar("Configuração atualizada com sucesso.")
}

const stylesItem = StyleSheet.create({
  container: {
    marginTop: 15,
    gap: 20,
    width: "95%",
    alignSelf: "center",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  colorBox: {
    width: "48%",
    height: 30,
    aspectRatio: 2.5,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 2,
    backgroundColor: "#fff",
    borderColor: "#323232",
    justifyContent: "center",
    alignItems: "center",
  },
  innerColorBox: {
    width: "70%",
    height: "50%",
    borderRadius: 8,
  },
  selectedBox: {
    borderColor: "#2563EB",
  },
  uploadBox: {
    width: "100%",
    borderColor: "#323232",
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  snackbar: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
});
