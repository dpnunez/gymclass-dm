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
          title: "Opções de Membros",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="students"
        options={{
          title: "Estudantes",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="teachers"
        options={{
          title: "Professores",
          headerShown: true,
        }}
      />
    
    <Stack.Screen
    name="modalities"
    options={{
      title: "Modalidades",
      headerShown: true,
    }}
  /></Stack>
    
  );
  
}
