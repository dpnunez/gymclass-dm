import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerBackButtonMenuEnabled: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Listagem de alunos",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Perfil do aluno",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="plano"
        options={{
          title: "Planos do aluno",
          headerShown: true,
        }}
      />
      </Stack>
    
  );
  
}
