import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { Image, StyleSheet, View } from "react-native";
import { FlatList, Pressable } from "react-native-gesture-handler";
import Icon from "@expo/vector-icons/AntDesign";
import { ComponentProps } from "react";
import { useUser } from "@/context/AuthContext";

const MOCK_USER = {
  name: "Ayrton Senna da Silva",
  email: "ayrton.senna@gmail.com",
};

export default function ManagerProfile() {
  const { logout } = useUser();

  const actions = [
    {
      title: "Desconectar",
      icon: {
        name: "logout",
        color: "#FF5733",
        backgroundColor: "#f4c1c1",
      },
      onPress: logout,
    },
  ] as const;

  return (
    <PageContainer as={View}>
      <Image
        source={{
          uri: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Ayrton_Senna_Pesawat_RC_Cropped.jpg",
          width: 156,
          height: 156,
        }}
        style={styles.userAvatar}
      />
      <Text style={styles.userInfo} type="subtitle">
        {MOCK_USER.name}
      </Text>
      <Text style={styles.userInfo}>{MOCK_USER.email}</Text>

      <FlatList
        data={actions}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <UserAction
            title={item.title}
            icon={item.icon}
            onPress={item.onPress}
          />
        )}
        contentContainerStyle={{
          marginVertical: 50,
        }}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: "#ccc" }} />
        )}
      />
    </PageContainer>
  );
}

interface UserActionProps {
  title: string;
  icon: {
    name: ComponentProps<typeof Icon>["name"];
    color: string;
    backgroundColor: string;
  };
  onPress: () => void;
}

function UserAction({ title, icon, onPress }: UserActionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: icon.backgroundColor,
            borderRadius: 100,
            padding: 12,
            marginRight: 16,
          }}
        >
          <Icon name={icon.name} color={icon.color} size={24} />
        </View>
        <Text type="defaultSemiBold">{title}</Text>
      </View>
      <Icon
        name="right"
        size={16}
        color="#000"
        style={{ position: "absolute", right: 16 }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  userAvatar: {
    marginHorizontal: "auto",
    marginVertical: 20,
    borderRadius: 100,
  },
  userInfo: {
    textAlign: "center",
  },
});
