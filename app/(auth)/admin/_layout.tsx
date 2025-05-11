import { Tabs } from "expo-router";
import Icon from "@expo/vector-icons/AntDesign";
import { Text } from "@/components/ThemedText";
import { Pressable } from "react-native";
import { useUser } from "@/context/AuthContext";

export default function AdminLayout() {
  const { logout } = useUser();

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
      <Tabs.Screen
        name="logout"
        options={{
          title: "Sair",
          tabBarIcon: ({ color }) => (
            <Icon name="logout" size={24} color={color} />
          ),
          tabBarButton: ({ onPress, accessibilityState }) => {
            const color = accessibilityState?.selected ? "#007AFF" : "#8e8e93";

            return (
              <Pressable
                onPress={() => logout()}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 13,
                }}
              >
                <Icon name="logout" size={20} color={color} />
                <Text style={{ fontSize: 10, color }}>Sair</Text>
              </Pressable>
            );
          },
        }}
      />
    </Tabs>
  );
}