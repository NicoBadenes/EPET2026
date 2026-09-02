import AddBookForm from "@/components/AddBookForm";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Auth from "../components/Auth";
import BookList from "../components/BookList";
import { supabase } from "../lib/supabase";

export default function Index() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View style={styles.container}>
      {session && session.user ? (
        <View style={styles.center}>
          <Text style={styles.welcome}>¡Bienvenido a la Librería!</Text>
          <Text>{session.user.email}</Text>

          {/* ACÁ VA EL COMPONENTE */}
          <BookList />
          <AddBookForm />

          <View style={{ marginTop: 20 }}>
            <Text
              onPress={() => supabase.auth.signOut()}
              style={{ color: "red", padding: 10 }}
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
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 40,
  },
});
