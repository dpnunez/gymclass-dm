import { useEffect } from "react";
import { useUser } from "@/context/AuthContext";
import { ActivityIndicator, View, } from "react-native";
import { useRouter } from "expo-router";
import { useConfig } from "@/context/ConfigContext";
import { useTheme } from "@/context/ThemeContext";

export default function Index() {
    const router = useRouter();
    const { user, loading, role, redirectToHome } = useUser();
    const { loading: loadingConfig, config } = useConfig();
    const { updatePrimaryColor } = useTheme();

    useEffect(() => {
        if (loading || loadingConfig) return;

        updatePrimaryColor(config.color);

        if (user && role) {
            redirectToHome(role);
        } else {
            router.replace("/(not-auth)/login");
        }
    }, [user, loading, role]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
        </View>
    );
}
