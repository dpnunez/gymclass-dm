import { Tabs } from "expo-router";

export default function UserLayout() {
  return (
    <Tabs
      screenOptions={{
        animation: "shift",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Perfil",
          headerShown: true,
        }}
      />
    </Tabs>
  );
}
