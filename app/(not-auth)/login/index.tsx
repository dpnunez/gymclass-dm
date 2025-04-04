import { Button } from "@/components/ThemedButton";
import { Text } from "@/components/ThemedText";
import { TextInput } from "@/components/ThemedTextInput";
import { PageContainer } from "@/components/PageContainer";
import { Link } from "expo-router";
import { Image, StyleSheet } from "react-native";

export default function Login() {
  return (
    <PageContainer contentContainerStyle={styles.container}>
      <Image
        style={styles.logo}
        source={require("@/assets/images/gymclass-logo.png")}
      />
      <TextInput
        size="large"
        label="Email"
        keyboardType="email-address"
        placeholder="john@doe.com"
      />
      <TextInput
        size="large"
        label="Senha"
        placeholder="Password"
        secureTextEntry
      />
      <Button size="large">Entrar</Button>
      <Text style={styles.signupText}>
        <Text style={styles.signupOpacityText}>Não tem uma conta? </Text>
        <Link style={styles.link} href="/(not-auth)/register">
          Registrar
        </Link>
      </Text>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    maxWidth: 400,
    width: "100%",
    margin: "auto",
    gap: 24,
    justifyContent: "center",
  },
  logo: {
    marginHorizontal: "auto",
  },
  signupText: {
    textAlign: "center",
    fontWeight: "500",
  },
  signupOpacityText: {
    opacity: 0.6,
  },
  link: {
    color: "#007AFF",
  },
});
