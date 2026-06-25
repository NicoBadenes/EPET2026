import { View, Text, StyleSheet } from "react-native";

export default function Timer({ time }) {
  const formattedTime = `${Math.floor(time / 60)
    .toString()
    .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`;

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formattedTime}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.3)", 
    padding: 30,
    borderRadius: 20,
    marginVertical: 20,
  },
  time: {
    fontSize: 90,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
});