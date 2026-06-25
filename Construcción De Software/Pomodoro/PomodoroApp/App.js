import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import { useFonts, Bungee_400Regular } from "@expo-google-fonts/bungee";
import { Ionicons } from "@expo/vector-icons";

// 1. MODIFICACIÓN: Colores de fondo actualizados
const MODES = {
  pomodoro: { label: "Pomodoro", time: 25 * 60, color: "#FF5733" }, // Naranja vibrante
  shortBreak: { label: "Descanso", time: 5 * 60, color: "#33FF57" }, // Verde neón
  longBreak: { label: "Largo", time: 10 * 60, color: "#3357FF" },    // Azul eléctrico
};

export default function App() {
  // 2. MODIFICACIÓN: Carga de la fuente loca (Bungee)
  let [fontsLoaded] = useFonts({
    Bungee_400Regular,
  });

  const [mode, setMode] = useState("pomodoro");
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.time);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    async function setupAudio() {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    }
    setupAudio();
  }, []);

  const playSound = async (soundFile) => {
    try {
      const { sound } = await Audio.Sound.createAsync(soundFile, {
        volume: 0.5,
      });
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log("Error sonido:", error);
    }
  };

  const playClickSound = () => {
    playSound(require("./assets/sounds/button_click.mp3"));
  };

  const playAlarmSound = async () => {
    for (let i = 0; i < 3; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await playSound(require("./assets/sounds/alarm_clock.mp3"));
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            playAlarmSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleModeChange = (newMode) => {
    playClickSound();
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODES[newMode].time);
  };

  const toggleTimer = () => {
    playClickSound();
    setIsRunning(!isRunning);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Si la fuente no cargó, mostramos un cargando
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  const currentColor = MODES[mode].color;

  return (
    <View style={[styles.container, { backgroundColor: currentColor }]}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>POMODORO</Text>

      <View style={styles.tabs}>
        {Object.entries(MODES).map(([key, { label }]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.tab,
              mode === key && styles.tabActive,
              {
                backgroundColor:
                  mode === key ? "#fff" : "rgba(255,255,255,0.2)",
              },
            ]}
            onPress={() => handleModeChange(key)}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.tabText, mode === key && styles.tabTextActive]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>

      {/* 4. MODIFICACIÓN: Botón con íconos Play/Pause */}
      <TouchableOpacity
        style={styles.button}
        onPress={toggleTimer}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={isRunning ? "pause" : "play"} 
          size={40} 
          color={currentColor} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: "#fff",
    marginBottom: 40,
    fontFamily: "Bungee_400Regular", // Aplicada la fuente loca
  },
  tabs: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 40,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: "#fff",
  },
  tabText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Bungee_400Regular", // Fuente aplicada a tabs
  },
  tabTextActive: {
    color: "#333",
  },
  timer: {
    fontSize: 80,
    color: "#fff",
    marginBottom: 40,
    fontFamily: "Bungee_400Regular", // Fuente aplicada al reloj
  },
  button: {
    backgroundColor: "#fff",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});