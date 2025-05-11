import { Text } from "@/components/ThemedText";
import { PageContainer } from "@/components/PageContainer";
import { Image, Pressable, SafeAreaView, StyleSheet, View, Alert, Modal, TouchableOpacity } from "react-native";
import { TextInput } from "@/components/ThemedTextInput";
import { Button } from "@/components/ThemedButton";
import { useRouter } from "expo-router";
import Icon from "@expo/vector-icons/AntDesign";
import { useUser } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Snackbar } from "react-native-paper";
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { doc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { firebaseDb } from "@/firebase.config";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, userProfile, logout } = useUser();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [pictureModalVisible, setPictureModalVisible] = useState(false);
  const [tempPictureUrl, setTempPictureUrl] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    birthDate: "",
    phone: "",
    profilePicture: ""
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || "",
        email: userProfile.mail || "",
        birthDate: userProfile.birthDate || "",
        phone: userProfile.phone || "",
        profilePicture: userProfile.profilePicture || ""
      });
      setTempPictureUrl(userProfile.profilePicture || "");
    }
  }, [userProfile]);

  const showSnackbar = (message: string): void => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleSaveChanges = async () => {
    if (!user || !userProfile) {
      showSnackbar("Usuário não encontrado.");
      return;
    }

    setIsSaving(true);
    try {
      // Fetch all user documents to find the one with matching userId
      const userRoleCollection = collection(firebaseDb, "userRole");
      const q = query(userRoleCollection, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        showSnackbar("Perfil de usuário não encontrado no banco de dados.");
        setIsSaving(false);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userDocRef = doc(firebaseDb, "userRole", userDoc.id);

      await updateDoc(userDocRef, {
        displayName: formData.displayName,
        birthDate: formData.birthDate,
        phone: formData.phone,
        profilePicture: formData.profilePicture
      });

      if (newPassword && currentPassword) {
        const auth = getAuth();
        if (auth.currentUser && auth.currentUser.email) {
          try {
            const credential = EmailAuthProvider.credential(
              auth.currentUser.email,
              currentPassword
            );
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updatePassword(auth.currentUser, newPassword);
            showSnackbar("Perfil e senha atualizados com sucesso!");
          } catch (error) {
            console.error("Error updating password:", error);
            showSnackbar("Erro ao atualizar senha. Verifique a senha atual.");
            setIsSaving(false);
            return;
          }
        }
      } else {
        showSnackbar("Perfil atualizado com sucesso!");
      }

      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Error updating profile:", error);
      showSnackbar("Erro ao atualizar perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePictureChange = () => {
    setPictureModalVisible(true);
  };

  const handleSavePictureUrl = () => {
    setFormData(data => ({ ...data, profilePicture: tempPictureUrl }));
    setPictureModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageContainer contentContainerStyle={styles.container}>
        <AvatarEdit
          profilePicture={formData.profilePicture}
          onPress={handlePictureChange}
        />

        <TextInput
          label="Nome"
          placeholder="Nome"
          value={formData.displayName}
          onChangeText={(text) => setFormData(data => ({ ...data, displayName: text }))}
        />

        <TextInput
          label="Email"
          placeholder="Email"
          value={formData.email}
          editable={false}
        />

        <TextInput
          label="Data de Nascimento"
          placeholder="Data de Nascimento"
          value={formData.birthDate}
          onChangeText={(text) => setFormData(data => ({ ...data, birthDate: text }))}
        />

        <TextInput
          label="Telefone"
          placeholder="Telefone"
          value={formData.phone}
          onChangeText={(text) => setFormData(data => ({ ...data, phone: text }))}
        />

        <TextInput
          label="Senha Atual"
          placeholder="Senha Atual (para alterar a senha)"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <TextInput
          label="Nova Senha"
          placeholder="Nova Senha (deixe em branco para manter)"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <View>
          <Button
            size="large"
            style={styles.submitButton}
            onPress={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>

        </View>
      </PageContainer>

      <Modal
        animationType="slide"
        transparent={true}
        visible={pictureModalVisible}
        onRequestClose={() => setPictureModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar Foto de Perfil</Text>

            <TextInput
              placeholder="Insira o URL da imagem..."
              value={tempPictureUrl}
              onChangeText={setTempPictureUrl}
              style={styles.modalInput}
            />

            {tempPictureUrl ? (
              <View style={styles.previewContainer}>
                <Text style={styles.previewText}>Pré-visualização:</Text>
                <Image
                  source={{ uri: tempPictureUrl }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              </View>
            ) : null}

            <View style={styles.modalButtonContainer}>
              <Button
                onPress={() => setPictureModalVisible(false)}
                style={styles.modalButton}
              >
                <Text>Cancelar</Text>
              </Button>
              <Button
                onPress={handleSavePictureUrl}
                style={[styles.modalButton, styles.saveButton]}
              >
                <Text lightColor="#fff">Salvar</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}>
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

interface AvatarEditProps {
  profilePicture: string;
  onPress: () => void;
}

const AvatarEdit: React.FC<AvatarEditProps> = ({ profilePicture, onPress }) => {
  return (
    <Pressable style={{ alignItems: "center" }} onPress={onPress}>
      <View style={{ position: "relative" }}>
        <Image
          source={{
            uri: profilePicture || "https://i.imgur.com/BBMkp9s.png",
            width: 156,
            height: 156,
          }}
          style={styles.userAvatar}
        />
        <Icon
          name="camera"
          size={32}
          color="#3B82F6"
          style={{
            position: "absolute",
            bottom: 14,
            right: 14,
            backgroundColor: "#DBEAFE",
            borderRadius: 100,
            padding: 5,
          }}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  submitButton: {
    marginTop: 20,
    width: "100%",
  },
  userAvatar: {
    width: 156,
    height: 156,
    borderRadius: 100,
    marginBottom: 20,
    marginHorizontal: "auto",
  },
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
  modalText: {
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
    backgroundColor: "#3B82F6",
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
  snackbar: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
});