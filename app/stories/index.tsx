import { FlatList, Pressable, View, Image, Text } from "react-native";
import { router } from "expo-router";
import {useEffect, useState} from "react";
import { supabase } from "../../lib/supabase";




export default function StoriesList() {
    const [stories, setStories] = useState<any[]>([]);
    useEffect(() => {
        loadStories();
    }, []);

    const IMAGE_BASE_URL = "https://gmsznaqhtvvqfnuhfcye.supabase.co/storage/v1/object/public/images";

    async function loadStories() {
        const {data, error} = await supabase
            .from("stories")
            .select("*")
            .order("created_at", {ascending: false});

        if (!error && data) {
            setStories(data);
        }
    }

    return (
        <View style={{flex: 1}}>
            <FlatList
                data={stories}
                numColumns={2}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{padding: 12}}
                columnWrapperStyle={{gap: 12}}
                renderItem={({item}) => (
                    <Pressable
                        style={{flex: 1}}
                        onPress={() => router.push(`/stories/${item.id}`)}
                    >
                        <View
                            style={{
                                borderRadius: 12,
                                overflow: "hidden",
                                backgroundColor: "#eee",
                            }}
                        >
                            <Image
                                source={
                                    item.image_path
                                        ? {uri: `${IMAGE_BASE_URL}/${item.image_path}`}
                                        : undefined
                                }
                                style={{width: "100%", aspectRatio: 1}}
                                resizeMode="cover"
                            />
                            <View style={{padding: 8}}>
                                <Text style={{fontWeight: "600"}}>{item.title}</Text>
                            </View>
                        </View>
                    </Pressable>
                )}
            />

            {/* Add Button */}
            <Pressable
                onPress={() => router.push("/stories/add")}
                style={{
                    position: "absolute",
                    right: 16,
                    bottom: 75,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: "#106801",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text style={{ color: "white", fontSize: 26, lineHeight: 20 }}>+</Text>
                <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>NEW</Text>
            </Pressable>
        </View>
    );
}
