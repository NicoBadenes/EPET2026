import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) Alert.alert("Error al iniciar sesión", error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert("Error en el registro", error.message);
    else Alert.alert("¡Éxito!", "Usuario creado correctamente.");
    setLoading(false);
  }

  async function forgotPassword() {
    if (!email) {
      Alert.alert(
        "Atención",
        "Ingresá tu correo en el campo de arriba para recuperar la contraseña.",
      );
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setLoading(false);
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Correo enviado",
        "Revisá tu bandeja de entrada para restablecer tu contraseña.",
      );
    }
  }

  async function signInWithGoogle() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      Alert.alert("Error de Google", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="correo@ejemplo.com"
        autoCapitalize={"none"}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
        placeholder="Contraseña"
        autoCapitalize={"none"}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 20 }}
        />
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Iniciar Sesión" onPress={signInWithEmail} />
          <View style={styles.spacing} />
          <Button
            title="Registrarse"
            onPress={signUpWithEmail}
            color="#28a745"
          />
          <View style={styles.spacing} />
          <Button
            title="Recuperar Contraseña"
            onPress={forgotPassword}
            color="#ffc107"
          />
          <View style={styles.spacing} />
          <Button
            title="Entrar con Google"
            onPress={signInWithGoogle}
            color="#4285F4"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 40, padding: 20 },
  buttonContainer: { marginTop: 15 },
  spacing: { height: 10 },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
});
