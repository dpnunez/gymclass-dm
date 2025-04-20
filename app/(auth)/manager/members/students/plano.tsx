import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const plans = [
  { name: "Plano Básico", price: "€20" },
  { name: "Plano Atleta", price: "€40" },
  { name: "Plano Premium", price: "€60" },
];

export default function SelectPlanScreen() {
  const [selected, setSelected] = useState("Plano Premium");
  const router = useRouter();

  const handleSelect = (plan: string) => setSelected(plan);

  return (
    <PageContainer as={View} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Selecionar Plano</Text>
          <Pressable onPress={() => router.back()}>
            <AntDesign name="close" size={20} color="#444" />
          </Pressable>
        </View>

        {plans.map((plan) => {
          const isSelected = selected === plan.name;
          return (
            <Pressable
              key={plan.name}
              onPress={() => handleSelect(plan.name)}
              style={[
                styles.planOption,
                isSelected ? styles.planOptionSelected : styles.planOptionDefault,
              ]}
            >
              <View style={styles.planRow}>
                <View>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPrice}>{plan.price} /mês</Text>
                </View>
                {isSelected ? (
                  <View style={styles.radioSelected}>
                    <AntDesign name="check" size={14} color="#fff" />
                  </View>
                ) : (
                  <View style={styles.radioUnselected} />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={() => {
          console.log("Plano selecionado:", selected);
        }}
        style={styles.confirmButton}
      >
        <Text style={styles.confirmText}>Confirmar Plano</Text>
      </Pressable>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24, // px-6
    paddingTop: 24, // pt-6
    backgroundColor: "#f3f4f6", // bg-gray-100
    justifyContent: "space-between",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  planOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  planOptionSelected: {
    borderColor: "#2563eb", // blue-600
    backgroundColor: "#eff6ff", // blue-50
  },
  planOptionDefault: {
    borderColor: "#e5e7eb", // gray-200
    backgroundColor: "#fff",
  },
  planRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planName: {
    fontWeight: "600",
  },
  planPrice: {
    fontSize: 14,
    color: "#6b7280", // gray-500
    marginTop: 2,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2563eb", // blue-600
    alignItems: "center",
    justifyContent: "center",
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#9ca3af", // gray-400
  },
  confirmButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
});
