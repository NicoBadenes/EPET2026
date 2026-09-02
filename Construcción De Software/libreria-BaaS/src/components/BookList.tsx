import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View
} from "react-native";
import { supabase } from "../lib/supabase";

export default function BookList() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setBooks(data);
    setLoading(false);
  };

  const handleDelete = async (book: any) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que querés eliminar "${book.title}"?`,
    );
    if (!confirmar) return;

    try {
      if (book.cover_url) {
        const urlParts = book.cover_url.split("/");
        const fileName = urlParts[urlParts.length - 1];
        if (fileName) {
          await supabase.storage.from("covers").remove([fileName]);
        }
      }

      const { error: dbError } = await supabase
        .from("books")
        .delete()
        .eq("id", book.id);

      if (dbError) throw dbError;

      setBooks((prevBooks) => prevBooks.filter((b) => b.id !== book.id));
      window.alert("Libro y archivo eliminados correctamente.");
    } catch (error: any) {
      console.error(error);
      window.alert("Error de BD: " + error.message);
    }
  };

  useEffect(() => {
    fetchBooks();

    // Tiempo real para inserciones y eliminaciones
    const channel = supabase
      .channel("public:books")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "books" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBooks((prevBooks) => [payload.new, ...prevBooks]);
          } else if (payload.eventType === "DELETE") {
            setBooks((prevBooks) =>
              prevBooks.filter((b) => b.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.id.toString()}
      style={{ width: "100%", marginTop: 10 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.cover_url && (
            <Image source={{ uri: item.cover_url }} style={styles.cover} />
          )}
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>
            {item.author} {item.publish_year ? `- ${item.publish_year}` : ""}
          </Text>
          {item.synopsis ? (
            <Text style={styles.synopsis}>{item.synopsis}</Text>
          ) : null}

          <View style={styles.deleteButtonContainer}>
            <Button
              title="Eliminar Libro y Archivo"
              color="#dc3545"
              onPress={() => handleDelete(item)}
            />
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
  },
  cover: {
    width: "100%",
    height: 200,
    borderRadius: 6,
    marginBottom: 10,
    resizeMode: "cover",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#333" },
  author: { fontSize: 14, color: "#666", marginTop: 4 },
  synopsis: { fontSize: 14, color: "#444", marginTop: 8 },
  deleteButtonContainer: {
    marginTop: 12,
  },
});
