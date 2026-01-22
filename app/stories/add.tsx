import React, { useState } from "react";
import {
    View, Text, TextInput, Pressable, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function AddStoryScreen() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const [showColor, setShowColor] = useState(false);
    const [showSize, setShowSize] = useState(false);
    const [showLocation, setShowLocation] = useState(false);



    const onSave = async () => {
        const cleanTitle = title.trim();

        if (cleanTitle.length === 0) {
            Alert.alert("Error", "Title darf nicht leer sein.");
            return;
        }

        setLoading(true);
        try {
            const { data: userRes, error: userErr } = await supabase.auth.getUser();
            if (userErr) throw userErr;

            if (!userRes.user) {
                Alert.alert("Error", "Bitte erneut einloggen.");
                router.replace("/");
                return;
            }

            const { error } = await supabase.from("stories").insert({
                title: cleanTitle,
                text: text.trim().length > 0 ? text.trim() : null,
                // user_id default auth.uid() -> Supabase tarafinda set
                // image_path sonra eklenecek
            });

            if (error) throw error;

            router.replace("/stories");
        } catch (e: any) {
            Alert.alert("Error", e?.message ?? "Speichern fehlgeschlagen.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Text style={styles.h1}>Add Story</Text>

                <View style={styles.imageBox}>
                    <Text style={styles.imageIcon}>📷</Text>
                    <Text style={styles.imageText}>Take a photo</Text>
                </View>

                <Text style={styles.label}>Title*</Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="z.B. Tree"
                    style={styles.input}
                    autoCapitalize="none"
                    maxLength={80}
                />

                {/* Add details */}
                <View style={{ marginTop: 12 }}>
                    <Text style={{ fontWeight: "600" }}>Add details</Text>

                    <View style={{ flexDirection: "row", gap: 12, marginTop: 6 }}>
                        {!showColor && (
                            <Pressable onPress={() => setShowColor(true)}>
                                <Text style={{ color: "#555" }}>+ Color</Text>
                            </Pressable>
                        )}

                        {!showSize && (
                            <Pressable onPress={() => setShowSize(true)}>
                                <Text style={{ color: "#555" }}>+ Size</Text>
                            </Pressable>
                        )}

                        {!showLocation && (
                            <Pressable onPress={() => setShowLocation(true)}>
                                <Text style={{ color: "#555" }}>+ Location</Text>
                            </Pressable>
                        )}
                    </View>
                </View>

                {/* Color */}
                {showColor && (
                    <>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <Text style={styles.label}>Color</Text>
                            <Pressable onPress={() => setShowColor(false)}>
                                <Text style={{ color: "#555", fontSize: 18 }}>−</Text>
                            </Pressable>
                        </View>
                        <TextInput style={styles.input} placeholder="White" />
                    </>
                )}

                {/* Size */}
                {showSize && (
                    <>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <Text style={styles.label}>Size</Text>
                            <Pressable onPress={() => setShowSize(false)}>
                                <Text style={{ color: "#555", fontSize: 18 }}>−</Text>
                            </Pressable>
                        </View>
                        <TextInput style={styles.input} placeholder="2 meter" />
                    </>
                )}

                {/* Location */}
                {showLocation && (
                    <>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <Text style={styles.label}>Location</Text>
                            <Pressable onPress={() => setShowLocation(false)}>
                                <Text style={{ color: "#555", fontSize: 18 }}>−</Text>
                            </Pressable>
                        </View>
                        <TextInput style={styles.input} placeholder="Zurich" />
                    </>
                )}

                <Text style={styles.label}>Text</Text>
                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder="Kurzer Text..."
                    style={[styles.input, styles.textArea]}
                    multiline
                    textAlignVertical="top"
                    maxLength={2000}
                />

                <View style={styles.row}>
                    <Pressable
                        style={[styles.btn, styles.btnCancel]}
                        onPress={() => router.back()}
                        disabled={loading}
                    >
                        <Text style={styles.btnText}>Cancel</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.btn, styles.btnSave, loading && styles.btnDisabled]}
                        onPress={onSave}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator /> : <Text style={styles.btnText}>Save</Text>}
                    </Pressable>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );

}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "white" },
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

    imageBox: {
        height: 200,
        borderRadius: 12,
        backgroundColor: "#e0e0e0",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    imageIcon: {
        fontSize: 64,
    },
    imageText: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: "500",
    },

});
