import { View } from "react-native";
import { Text } from "./ThemedText";

interface BadgeProps {
  text: string;
  color: string;
  backgroundColor: string;
}

export const Badge = ({ text, color, backgroundColor }: BadgeProps) => {
  return (
    <View
      style={{
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text lightColor={color}>{text}</Text>
    </View>
  );
};
