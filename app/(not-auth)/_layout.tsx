import { useUser } from "@/context/AuthContext";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const { user, loading } = useUser();
  const router = useRouter();

  useFocusEffect(() => {
    if (user) {
      router.replace("/(auth)/user");
    }
  });

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "white" },
      }}
    />
  );
}
