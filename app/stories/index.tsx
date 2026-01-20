import { FlatList, Pressable, View, Image, Text } from "react-native";
import { router } from "expo-router";
import {useEffect, useState} from "react";
import { supabase } from "../../lib/supabase";




export default function StoriesList() {
    const [stories, setStories] = useState<any[]>([]);
    useEffect(() => {
        loadStories();
    }, []);

    async function loadStories() {
        const { data, error } = await supabase
            .from("stories")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setStories(data);
        }
    }

    return (
        <FlatList
            data={stories}
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
