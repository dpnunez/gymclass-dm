import {
  StyleSheet,
  TextInputProps,
  TextInput as TextInputBase,
  View,
} from "react-native";
import { Text } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ThemedTextInputProps extends TextInputProps {
  label?: string;
  size?: "small" | "medium" | "large";
  error?: boolean;
  helperText?: string;
}

export function TextInput({
  label,
  size = "medium",
  error = false,
  helperText,
  ...props
}: ThemedTextInputProps) {
  const placeholderTextColor = "#6B7280";
  const errorColor = useThemeColor({}, "error");

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInputBase
        placeholderTextColor={placeholderTextColor}
        {...props}
        style={[
          styles.input,
          styles[size],
          error && { borderColor: errorColor },
        ]}
      />
      {helperText && (
        <Text style={[styles.helperText, error && { color: errorColor }]}>
          {helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
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
  helperText: {
    fontSize: 12,
    color: "#6B7280",
  },
});
