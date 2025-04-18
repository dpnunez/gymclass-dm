import { Pressable } from "react-native-gesture-handler";
import { Text } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet } from "react-native";

interface DateButtonProps {
  monthDay: number;
  weekDay: string;
  active?: boolean;
}

export function DateDayButton({ monthDay, weekDay, active = false }: DateButtonProps) {
  const notActiveBg = useThemeColor({}, "secondary");
  const activeBg = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");
  const backgroundColor = active ? activeBg : notActiveBg;

  return (
    <Pressable
      style={[
        {
          backgroundColor,
        },
        dateButtonStyles.dateButton,
      ]}
    >
      <Text
        style={[
          dateButtonStyles.weekDay,
          { color: active ? "#fff" : textColor },
        ]}
      >
        {weekDay}
      </Text>
      <Text
        style={[
          dateButtonStyles.monthDay,
          {
            color: active ? "#fff" : textColor,
          },
        ]}
      >
        {monthDay}
      </Text>
    </Pressable>
  );
}

const dateButtonStyles = StyleSheet.create({
  dateButton: {
    borderRadius: 10,
    padding: 10,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  monthDay: {
    fontSize: 20,
    fontWeight: "bold",
  },
  weekDay: {
    opacity: 0.8,
    fontSize: 16,
    fontWeight: "bold",
  },
});
