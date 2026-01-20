import { Stack, router } from "expo-router";
import { View, Pressable, Text } from "react-native";

export default function RootLayout() {
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <Stack screenOptions={{ headerShown: false }} />

            {/* Bottom Home Button */}
            <View
                style={{
                    position: "absolute",
                    bottom: 24,
                    left: 0,
                    right: 0,
                    alignItems: "center",
                }}
            >
                <Pressable
                    onPress={() => router.replace("/stories")}
                    style={{
                        backgroundColor: "#000",
                        paddingHorizontal: 24,
                        paddingVertical: 12,
                        borderRadius: 24,
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>Home</Text>
                </Pressable>
            </View>
        </View>
    );
}
