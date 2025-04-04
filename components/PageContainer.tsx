import { useThemeColor } from "@/hooks/useThemeColor";
import { ComponentProps } from "react";
import { ScrollView } from "react-native-gesture-handler";

export type ThemedViewProps = ComponentProps<typeof ScrollView> & {
  lightColor?: string;
  darkColor?: string;
};

export function PageContainer({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <ScrollView
      style={[{ backgroundColor, padding: 12 }, style]}
      {...otherProps}
    />
  );
}
