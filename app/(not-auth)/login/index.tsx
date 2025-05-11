import { Button } from "@/components/ThemedButton";
import { Text } from "@/components/ThemedText";
import { PageContainer } from "@/components/PageContainer";
import { Link } from "expo-router";
import { Image, StyleSheet, Alert } from "react-native";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp, firebaseAuth, firebaseDb } from "@/firebase.config";
import { ThemedTextInputForm } from "@/components/ThemedTextInputForm";
import { z } from "zod";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { useUser } from "@/context/AuthContext";

const loginSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();
  const { getUserRole, redirectToHome, getUserProfile } = useUser()

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const res = await signInWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password
      );

      if (!res.user.emailVerified) {
        Alert.alert(
          "Email não verificado",
          "Por favor, verifique seu email antes de fazer login."
        );
        return;
      };
      const userProfile = await getUserProfile(res.user.uid!);
      if (userProfile?.status !== "active") {
        Alert.alert(
          "Usuário não ativo",
          "Por favor, peça a um gestor para que ative sua conta"
        );
        return;
      };

      const role = await getUserRole(res.user.uid);

      redirectToHome(role!)

      Alert.alert("Login realizado com sucesso!");
    } catch (error: any) {
      Alert.alert("Erro ao fazer login", error.message);
    }
  };

  return (
    <PageContainer contentContainerStyle={styles.container}>
      <Image
        style={styles.logo}
        source={require("@/assets/images/gymclass-logo.png")}
      />
      <ThemedTextInputForm
        size="large"
        label="Email"
        name="email"
        control={control}
        keyboardType="email-address"
        placeholder="john@doe.com"
        error={!!errors.email?.message}
        helperText={errors.email?.message}
      />
      <ThemedTextInputForm
        size="large"
        label="Senha"
        name="password"
        control={control}
        placeholder="Password"
        secureTextEntry
        error={!!errors.password?.message}
        helperText={errors.password?.message}
      />
      <Button
        size="large"
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>
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
