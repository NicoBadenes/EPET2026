import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function AddBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [rating, setRating] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.5,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    if (!title || !author || !rating)
      return Alert.alert(
        "Error",
        "Título, autor y calificación son obligatorios.",
      );

    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No hay usuario autenticado");

      let coverUrl = null;
      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const fileName = `${Date.now()}-${user.id}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("covers")
          .upload(fileName, blob, { contentType: "image/jpeg" });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("covers")
          .getPublicUrl(fileName);

        coverUrl = publicUrlData.publicUrl;
      }

      const { data: book, error: bookError } = await supabase
        .from("books")
        .insert([
          {
            title,
            author,
            publish_year: parseInt(year) || null,
            synopsis,
            cover_url: coverUrl,
          },
        ])
        .select()
        .single();

      if (bookError) throw bookError;

      const { error: reviewError } = await supabase.from("reviews").insert([
        {
          book_id: book.id,
          user_id: user.id,
          rating: parseInt(rating),
          review_text: reviewText,
        },
      ]);

      if (reviewError) throw reviewError;

      Alert.alert("¡Éxito!", "Libro y reseña guardados correctamente.");
      setTitle("");
      setAuthor("");
      setYear("");
      setSynopsis("");
      setRating("");
      setReviewText("");
      setImageUri(null);
    } catch (error: any) {
      console.error("Error detallado:", error);
      Alert.alert("Error al guardar", error.message || JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Agregar Nuevo Libro</Text>

      <Button title="1. Elegir Portada" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Autor"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={styles.input}
        placeholder="Año (ej. 1949)"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Sinopsis"
        value={synopsis}
        onChangeText={setSynopsis}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Calificación (1-5)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Tu reseña"
        value={reviewText}
        onChangeText={setReviewText}
        multiline
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 15 }}
        />
      ) : (
        <Button
          title="2. Guardar Todo"
          onPress={handleSubmit}
          color="#28a745"
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    maxHeight: 450,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  preview: {
    width: 100,
    height: 150,
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 8,
  },
});
