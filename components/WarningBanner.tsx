import { StyleSheet, View } from "react-native";
import { Text } from "./ThemedText";
import Icon from "@expo/vector-icons/AntDesign";

interface WarningBannerProps {
  title: string;
}

export function WarningBanner({ title }: WarningBannerProps) {
  return (
    <View style={stylesWarningBanner.container}>
      <Icon name="warning" size={24} color="#B45309" />
      <Text style={stylesWarningBanner.text}>{title}</Text>
    </View>
  );
}

const stylesWarningBanner = StyleSheet.create({
  container: {
    gap: 10,
    flexDirection: "row",
    backgroundColor: "#FFFBEB",
    borderRadius: 10,
    padding: 10,
  },
  text: {
    color: "#B45309",
  },
});
