import { Text } from "@/components/ThemedText";
import { PageContainer } from "@/components/PageContainer";
import { SafeAreaView, StyleSheet, Alert } from "react-native";
import { ThemedTextInputForm as TextInput } from "@/components/ThemedTextInputForm";
import { Button } from "@/components/ThemedButton";
import { useRouter } from "expo-router";

import { firebaseApp, firebaseDb } from "@/firebase.config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection } from "firebase/firestore";

const schema = z
  .object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("Insira um email válido"),
    birthDate: z.string().min(1, "A data de nascimento é obrigatória"),
    phone: z.string().min(9, "Insira um telefone válido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: z.ZodIssueCode.custom,
        message: "As senhas não coincidem",
      });
    }
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleRegister = async () => {
    const auth = getAuth(firebaseApp);
    const { email, password, name, birthDate, phone } = form.getValues();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await sendEmailVerification(user);
      await addDoc(collection(firebaseDb, "userRole"), {
        userId: user.uid,
        mail: email,
        displayName: name,
        birthDate: birthDate,
        phone: phone,
        role: "consumer",
        status: "inactive",
        profilePicture: "https://i.imgur.com/BBMkp9s.png", // default
        registration: new Date().toLocaleDateString("en-GB"),
      })

      Alert.alert(
        "Sucesso",
        "Um email de confirmação foi enviado. Por favor, verifique sua caixa de entrada.",
        [
          {
            text: "Entrar",
            onPress: () => router.push("/login"),
          },
        ]
      );
    } catch (error: any) {
      console.log(error)
      if (error.code === "auth/email-already-in-use") {
        Alert.alert(
          "Ocorreu um erro",
          "Este email já está cadastrado. Por favor, use outro email ou faça login.",
          [
            {
              text: "Fazer Login",
              onPress: () => router.replace("/(not-auth)/login"),
            },
            {
              text: "Cancelar",
              style: "cancel",
            },
          ]
        );
      } else {
        Alert.alert("Erro", "Ocorreu um erro ao registrar. Tente novamente.");
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageContainer contentContainerStyle={styles.container}>
        <Text type="title">Registrar</Text>
        <TextInput
          label="Nome"
          placeholder="Nome"
          name="name"
          control={form.control}
          error={!!form.formState.errors.name}
          helperText={form.formState.errors.name?.message}
        />
        <TextInput
          label="Email"
          placeholder="Email"
          name="email"
          control={form.control}
          error={!!form.formState.errors.email}
          helperText={form.formState.errors.email?.message}
        />
        <TextInput
          label="Data de Nascimento"
          placeholder="Data de Nascimento"
          name="birthDate"
          control={form.control}
          error={!!form.formState.errors.birthDate}
          helperText={form.formState.errors.birthDate?.message}
        />
        <TextInput
          label="Telefone"
          placeholder="Telefone"
          name="phone"
          control={form.control}
          error={!!form.formState.errors.phone}
          helperText={form.formState.errors.phone?.message}
        />
        <TextInput
          label="Senha"
          placeholder="Senha"
          name="password"
          control={form.control}
          secureTextEntry
          error={!!form.formState.errors.password}
          helperText={form.formState.errors.password?.message}
        />
        <TextInput
          label="Confirmação de Senha"
          placeholder="Confirmação de Senha"
          name="confirmPassword"
          control={form.control}
          secureTextEntry
          error={!!form.formState.errors.confirmPassword}
          helperText={form.formState.errors.confirmPassword?.message}
        />
        <Button
          loading={form.formState.isSubmitting}
          size="large"
          style={styles.submitButton}
          onPress={form.handleSubmit(handleRegister)}
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
