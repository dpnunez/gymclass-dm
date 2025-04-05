import { Stack } from "expo-router";

export default function UserLayout() {
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
          title: "Perfil",
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="edit/index"
        options={{
          title: "Editar Perfil",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="subscription/index"
        options={{
          title: "Inscrição",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
