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
          title: "Gerenciar Gestores",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="novo"
        options={{
          title: "Novo Gestor",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
