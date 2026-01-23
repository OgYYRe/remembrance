import React, {useEffect, useMemo, useRef, useState} from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    Image,
    StyleSheet,
    Alert,
    Keyboard,
    TouchableWithoutFeedback,
    ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { Buffer } from "buffer";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";


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
    user_id?: string;
};

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    // Funktioniert sowohl in Umgebungen mit atob als auch ohne.
    if (typeof atob === "function") {
        const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        return bytes.buffer;
    }
    const buf = Buffer.from(base64, "base64");
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

export default function EditStoryScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [story, setStory] = useState<Story | null>(null);

    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [location, setLocation] = useState("");

    const [showColor, setShowColor] = useState(false);
    const [showSize, setShowSize] = useState(false);
    const [showLocation, setShowLocation] = useState(false);

    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [photoBase64, setPhotoBase64] = useState<string | null>(null);

    const currentImageUri = useMemo(() => {
        if (photoUri) return photoUri;
        if (story?.image_path) return `${IMAGE_BASE_URL}/${story.image_path}`;
        return null;
    }, [photoUri, story?.image_path]);

    const scrollRef = useRef<KeyboardAwareScrollView>(null);

    const titleRef = useRef<TextInput>(null);
    const colorRef = useRef<TextInput>(null);
    const sizeRef = useRef<TextInput>(null);
    const locationRef = useRef<TextInput>(null);
    const storyRef = useRef<TextInput>(null);

    function scrollToInput(inputRef: React.RefObject<TextInput>) {
        inputRef.current?.measure((x, y, w, h, px, py) => {
            scrollRef.current?.scrollToPosition?.(0, Math.max(0, py - 120), true);
        });
    }



    async function loadStory() {
        if (!id) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("stories")
                .select("id,title,text,image_path,color,size,location,created_at,user_id")
                .eq("id", id)
                .single();

            if (error) throw error;

            const s = data as Story;
            setStory(s);

            setTitle(s.title ?? "");
            setText(s.text ?? "");

            setColor(s.color ?? "");
            setSize(s.size ?? "");
            setLocation(s.location ?? "");

            setShowColor(!!s.color);
            setShowSize(!!s.size);
            setShowLocation(!!s.location);

            setPhotoUri(null);
            setPhotoBase64(null);
        } catch (e: any) {
            Alert.alert("Error", e?.message ?? "Story could not be loaded.");
            router.replace("/stories");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadStory();
    }, [id]);

    async function takePhoto() {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Error", "Camera permission is required to take a photo.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            quality: 0.8,
            allowsEditing: true,
            aspect: [1, 1],
            base64: true,
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
            setPhotoBase64(result.assets[0].base64 ?? null);
        }
    }

    async function onSave() {
        const cleanTitle = title.trim();
        if (!story?.id) return;

        if (cleanTitle.length === 0) {
            Alert.alert("Error", "Please enter a title. It is required.");
            return;
        }

        setSaving(true);
        try {
            const { data: userRes, error: userErr } = await supabase.auth.getUser();
            if (userErr) throw userErr;

            const user = userRes.user;
            if (!user) {
                Alert.alert("Error", "You must be logged in.");
                router.replace("/");
                return;
            }

            const userId = user.id;

            // 1) Update DB fields
            const { error: updErr } = await supabase
                .from("stories")
                .update({
                    title: cleanTitle,
                    text: text.trim().length > 0 ? text.trim() : null,
                    color: color.trim().length > 0 ? color.trim() : null,
                    size: size.trim().length > 0 ? size.trim() : null,
                    location: location.trim().length > 0 ? location.trim() : null,
                })
                .eq("id", story.id);

            if (updErr) throw updErr;

            // 2) Wenn der Benutzer ein neues Foto aufgenommen hat, lade es hoch + aktualisieren image_path.
            if (photoBase64) {
                const imagePath = `${userId}/${story.id}.jpg`;
                const arrayBuffer = base64ToArrayBuffer(photoBase64);

                const { error: uploadErr } = await supabase.storage
                    .from("images")
                    .upload(imagePath, arrayBuffer, {
                        contentType: "image/jpeg",
                        upsert: true,
                    });

                if (uploadErr) throw uploadErr;

                const { error: pathErr } = await supabase
                    .from("stories")
                    .update({ image_path: imagePath })
                    .eq("id", story.id);

                if (pathErr) throw pathErr;
            }

            Alert.alert("OK", "Story updated.");
            router.replace(`/stories/${story.id}`);
        } catch (e: any) {
            Alert.alert("Error", e?.message ?? "Save failed.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    if (!story) {
        return (
            <View style={styles.container}>
                <Text style={styles.h1}>Story not found</Text>
                <Pressable onPress={() => router.replace("/stories")} style={{ marginTop: 12 }}>
                    <Text style={{ color: "#233fbf" }}>Back to list</Text>
                </Pressable>
            </View>
        );
    }

    return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAwareScrollView
                    ref={scrollRef}
                    contentContainerStyle={styles.container}
                    enableOnAndroid
                    extraScrollHeight={120}
                    keyboardShouldPersistTaps="handled"
                >
                <Text style={styles.h1}>Edit Story</Text>

                <Pressable onPress={takePhoto} style={styles.imageBox} disabled={saving}>
                    {currentImageUri ? (
                        <Image
                            source={{ uri: currentImageUri }}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                        />
                    ) : (
                        <>
                            <Text style={styles.imageIcon}>📷</Text>
                            <Text style={styles.imageText}>Take a photo</Text>
                        </>
                    )}
                </Pressable>

                <Text style={styles.label}>Title*</Text>
                    <TextInput
                        ref={titleRef}
                        onFocus={() => scrollToInput(titleRef)}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="for exp: Tree"
                        style={styles.input}
                        autoCapitalize="none"
                        maxLength={80}
                        editable={!saving}
                    />


                    <View style={{ marginTop: 12 }}>
                    <Text style={{ fontWeight: "600" }}>Details</Text>

                    <View style={{ flexDirection: "row", gap: 12, marginTop: 6 }}>
                        {!showColor && (
                            <Pressable onPress={() => setShowColor(true)} disabled={saving}>
                                <Text style={{ color: "#555" }}>+ Color</Text>
                            </Pressable>
                        )}
                        {!showSize && (
                            <Pressable onPress={() => setShowSize(true)} disabled={saving}>
                                <Text style={{ color: "#555" }}>+ Size</Text>
                            </Pressable>
                        )}
                        {!showLocation && (
                            <Pressable onPress={() => setShowLocation(true)} disabled={saving}>
                                <Text style={{ color: "#555" }}>+ Location</Text>
                            </Pressable>
                        )}
                    </View>
                </View>

                {showColor && (
                    <>
                        <View style={styles.detailHeader}>
                            <Text style={styles.label}>Color</Text>
                            <Pressable onPress={() => setShowColor(false)} disabled={saving}>
                                <Text style={{ color: "#555", fontSize: 18 }}>-</Text>
                            </Pressable>
                        </View>
                        <TextInput
                            ref={colorRef}
                            onFocus={() => scrollToInput(colorRef)}
                            value={color}
                            onChangeText={setColor}
                            style={styles.input}
                            placeholder="White"
                            editable={!saving}
                        />

                    </>
                )}

                {showSize && (
                    <>
                        <View style={styles.detailHeader}>
                            <Text style={styles.label}>Size</Text>
                            <Pressable onPress={() => setShowSize(false)} disabled={saving}>
                                <Text style={{ color: "#555", fontSize: 18 }}>-</Text>
                            </Pressable>
                        </View>
                        <TextInput
                            ref={sizeRef}
                            onFocus={() => scrollToInput(sizeRef)}
                            value={size}
                            onChangeText={setSize}
                            style={styles.input}
                            placeholder="2 meter"
                            editable={!saving}
                        />

                    </>
                )}

                {showLocation && (
                    <>
                        <View style={styles.detailHeader}>
                            <Text style={styles.label}>Location</Text>
                            <Pressable onPress={() => setShowLocation(false)} disabled={saving}>
                                <Text style={{ color: "#555", fontSize: 18 }}>-</Text>
                            </Pressable>
                        </View>
                        <TextInput
                            ref={locationRef}
                            onFocus={() => scrollToInput(locationRef)}
                            value={location}
                            onChangeText={setLocation}
                            style={styles.input}
                            placeholder="Zurich"
                            editable={!saving}
                        />

                    </>
                )}

                <Text style={styles.label}>Story</Text>
                    <TextInput
                        ref={storyRef}
                        onFocus={() => scrollToInput(storyRef)}
                        value={text}
                        onChangeText={setText}
                        placeholder="Tell me your story..."
                        style={[styles.input, styles.textArea]}
                        multiline
                        textAlignVertical="top"
                        maxLength={2000}
                        editable={!saving}
                    />


                    <View style={styles.row}>
                    <Pressable
                        style={[styles.btn, styles.btnCancel]}
                        onPress={() => router.back()}
                        disabled={saving}
                    >
                        <Text style={styles.btnText}>Cancel</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.btn, styles.btnSave, saving && styles.btnDisabled]}
                        onPress={onSave}
                        disabled={saving}
                    >
                        {saving ? <ActivityIndicator /> : <Text style={styles.btnTextWhite}>Save</Text>}
                    </Pressable>
                </View>
                </KeyboardAwareScrollView>
            </TouchableWithoutFeedback>

    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 16, backgroundColor: "white" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    h1: { fontSize: 24, fontWeight: "600", marginBottom: 16 },
    label: { fontSize: 14, marginTop: 12, marginBottom: 6 },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },
    textArea: { minHeight: 140 },
    row: { flexDirection: "row", gap: 12, marginTop: 18 },
    btn: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    btnSave: { backgroundColor: "#233fbf" },
    btnCancel: { backgroundColor: "#eee" },
    btnDisabled: { opacity: 0.7 },
    btnText: { color: "#000", fontSize: 16, fontWeight: "600" },
    btnTextWhite: { color: "white", fontSize: 16, fontWeight: "600" },

    imageBox: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 12,
        backgroundColor: "#e0e0e0",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    imageIcon: { fontSize: 64 },
    imageText: { marginTop: 8, fontSize: 16, fontWeight: "500" },

    detailHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
});
