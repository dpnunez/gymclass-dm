import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { Button } from "@/components/ThemedButton";
import { TextInput } from "@/components/ThemedTextInput";
import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Alert, TouchableOpacity, ActivityIndicator, Modal, Image } from "react-native";
import { Snackbar } from "react-native-paper";
import Icon from "@expo/vector-icons/AntDesign";
import { useTheme } from "@/context/ThemeContext";
import { useConfig, AppConfigProps } from "@/context/ConfigContext";

export default function ConfiguracoesAdmin() {
  const { updatePrimaryColor } = useTheme();
  const { config, loading, updateConfig } = useConfig();

  // Local state for form
  const [formData, setFormData] = useState<AppConfigProps>({
    name: "",
    phone: "",
    email: "",
    address: "",
    color: "",
    logo: "",
  });

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Modal state for logo URL input
  const [logoModalVisible, setLogoModalVisible] = useState(false);
  const [tempLogoUrl, setTempLogoUrl] = useState("");

  // Update local form data when config is loaded
  useEffect(() => {
    if (!loading) {
      setFormData(config);
    }
  }, [config, loading]);

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

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Update Firebase configuration
      const success = await updateConfig(formData);

      if (success) {
        if (formData.color !== config.color) {
          updatePrimaryColor(formData.color);
        }

        showSnackbar("Configuração atualizada com sucesso.");
      }
    } catch (error) {
      console.error("Error saving configuration:", error);
      Alert.alert("Erro", "Não foi possível salvar as configurações.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoChange = () => {
    // Set the temp logo URL to the current value and open the modal
    setTempLogoUrl(formData.logo);
    setLogoModalVisible(true);
  };

  const handleSaveLogoUrl = () => {
    // Validate and save the URL
    if (tempLogoUrl && tempLogoUrl.trim() !== "") {
      setFormData(data => ({ ...data, logo: tempLogoUrl.trim() }));
    }
    setLogoModalVisible(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colorOptions[2]} />
        <Text style={{ marginTop: 10 }}>A carregar configurações...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <PageContainer as={ScrollView}>
        <View style={stylesItem.container}>
          <Text type="subtitle">Dados do Ginásio</Text>
          <TextInput
            placeholder="Digite o nome..."
            label="Nome do Ginásio"
            value={formData.name}
            onChangeText={s => setFormData(data => ({ ...data, name: s }))}
          />
          <TextInput
            placeholder="Digite o número de telemóvel..."
            label="Número de Telemóvel"
            value={formData.phone}
            onChangeText={s => setFormData(data => ({ ...data, phone: s }))}
          />
          <TextInput
            placeholder="Digite o email..."
            label="Email de Contacto"
            value={formData.email}
            onChangeText={s => setFormData(data => ({ ...data, email: s }))}
          />
          <TextInput
            placeholder="Digite a morada..."
            label="Morada do Ginásio"
            value={formData.address}
            onChangeText={s => setFormData(data => ({ ...data, address: s }))}
          />
          <View>
            <Text>Cor Principal</Text>
            <View style={stylesItem.colorGrid}>
              {colorOptions.map(color => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setFormData(data => ({ ...data, color: color }))}
                  style={[stylesItem.colorBox, formData.color === color && stylesItem.selectedBox]}
                >
                  <View style={[stylesItem.innerColorBox, { backgroundColor: color }]} />
                </TouchableOpacity>))}
            </View>
          </View>

          <View>
            <Text>Alterar Logo</Text>
            <TouchableOpacity
              onPress={handleLogoChange}
              style={stylesItem.uploadBox}>
              <Icon name="link" size={30} color="#000" />
              <Text style={{ marginTop: 5 }}>Insira o URL da imagem</Text>
              {formData.logo && (
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    color: "#666",
                    textAlign: "center"
                  }}
                  numberOfLines={2}
                >
                  {formData.logo}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <Button
            style={{ alignItems: "center", marginBottom: 50 }}
            size="large"
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text lightColor="#fff">
              {isSaving ? "A guardar..." : "Salvar Alterações"}
            </Text>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={logoModalVisible}
        onRequestClose={() => setLogoModalVisible(false)}
      >
        <View style={stylesItem.modalContainer}>
          <View style={stylesItem.modalContent}>
            <Text style={stylesItem.modalTitle}>Alterar Logo</Text>

            <TextInput
              placeholder="Insira o URL da imagem..."
              value={tempLogoUrl}
              onChangeText={setTempLogoUrl}
              style={stylesItem.modalInput}
            />

            {tempLogoUrl ? (
              <View style={stylesItem.previewContainer}>
                <Text style={stylesItem.previewText}>Pré-visualização:</Text>
                <Image
                  source={{ uri: tempLogoUrl }}
                  style={stylesItem.previewImage}
                  resizeMode="contain"
                />
              </View>
            ) : null}

            <View style={stylesItem.modalButtonContainer}>
              <Button
                onPress={() => setLogoModalVisible(false)}
                style={stylesItem.modalButton}
              >
                <Text>Cancelar</Text>
              </Button>
              <Button
                onPress={handleSaveLogoUrl}
                style={[stylesItem.modalButton, stylesItem.saveButton]}
              >
                <Text lightColor="#fff">Salvar</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
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
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  previewContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  previewText: {
    marginBottom: 5,
    fontSize: 14,
    color: "#666",
  },
  previewImage: {
    width: "100%",
    height: 100,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
});