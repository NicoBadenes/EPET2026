import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function BookList() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setBooks(data);
    setLoading(false);
  };

  // NUEVA FUNCIÓN: Llama a la Edge Function de Supabase
  const handleGetAverage = async (bookId: number, bookTitle: string) => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "calcular-promedio",
        {
          body: { book_id: bookId },
        },
      );

      if (error) throw error;

      if (data && data.total_reviews > 0) {
        window.alert(
          `Promedio de "${bookTitle}": ${data.average_rating} ⭐\n(Basado en ${data.total_reviews} reseñas)`,
        );
      } else {
        window.alert(`El libro "${bookTitle}" todavía no tiene reseñas.`);
      }
    } catch (error: any) {
      console.error(error);
      window.alert("Error al obtener promedio: " + error.message);
    }
  };

  const handleUpdate = async (book: any) => {
    if (!editTitle || editTitle === book.title) {
      setEditingId(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("books")
        .update({ title: editTitle })
        .eq("id", book.id)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        window.alert(
          "Acceso denegado: No tenés permisos para editar este libro.",
        );
        setEditingId(null);
        return;
      }

      window.alert("Libro actualizado correctamente.");
      setEditingId(null);
    } catch (error: any) {
      console.error(error);
      window.alert("Error de BD: " + error.message);
    }
  };

  const handleDelete = async (book: any) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que querés eliminar "${book.title}"?`,
    );
    if (!confirmar) return;

    try {
      const { data, error: dbError } = await supabase
        .from("books")
        .delete()
        .eq("id", book.id)
        .select();

      if (dbError) throw dbError;

      if (!data || data.length === 0) {
        window.alert(
          "Acceso denegado: No tenés permisos para eliminar este libro.",
        );
        return;
      }

      if (book.cover_url) {
        const urlParts = book.cover_url.split("/");
        const fileName = urlParts[urlParts.length - 1];
        if (fileName) {
          await supabase.storage.from("covers").remove([fileName]);
        }
      }

      window.alert("Libro y archivo eliminados correctamente.");
    } catch (error: any) {
      console.error(error);
      window.alert("Error de BD: " + error.message);
    }
  };

  useEffect(() => {
    fetchBooks();

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
          } else if (payload.eventType === "UPDATE") {
            setBooks((prevBooks) =>
              prevBooks.map((b) => (b.id === payload.new.id ? payload.new : b)),
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

          {editingId === item.id ? (
            <TextInput
              style={styles.input}
              value={editTitle}
              onChangeText={setEditTitle}
              autoFocus
            />
          ) : (
            <Text style={styles.title}>{item.title}</Text>
          )}

          <Text style={styles.author}>
            {item.author} {item.publish_year ? `- ${item.publish_year}` : ""}
          </Text>
          {item.synopsis ? (
            <Text style={styles.synopsis}>{item.synopsis}</Text>
          ) : null}

          <View style={styles.buttonContainer}>
            {/* BOTÓN EDGE FUNCTION */}
            <Button
              title="Ver Promedio ⭐"
              color="#17a2b8"
              onPress={() => handleGetAverage(item.id, item.title)}
            />
            <View style={{ height: 10 }} />

            {editingId === item.id ? (
              <Button
                title="Guardar Cambios"
                color="#28a745"
                onPress={() => handleUpdate(item)}
              />
            ) : (
              <Button
                title="Editar Título"
                color="#007bff"
                onPress={() => {
                  setEditingId(item.id);
                  setEditTitle(item.title);
                }}
              />
            )}
            <View style={{ height: 10 }} />
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
  buttonContainer: { marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#fafafa",
  },
});
