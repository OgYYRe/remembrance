import { FlatList, Pressable, View, Image, Text } from "react-native";
import { router } from "expo-router";
import {useEffect, useState} from "react";
import { supabase } from "../../lib/supabase";




export default function StoriesList() {
    const [stories, setStories] = useState<any[]>([]);
    useEffect(() => {
        const sub = supabase.auth.onAuthStateChange(() => {
            loadStories();
        });

        const interval = setInterval(loadStories, 2000);

        return () => {
            sub.data.subscription.unsubscribe();
            clearInterval(interval);
        };
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

    async function onLogout() {
        await supabase.auth.signOut();
        router.replace("/");
    }




    return (
        <View style={{flex: 1}}>
            <View style={{ paddingTop: 50, paddingHorizontal: 20, alignItems: "center"
            }}>
                <Text style={{ fontSize: 24, fontWeight: "600" }}>My Stories</Text>
            </View>
            <FlatList
                data={stories}
                numColumns={2}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 12, paddingTop: 8 }}
                columnWrapperStyle={{ gap: 12 }}
                renderItem={({ item, index }) => {
                    const isLastOdd = stories.length % 2 === 1 && index === stories.length - 1;

                    return (
                        <Pressable
                            onPress={() => router.push(`/stories/${item.id}`)}
                            style={{
                                flex: 1,
                                maxWidth: "48%",
                                alignSelf: isLastOdd ? "flex-start" : "auto",
                            }}
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
                                            ? { uri: `${IMAGE_BASE_URL}/${item.image_path}` }
                                            : undefined
                                    }
                                    style={{ width: "100%", aspectRatio: 1 }}
                                    resizeMode="cover"
                                />
                                <View style={{ padding: 8 }}>
                                    <Text style={{ fontWeight: "600" }}>{item.title}</Text>
                                </View>
                            </View>
                        </Pressable>
                    );
                }}
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



            {/* Logout Button */}
            <Pressable
                onPress={onLogout}
                style={{
                    position: "absolute",
                    left: 16,
                    bottom: 75,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: "#cc0000",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text style={{ color: "white", fontSize: 26, lineHeight: 20 }}>← </Text>
                <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>Log out</Text>
            </Pressable>

        </View>
    );
}
