import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const options = ["Pomodoro", "Descanso (5)", "Descanso (10)"];

export default function Header({ currentIndex, setCurrentIndex, setTime, playSound, pomoTime, pomoSeconds, setIsActive, setIsFinished }) {
  
  function handlePress(index) {
    if (playSound) playSound();
    
    setIsActive(false); 
    setIsFinished(false);
    
    let totalSeconds = 0;
    if (index === 0) {
      totalSeconds = (pomoTime * 60) + pomoSeconds;
    } else if (index === 1) {
      totalSeconds = 5 * 60;
    } else {
      totalSeconds = 10 * 60;
    }
    
    setCurrentIndex(index);
    setTime(totalSeconds);
  }

  return (
    <View style={styles.container}>
      {options.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handlePress(index)}
          style={[
            styles.itemStyle,
            currentIndex !== index && { borderColor: "transparent" },
          ]}
        >
          <Text style={[styles.text, currentIndex === index && { fontWeight: "bold" }]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  itemStyle: { width: "32%", alignItems: "center", borderWidth: 2, paddingVertical: 10, borderRadius: 10, borderColor: "white" },
  text: { fontSize: 14, color: "#333" }
});