import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { Image, StyleSheet, View } from "react-native";
import { FlatList, Pressable } from "react-native-gesture-handler";
import Icon from "@expo/vector-icons/AntDesign";
import { ComponentProps } from "react";
import { useUser } from "@/context/AuthContext";

export default function ManagerProfile() {
  const { logout, userProfile } = useUser();

  // ======= DADOS REAIS DO USUÁRIO (sem MOCK) =======
  const displayName = userProfile?.displayName || "Gestor";
  const email = userProfile?.mail || "sem-email@exemplo.com";
  const avatar = userProfile?.profilePicture || "https://i.pravatar.cc/300";

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
      {/* ======= AVATAR DO USUÁRIO ======= */}
      <Image
        source={{ uri: avatar, width: 156, height: 156 }}
        style={styles.userAvatar}
      />

      {/* ======= NOME E EMAIL ======= */}
      <Text style={styles.userInfo} type="subtitle">{displayName}</Text>
      <Text style={styles.userInfo}>{email}</Text>

      {/* ======= AÇÕES DISPONÍVEIS ======= */}
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