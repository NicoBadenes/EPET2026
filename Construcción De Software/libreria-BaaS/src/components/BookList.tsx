import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
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

  useEffect(() => {
    fetchBooks();

    // Esto hace que la lista escuche cambios en tiempo real
    const channel = supabase
      .channel("public:books")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "books" },
        (payload) => {
          setBooks((prevBooks) => [payload.new, ...prevBooks]);
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
      style={{ width: "100%", marginTop: 20 }}
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
});
