import { Pressable, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/AntDesign";

export function FilterButton() {
  return (
    <Pressable
      style={[
        {
          backgroundColor: "#F3F4F6",
        },
        filterButtonStyles.filterButton,
      ]}
    >
      <Icon name="filter" size={24} color="#000" />
    </Pressable>
  );
}

const filterButtonStyles = StyleSheet.create({
  filterButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 10,
  },
});
