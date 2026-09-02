import AddBookForm from "@/components/AddBookForm";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import Auth from "../components/Auth";
import BookList from "../components/BookList";
import { supabase } from "../lib/supabase";

export default function Index() {
  const [session, setSession] = useState<Session | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  async function handleUpdatePassword() {
    if (!newPassword || newPassword.length < 6) {
      window.alert("Error: La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setUpdating(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setUpdating(false);

    if (error) {
      window.alert("Error al actualizar: " + error.message);
    } else {
      window.alert("¡Éxito! Contraseña actualizada.");
      setNewPassword("");
    }
  }

  return (
    <View style={styles.container}>
      {session && session.user ? (
        <View style={styles.center}>
          <Text style={styles.welcome}>¡Bienvenido a la Librería!</Text>
          <Text style={styles.emailText}>{session.user.email}</Text>

          {/* Sección de Cambio de Contraseña */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nueva contraseña"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            {updating ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Button
                title="Cambiar mi Contraseña"
                onPress={handleUpdatePassword}
                color="#ff9800"
              />
            )}
          </View>

          {/* Listado y Formulario de Libros */}
          <BookList />
          <AddBookForm />

          <View style={{ marginTop: 20, marginBottom: 30 }}>
            <Text
              onPress={() => supabase.auth.signOut()}
              style={{
                color: "red",
                padding: 10,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Cerrar Sesión
            </Text>
          </View>
        </View>
      ) : (
        <Auth />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", backgroundColor: "#f5f5f5" },
  center: { alignItems: "center", flex: 1, width: "100%", padding: 20 },
  welcome: { fontSize: 24, fontWeight: "bold", marginBottom: 5, marginTop: 40 },
  emailText: { fontSize: 14, color: "#666", marginBottom: 15 },
  passwordContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    backgroundColor: "#fafafa",
  },
});
