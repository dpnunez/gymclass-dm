import { Tabs } from "expo-router";
import Icon from "@expo/vector-icons/AntDesign";

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
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={24} color={color} />
          ),
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
