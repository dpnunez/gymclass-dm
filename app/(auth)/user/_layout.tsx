import { Tabs } from "expo-router";
import Icon from "@expo/vector-icons/AntDesign";

export default function UserLayout() {
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
            <Icon name="home" size={24} color={color} />
          ),
          title: "Início",
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="classes"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="book" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="contact"
        options={{
          title: "Contato",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <Icon name="phone" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Icon name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
