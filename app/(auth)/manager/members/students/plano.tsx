import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { Pressable, StyleSheet, View, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { doc, updateDoc } from "firebase/firestore";
import { firebaseDb } from "@/firebase.config";

const plans = [
  { name: "Plano Básico", price: "€20" },
  { name: "Plano Atleta", price: "€40" },
  { name: "Plano Premium", price: "€60" },
];

export default function SelectPlanScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // ID do aluno
  const [selected, setSelected] = useState("Plano Premium");

  const handleSelect = (plan: string) => setSelected(plan);

  const handleConfirm = async () => {
    if (!id || typeof id !== "string") {
      Alert.alert("Erro", "ID do aluno não encontrado.");
      return;
    }

    try {
      const ref = doc(firebaseDb, "userRole", id);
      await updateDoc(ref, {
        planName: selected,
      });

      Alert.alert("Plano atualizado com sucesso!");
      router.back(); // retorna para tela anterior

    } catch (err: any) {
      Alert.alert("Erro", err.message || "Não foi possível atualizar o plano.");
    }
  };

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
        onPress={handleConfirm}
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
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: "#f3f4f6",
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
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  planOptionDefault: {
    borderColor: "#e5e7eb",
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
    color: "#6b7280",
    marginTop: 2,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#9ca3af",
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