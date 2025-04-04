import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View } from "@/components/PageContainer";
import { Colors } from "@/constants/Colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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

  const backgroundColor = Colors.light.background;

  return (
    <ThemeProvider value={DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={{
            sceneStyle: {
              backgroundColor,
            },
            headerTitle: "[DEV] Drawer navigation",
          }}
        >
          <Drawer.Screen name="(auth)/user" options={{ drawerLabel: "User" }} />
          <Drawer.Screen
            name="(auth)/admin/index"
            options={{ drawerLabel: "Admin" }}
          />
          <Drawer.Screen
            name="(auth)/manager/index"
            options={{ drawerLabel: "Manager" }}
          />
          <Drawer.Screen
            name="(not-auth)"
            options={{ drawerLabel: "Auth flow" }}
          />
          <Drawer.Screen
            name="(not-auth)/register/index"
            options={{ drawerLabel: "Register" }}
          />
          <Drawer.Screen
            name="+not-found"
            options={{ drawerLabel: "Not found" }}
          />
        </Drawer>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
