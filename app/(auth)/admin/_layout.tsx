import { Tabs } from "expo-router";
import Icon from "@expo/vector-icons/AntDesign";

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        animation: "shift",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="team" size={24} color={color} />
          ),
          title: "Gerenciar Atletas",
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="gestores"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="user" size={24} color={color} />
          ),
          title: "Gestores"
        }}
      />
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: "Configurações",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <Icon name="setting" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
