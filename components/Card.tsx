import { ComponentProps } from "react";
import { View } from "react-native";

export function Card({ style, ...props }: ComponentProps<typeof View>) {
  return <View {...props} style={[styles.card, style]} />;
}

const styles = {
  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
};
