import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { Text } from "@/components/ThemedText";
import { PageContainer } from "@/components/PageContainer";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <PageContainer contentContainerStyle={styles.container}>
        <Text type="title">This screen doesn't exist.</Text>
        <Link href="/(not-auth)/login" style={styles.link}>
          <Text type="link">Go to home screen!</Text>
        </Link>
      </PageContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
