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
          title: "Suas Aulas",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="[classId]/index"
        options={{
          title: "Detalhes da Aula",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
