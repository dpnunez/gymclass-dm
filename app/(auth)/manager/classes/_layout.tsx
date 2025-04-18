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
          title: "Listagem de Aulas",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="novo"
        options={{
          title: "Nova Aula",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="[classId]/index"
        options={{
          title: "Editar Aula",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
