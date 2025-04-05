import { Text } from "@/components/ThemedText";
import { PageContainer } from "@/components/PageContainer";
import { Image, Pressable, SafeAreaView, StyleSheet, View } from "react-native";
import { TextInput } from "@/components/ThemedTextInput";
import { Button } from "@/components/ThemedButton";
import { useRouter } from "expo-router";
import Icon from "@expo/vector-icons/AntDesign";

export default function EditProfilePage() {
  const router = useRouter();

  return (
    <PageContainer contentContainerStyle={styles.container}>
      <AvatarEdit />
      <TextInput label="Nome" placeholder="Nome" />
      <TextInput label="Email" placeholder="Email" />
      <TextInput label="Data de Nascimento" placeholder="Data de Nascimento" />
      <TextInput label="Telefone" placeholder="Telefone" />
      <TextInput label="Senha" placeholder="Senha" secureTextEntry />
      <TextInput label="Nova Senha" placeholder="Nova Senha" secureTextEntry />
      <View>
        <Button
          size="large"
          style={styles.submitButton}
          onPress={() => router.back()}
        >
          Salvar Alterações
        </Button>

        <Button
          size="large"
          lightColor="#EF4444"
          style={[
            styles.submitButton,
            {
              marginBottom: 32,
            },
          ]}
          onPress={() => router.replace("/(not-auth)/login")}
        >
          Deletar Conta
        </Button>
      </View>
    </PageContainer>
  );
}

const AvatarEdit = () => {
  return (
    <Pressable style={{ alignItems: "center" }}>
      <View style={{ position: "relative" }}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Pele_con_brasil_%28cropped%29.jpg",
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
      <Text style={{ textAlign: "center" }}>Altere sua foto de perfil</Text>
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
});
