import { FlatList, Pressable, View, Image, Text } from "react-native";
import { router } from "expo-router";

const DATA = [
    { id: "1", title: "First Story", image: "https://picsum.photos/200" },
    { id: "2", title: "Second Story", image: "https://picsum.photos/300" },
    { id: "3", title: "Third Story", image: "https://picsum.photos/400" },
];

export default function StoriesList() {
    return (
        <FlatList
            data={DATA}
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 12 }}
            columnWrapperStyle={{ gap: 12 }}
            renderItem={({ item }) => (
                <Pressable
                    style={{ flex: 1 }}
                    onPress={() => router.push(`/stories/${item.id}`)}
                >
                    <View
                        style={{
                            borderRadius: 12,
                            overflow: "hidden",
                            backgroundColor: "#eee",
                        }}
                    >
                        <Image source={{ uri: item.image }} style={{ width: "100%", height: 140 }} />
                        <View style={{ padding: 8 }}>
                            <Text style={{ fontWeight: "600" }}>{item.title}</Text>
                        </View>
                    </View>
                </Pressable>
            )}
        />
    );
}
