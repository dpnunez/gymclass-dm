import { StyleSheet, Pressable, View } from "react-native";
import { Href, useRouter } from "expo-router";
import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";

export default function MembersIndexScreen() {
  const router = useRouter();

  const menuItems = [
    { title: "Alunos", path: "/(auth)/manager/members/students" },
    { title: "Professores", path: "/(auth)/manager/members/teachers" },
    { title: "Modalidades", path: "/(auth)/manager/members/modalities" },
  ];

  return (
    <PageContainer as={View} style={styles.container}>
      <View style={styles.divider} />

      {menuItems.map((item) => (
        <Pressable
          key={item.title}
          onPress={() => router.push(item.path as Href)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {item.title}
          </Text>
        </Pressable>
      ))}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6", // bg-gray-100
    paddingHorizontal: 24, // px-6
  },
  divider: {
    height: 1,
    backgroundColor: "#d1d5db", // bg-gray-300
    width: "100%",
    marginBottom: 32, // mb-8
  },
  button: {
    backgroundColor: "#2563eb", // bg-blue-600
    paddingVertical: 12, // py-3
    paddingHorizontal: 24, // px-6
    width: "100%",
    borderRadius: 8, // rounded-lg
    marginBottom: 16, // mb-4
  },
  buttonText: {
    color: "#ffffff", // text-white
    textAlign: "center",
    fontWeight: "600", // font-semibold
    fontSize: 16, // text-base
  },
});
