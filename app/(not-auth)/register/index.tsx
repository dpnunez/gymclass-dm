import { Text } from "@/components/ThemedText";
import { PageContainer } from "@/components/PageContainer";
import { SafeAreaView, StyleSheet } from "react-native";
import { TextInput } from "@/components/ThemedTextInput";
import { Button } from "@/components/ThemedButton";
import { useRouter } from "expo-router";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <SafeAreaView>
      <PageContainer contentContainerStyle={styles.container}>
        <Text type="title">Registrar</Text>
        <TextInput label="Nome" placeholder="Nome" />
        <TextInput label="Email" placeholder="Email" />
        <TextInput
          label="Data de Nascimento"
          placeholder="Data de Nascimento"
        />
        <TextInput label="Telefone" placeholder="Telefone" />
        <Button
          size="large"
          style={styles.submitButton}
          onPress={() => router.back()}
        >
          Registrar
        </Button>
      </PageContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },

  submitButton: {
    marginTop: 20,
    width: "100%",
  },
});
