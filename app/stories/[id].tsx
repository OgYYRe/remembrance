import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function StoryDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Story ID: {id}</Text>
        </View>
    );
}
