import { useThemeColor } from "@/hooks/useThemeColor";
import { ComponentProps } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface ThemedButtonProps extends ComponentProps<typeof Pressable> {
  size?: "small" | "medium" | "large";
  lightColor?: string;
  darkColor?: string;
}

export function Button({
  children,
  lightColor,
  size = "medium",
  darkColor,
  style,
  ...props
}: ThemedButtonProps) {
  const color = useThemeColor(
    {
      light: lightColor,
      dark: darkColor,
    },
    "primary"
  );
  const disabledColor = useThemeColor(
    {
      light: lightColor,
      dark: darkColor,
    },
    "secondary"
  );

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: props.disabled ? disabledColor : color,

          opacity: pressed ? 0.5 : 1,
        },
        styles.button,
        styles[size],
        ...(style ? (Array.isArray(style) ? style : [style]) : ([] as any)),
      ]}
      {...props}
    >
      {typeof children === "string" ? (
        <Text style={styles.text}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  small: {
    padding: 5,
    fontSize: 14,
  },
  medium: {
    padding: 10,
    fontSize: 16,
  },
  large: {
    padding: 15,
    fontSize: 18,
  },
});
