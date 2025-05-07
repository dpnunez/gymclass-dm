import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { ColorValue } from "react-native";
import { UserProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function StackNavigator({
  backgroundColor,
}: {
  backgroundColor: ColorValue | undefined;
}) {
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor,
        },
        headerTitle: "[DEV] Stack navigation",
      }}
    >
      <Stack.Screen name="(auth)/user" options={{ title: "User" }} />
      <Stack.Screen name="(auth)/admin" options={{ title: "Admin" }} />
      <Stack.Screen name="(auth)/manager" options={{ title: "Manager" }} />
      <Stack.Screen name="(not-auth)" options={{ title: "Auth flow" }} />
      <Stack.Screen name="+not-found" options={{ title: "Not found" }} />
    </Stack>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const backgroundColor = theme.colors.background;

  return (
    <NavigationThemeProvider value={theme}>
      <PaperProvider>
        <UserProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StackNavigator backgroundColor={backgroundColor} />
            <StatusBar style="auto" />
          </GestureHandlerRootView>
        </UserProvider>
      </PaperProvider>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
