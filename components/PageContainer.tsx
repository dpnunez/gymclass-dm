import { useThemeColor } from "@/hooks/useThemeColor";
import { ComponentProps } from "react";
import { ScrollView } from "react-native-gesture-handler";

export type ThemedViewProps = ComponentProps<typeof ScrollView> & {
  lightColor?: string;
  darkColor?: string;
  as?: React.ElementType;
};

export function PageContainer({
  style,
  lightColor,
  darkColor,
  as: Component = ScrollView,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <Component
      style={[{ backgroundColor, padding: 12, flex: 1 }, style]}
      {...otherProps}
    />
  );
}
