import { useState } from "react";
import {
    Alert,
    Button,
    Keyboard,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { supabase } from "../lib/supabase";
import { nicknameToEmail } from "../lib/auth";
import {router} from "expo-router";

export default function Login() {
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function signUp(){
        try{
            setLoading(true);
            const email = nicknameToEmail(nickname);
            const {error} = await supabase.auth.signUp({email, password});
            if(error) throw error;
            Alert.alert("OK", "Account created! Jetzt bitte einloggen.");
        } catch (e: any) {
            Alert.alert("Fehler", e?.message ?? "Unbekannter Fehler");
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
            router.replace("/home");

        } catch (e: any) {
            Alert.alert("Fehler", e?.message ?? "Unbekannter Fehler");
        } finally {
            setLoading(false);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 16,
                    gap: 12,
                }}
            >
                <Text style={{ fontSize: 22, fontWeight: "600" }}>Login</Text>

                <TextInput

                    value={nickname}
                    onChangeText={setNickname}
                    placeholder="Nickname"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <TextInput

                    value={password}
                    onChangeText={setPassword}
                    placeholder="Passwort"
                    secureTextEntry
                />

                <Button title="Sign up" onPress={signUp} disabled={loading} />
                <Button title="Sign in" onPress={signIn} disabled={loading} />
            </View>
        </TouchableWithoutFeedback>
    );
}