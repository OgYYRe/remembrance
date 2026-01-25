import React, {useRef, useState} from "react";
import {
    View, Text, TextInput, Pressable,Image, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

import * as ImagePicker from "expo-image-picker";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";







export default function AddStoryScreen() {
    const router = useRouter();

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

    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    // Detail fields visibility
    const [showColor, setShowColor] = useState(false);
    const [showSize, setShowSize] = useState(false);
    const [showLocation, setShowLocation] = useState(false);

    // Photo  state
    const [photoUri, setPhotoUri] = useState<string | null>(null);


    // Detail fields values for submission
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [location, setLocation] = useState("");

    const [photoBase64, setPhotoBase64] = useState<string | null>(null);





    const onSave = async () => {
        const cleanTitle = title.trim();
        let storyId: string | null = null;

        if (cleanTitle.length === 0) {
            Alert.alert("Error", "Please enter a title. It is required.");
            return;
        }


        if (!photoUri || !photoBase64) {
            Alert.alert("Error", "Please take a photo.");
            return;
        }

        setLoading(true);
        try {
            const { data: userRes, error: userErr } = await supabase.auth.getUser();
            if (userErr) throw userErr;

            const user = userRes.user;
            if (!user) {
                Alert.alert("Error", "You must be logged in to add a story.");
                router.replace("/");
                return;
            }

            const userId = user.id;

            // 1) Insert story and get new story id
            const { data: inserted, error: insertErr } = await supabase
                .from("stories")
                .insert({
                    user_id: userId,
                    title: cleanTitle,
                    text: text.trim().length > 0 ? text.trim() : null,
                    color: color.trim().length > 0 ? color.trim() : null,
                    size: size.trim().length > 0 ? size.trim() : null,
                    location: location.trim().length > 0 ? location.trim() : null,
                })
                .select("id")
                .single();

            if (insertErr) throw insertErr;
            if (!inserted?.id) throw new Error("Story could not be created.");

            storyId = inserted.id as string;
            const imagePath = `${userId}/${storyId}.jpg`;


            // 2) Upload photo to Storage
            if (!photoBase64) throw new Error("Photo data missing.");

            const bytes = Uint8Array.from(atob(photoBase64), (c) => c.charCodeAt(0));
            const arrayBuffer = bytes.buffer;


            const { error: uploadErr } = await supabase.storage
                .from("images")
                .upload(imagePath, arrayBuffer, {
                    contentType: "image/jpeg",
                    upsert: true,
                });

            if (uploadErr) throw uploadErr;


            // 3) Update story with image_path
            const { error: updateErr } = await supabase
                .from("stories")
                .update({ image_path: imagePath })
                .eq("id", storyId);

            if (updateErr) throw updateErr;

            router.replace("/stories");
        } catch (e: any) {

            // Rollback: delete story if created
            if (storyId) {
                await supabase.from("stories").delete().eq("id", storyId);
            }
            Alert.alert("Error", e?.message ?? "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };


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


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAwareScrollView
                ref={scrollRef}
                contentContainerStyle={styles.container}
                enableOnAndroid
                extraScrollHeight={120}
                keyboardShouldPersistTaps="handled"
            >

                <Text style={styles.h1}>Add Story</Text>

                <Pressable onPress={takePhoto} style={styles.imageBox}>
                    {photoUri ? (
                        <Image
                            source={{ uri: photoUri }}
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
                    value={title}
                    onChangeText={setTitle}
                    placeholder="for exp: Tree"
                    style={styles.input}
                    autoCapitalize="none"
                    maxLength={80}
                    ref={titleRef}
                    onFocus={() => scrollToInput(titleRef)}
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
                        <TextInput
                            ref={colorRef}
                            onFocus={() => scrollToInput(colorRef)}
                            value={color}
                            onChangeText={setColor}
                            style={styles.input}
                            placeholder="White"
                        />


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
                        <TextInput ref={sizeRef} onFocus={() => scrollToInput(sizeRef)} value={size} onChangeText={setSize} style={styles.input} placeholder="2 meter" />

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
                        <TextInput
                            ref={locationRef}
                            onFocus={() => scrollToInput(locationRef)}
                            value={location}
                            onChangeText={setLocation}
                            style={styles.input}
                            placeholder="Zurich"
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
                />


                {/* Cansel + Save Buttons + HOME*/ }
                <View style={styles.row}>
                    <Pressable
                        style={[styles.btn, styles.btnCancel]}
                        onPress={() => router.back()}
                        disabled={loading}
                    >
                        <Text style={styles.btnCancelText}>Cancel</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.btn, styles.btnHome]}
                        onPress={() => router.replace("/stories")}
                        disabled={loading}
                    >
                        <Text style={styles.btnHomeText}>Home</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.btn, styles.btnSave, loading && styles.btnDisabled]}
                        onPress={onSave}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator /> : <Text style={styles.btnSaveText}>Save</Text>}
                    </Pressable>
                </View>

            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    );

}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 16, backgroundColor: "white" },
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
    row: { flexDirection: "row", gap: 12, marginTop: 20,marginBottom: 20 },
    btn: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    btnSave: { backgroundColor: "#233fbf" },
    btnCancel: { backgroundColor: "#eee" },
    btnHome: { backgroundColor: "#000000" },
    btnDisabled: { opacity: 0.7 },

    btnSaveText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    btnCancelText: { color: "#000", fontSize: 16, fontWeight: "600" },
    btnHomeText: { color: "#fff", fontSize: 16, fontWeight: "600" },




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

    imageIcon: {
        fontSize: 64,
    },
    imageText: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: "500",
    },

});
