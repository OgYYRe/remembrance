import { useEffect, useState } from "react";
import { View, Text, Image, Pressable, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { supabase } from "../../lib/supabase";

const IMAGE_BASE_URL =
    "https://gmsznaqhtvvqfnuhfcye.supabase.co/storage/v1/object/public/images";

type Story = {
    id: string;
    title: string;
    text: string | null;
    image_path: string | null;
    color: string | null;
    size: string | null;
    location: string | null;
    created_at: string;
};

export default function StoryDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [story, setStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    async function loadStory() {
        if (!id) return;

        setLoading(true);
        const { data, error } = await supabase
            .from("stories")
            .select("id,title,text,image_path,color,size,location,created_at")
            .eq("id", id)
            .single();

        if (error) {
            Alert.alert("Error", error.message);
            setStory(null);
        } else {
            setStory(data as Story);
        }
        setLoading(false);
    }

    useEffect(() => {
        loadStory();
    }, [id]);

    async function onDelete() {
        if (!story) return;

        Alert.alert("Delete", "Do you really want to delete this story?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    setDeleting(true);
                    try {
                        // 0) Debug

                        // 1) Storage delete FIRST
                        if (story.image_path) {
                            const {  error: removeErr } = await supabase.storage
                                .from("images")
                                .remove([story.image_path]);

                            if (removeErr) throw removeErr;
                        }

                        // 2) DB row delete AFTER
                        const { error: delErr } = await supabase.from("stories").delete().eq("id", story.id);
                        if (delErr) throw delErr;

                        Alert.alert("OK", "Story deleted.");
                        router.replace("/stories");
                    } catch (e: any) {
                        Alert.alert("Error", e?.message ?? "Delete failed.");
                    } finally {
                        setDeleting(false);
                    }
                },
            },
        ]);
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator />
            </View>
        );
    }

    if (!story) {
        return (
            <View style={{ flex: 1, padding: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: "600" }}>Story not found</Text>
                <Pressable onPress={() => router.replace("/stories")} style={{ marginTop: 12 }}>
                    <Text style={{ color: "#233fbf" }}>Back to list</Text>
                </Pressable>
            </View>
        );
    }

    const imageUri = story.image_path ? `${IMAGE_BASE_URL}/${story.image_path}` : null;

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            {imageUri ? (
                <Image
                    source={{ uri: imageUri }}
                    style={{ width: "100%", aspectRatio: 1, borderRadius: 12, backgroundColor: "#eee" }}
                    resizeMode="cover"
                />
            ) : (
                <View
                    style={{
                        width: "100%",
                        aspectRatio: 1,
                        borderRadius: 12,
                        backgroundColor: "#eee",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text>No image</Text>
                </View>
            )}

            <Text style={{ fontSize: 24, fontWeight: "700", marginTop: 14 }}>{story.title}</Text>

            {story.text ? (
                <Text style={{ fontSize: 16, marginTop: 10, lineHeight: 22 }}>{story.text}</Text>
            ) : null}

            <View style={{ marginTop: 14, gap: 6 }}>
                {story.color ? <Text style={{ color: "#555" }}>Color: {story.color}</Text> : null}
                {story.size ? <Text style={{ color: "#555" }}>Size: {story.size}</Text> : null}
                {story.location ? <Text style={{ color: "#555" }}>Location: {story.location}</Text> : null}
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 18 }}>
                <Pressable
                    onPress={() => router.back()}
                    style={{
                        flex: 1,
                        backgroundColor: "#eee",
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: "center",
                    }}
                    disabled={deleting}
                >
                    <Text style={{ fontWeight: "600" }}>Back</Text>
                </Pressable>

                <Pressable
                    onPress={() => router.push(`/stories/edit/${story.id}`)}
                    style={{
                        flex: 1,
                        backgroundColor: "#233fbf",
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: "center",
                    }}
                    disabled={deleting}
                >
                    <Text style={{ fontWeight: "600", color: "white" }}>Edit</Text>
                </Pressable>

                <Pressable
                    onPress={onDelete}
                    style={{
                        flex: 1,
                        backgroundColor: "#c62828",
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: "center",
                        opacity: deleting ? 0.7 : 1,
                    }}
                    disabled={deleting}
                >
                    <Text style={{ fontWeight: "600", color: "white" }}>
                        {deleting ? "Deleting..." : "Delete"}
                    </Text>
                </Pressable>
            </View>

        </ScrollView>
    );
}
