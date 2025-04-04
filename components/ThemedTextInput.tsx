import {
  StyleSheet,
  TextInputProps,
  TextInput as TextInputBase,
  View,
} from "react-native";
import { Text } from "./ThemedText";

interface ThemedTextInputProps extends TextInputProps {
  label?: string;
  size?: "small" | "medium" | "large";
}

export function TextInput({
  label,
  size = "medium",
  ...props
}: ThemedTextInputProps) {
  const placeholderTextColor = "#6B7280";

  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <TextInputBase
        placeholderTextColor={placeholderTextColor}
        {...props}
        style={[styles.input, styles[size]]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  small: {
    padding: 5,
  },
  medium: {
    padding: 10,
  },
  large: {
    padding: 16,
  },
});
