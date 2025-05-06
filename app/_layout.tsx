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
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { ColorValue } from "react-native";
import { UserProvider } from "@/context/AuthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function DrawerNavigator({
  backgroundColor,
}: {
  backgroundColor: ColorValue | undefined;
}) {
  return (
    <Drawer
      screenOptions={{
        sceneStyle: {
          backgroundColor,
        },
        headerTitle: "[DEV] Drawer navigation",
      }}
    >
      <Drawer.Screen name="(auth)/user" options={{ drawerLabel: "User" }} />
      <Drawer.Screen name="(auth)/admin" options={{ drawerLabel: "Admin" }} />
      <Drawer.Screen
        name="(auth)/manager"
        options={{ drawerLabel: "Manager" }}
      />
      <Drawer.Screen name="(not-auth)" options={{ drawerLabel: "Auth flow" }} />
      <Drawer.Screen name="+not-found" options={{ drawerLabel: "Not found" }} />
    </Drawer>
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
            <DrawerNavigator backgroundColor={backgroundColor} />
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
