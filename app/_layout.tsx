import { Stack, router } from "expo-router";
import { View, Pressable, Text } from "react-native";

export default function RootLayout() {
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <Stack screenOptions={{ headerShown: false }} />

        </View>
    );
}
