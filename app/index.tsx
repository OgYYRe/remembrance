import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Keyboard, Pressable,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View, StyleSheet, Image
} from "react-native";
import { supabase } from "../lib/supabase";
import { nicknameToEmail } from "../lib/auth";
import { validatePassword } from "../lib/password";
import {router} from "expo-router";

export default function Login() {
    const [nickname, setNickname] = useState("ogyyre");
    const [password, setPassword] = useState("Ab12345.");
    const [loading, setLoading] = useState(false);

    async function signUp(){
        try{
            setLoading(true);
            validatePassword(password);
            const email = nicknameToEmail(nickname);
            const {error} = await supabase.auth.signUp({email, password});
            if(error) throw error;
            Alert.alert("OK", "Account created! Please sign in.");
        } catch (e: any) {
            Alert.alert("Error", e?.message ?? "Unknown error");
        } finally {
            setLoading(false);
        }
    }
    async function signIn() {
        try {
            setLoading(true);
            const email = nicknameToEmail(nickname);

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            router.replace("/stories");

        } catch (e: any) {
            Alert.alert("Error", e?.message ?? "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    return (


        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <View style={styles.screen}>
                <View style={styles.card}>
                    <Image source={ require("../assets/logo.png")} style={{width: 80, height: 80, alignSelf: "center", marginBottom: 8}} />
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "500",
                            textAlign: "center",
                            color: "#555",
                            marginBottom: 2,
                        }}
                    >
                        Welcome 👋
                    </Text>

                    <Text
                        style={{
                            fontSize: 14,
                            textAlign: "center",
                            color: "#777",
                            marginBottom: 8,
                        }}
                    >
                        Create, save and revisit your personal stories
                    </Text>
                    <Text style={styles.title}>Login</Text>

                    <View style={styles.field}>
                        <Text style={styles.label}>Nickname</Text>
                        <TextInput
                            value={nickname}
                            onChangeText={setNickname}
                            placeholder="Nickname"
                            placeholderTextColor="#888"
                            autoCapitalize="none"
                            autoCorrect={false}
                            style={styles.input}
                            editable={!loading}
                            returnKeyType="next"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Password"
                            placeholderTextColor="#888"
                            secureTextEntry
                            style={styles.input}
                            editable={!loading}
                            returnKeyType="done"
                        />
                    </View>

                    <View style={styles.btnRow}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.btn,
                                styles.btnSecondary,
                                pressed && styles.pressed,
                                loading && styles.btnDisabled,
                            ]}
                            onPress={signUp}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator /> : <Text style={styles.btnSecondaryText}>Sign up</Text>}
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.btn,
                                styles.btnPrimary,
                                pressed && styles.pressed,
                                loading && styles.btnDisabled,
                            ]}
                            onPress={signIn}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator /> : <Text style={styles.btnPrimaryText}>Sign in</Text>}
                        </Pressable>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "white",
        padding: 16,
        justifyContent: "center",
    },
    card: {
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 16,
        padding: 16,
        gap: 14,
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 6,
    },
    field: {
        gap: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#222",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
    },
    btnRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 6,
    },
    btn: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    btnPrimary: {
        backgroundColor: "#233fbf",
    },
    btnSecondary: {
        backgroundColor: "#eee",
    },
    btnPrimaryText: {
        color: "white",
        fontSize: 16,
        fontWeight: "700",
    },
    btnSecondaryText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "700",
    },
    btnDisabled: {
        opacity: 0.7,
    },
    pressed: {
        opacity: 0.85,
    },
});