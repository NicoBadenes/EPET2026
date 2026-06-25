import { StyleSheet, Text, View, SafeAreaView, Platform, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons"; 

// Importación de componentes
import Header from "./src/components/Header";
import Timer from "./src/components/Timer";
import CustomButton from "./src/components/CustomButton";
import SideMenu from "./src/components/SideMenu";

const colors = ["#F7DC6F", "#A2D9CE", "#D7BDE2"];

const alarmSounds = [
  require("./assets/alarm1.mp3"), require("./assets/alarm2.mp3"), require("./assets/alarm3.mp3"), 
  require("./assets/alarm4.mp3"), require("./assets/alarm5.mp3"), require("./assets/alarm6.mp3"), 
  require("./assets/alarm7.mp3"), require("./assets/alarm8.mp3"), require("./assets/alarm9.mp3"), 
  require("./assets/alarm10.mp3"), require("./assets/alarm11.mp3"), require("./assets/alarm12.mp3"), 
  require("./assets/alarm13.mp3"), 
];

const clickSoundFile = require("./assets/click.mp3");

export default function App() {
  // --- ESTADOS DE TIEMPO Y NAVEGACIÓN ---
  const [pomoTime, setPomoTime] = useState(25);
  const [pomoSeconds, setPomoSeconds] = useState(0);
  const [time, setTime] = useState(25 * 60);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // --- ESTADOS DE SONIDO Y MEMORIA ---
  const [currentSound, setCurrentSound] = useState(null);
  const [availableAlarms, setAvailableAlarms] = useState([]);
  const [isClickEnabled, setIsClickEnabled] = useState(true);
  const [alarmVolume, setAlarmVolume] = useState(1.0); 

  // --- FUNCIÓN CENTRAL DE AUDIO ---
  async function playSound(file, type = "click") {

    if (type === "click" && !isClickEnabled) return;
    
    if (type === "alarm" && alarmVolume === 0) return;

    try {
      if (currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
        setCurrentSound(null);
      }

      const volumeLevel = type === "alarm" ? alarmVolume : 1.0;

      const { sound } = await Audio.Sound.createAsync(
        file, 
        { shouldPlay: true, volume: volumeLevel }
      );

      if (type === "alarm") setCurrentSound(sound);

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          await sound.unloadAsync();
          if (type === "alarm") setCurrentSound(null);
        }
      });
    } catch (error) { 
      console.log("Audio Error:", error); 
    }
  }

  // --- LÓGICA DE ALARMAS SIN REPETIR (Shuffle Bag) ---
  function triggerRandomAlarm() {
    let pool = [...availableAlarms];
    
    if (pool.length === 0) {
      pool = alarmSounds.map((_, i) => i);
    }

    const randomIdxInPool = Math.floor(Math.random() * pool.length);
    const selectedAlarmIndex = pool[randomIdxInPool];
    
    setAvailableAlarms(pool.filter((_, idx) => idx !== randomIdxInPool));
    
    playSound(alarmSounds[selectedAlarmIndex], "alarm");
  }

  // --- EFECTOS (Lifecycle) ---
  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => setTime((prev) => prev - 1), 1000);
    } else if (time === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
      triggerRandomAlarm();
    } else { 
      clearInterval(interval); 
    }
    return () => clearInterval(interval);
  }, [isActive, time, availableAlarms]);

  // Sincronizar el reloj con los ajustes del SideMenu
  useEffect(() => {
    if (currentIndex === 0 && !isActive && !isFinished) {
      setTime((pomoTime * 60) + pomoSeconds);
    }
  }, [pomoTime, pomoSeconds]);

  // --- MANEJADORES DE INTERFAZ ---
  async function handleToggle() {
    if (isFinished) {
      if (currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
        setCurrentSound(null);
      }
      
      const resetTime = currentIndex === 0 ? (pomoTime * 60) + pomoSeconds : currentIndex === 1 ? 5 * 60 : 10 * 60;
      setTime(resetTime);
      setIsFinished(false);
      playSound(clickSoundFile, "click");
      return;
    }

    playSound(clickSoundFile, "click");
    setIsActive(!isActive);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors[currentIndex] }]}>
      <View style={styles.layout}>
        
        {/* Cabecera: Título y Menú Hamburguesa */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>POMODORO</Text>
          <TouchableOpacity onPress={() => { playSound(clickSoundFile, "click"); setIsMenuVisible(true); }}>
            <Ionicons name="menu-sharp" size={35} color="#333" />
          </TouchableOpacity>
        </View>
        
        <Header 
          currentIndex={currentIndex} 
          setCurrentIndex={setCurrentIndex} 
          setTime={setTime}
          playSound={() => playSound(clickSoundFile, "click")} 
          pomoTime={pomoTime} 
          pomoSeconds={pomoSeconds}
          setIsActive={setIsActive} 
          setIsFinished={setIsFinished}
        />

        <Timer time={time} />

        <CustomButton 
          title={isFinished ? "REINICIAR" : (isActive ? "PARAR" : "INICIAR")} 
          onPress={handleToggle} 
        />

        <SideMenu 
          visible={isMenuVisible}
          onClose={() => setIsMenuVisible(false)}
          pomoTime={pomoTime} 
          pomoSeconds={pomoSeconds}
          setPomoTime={setPomoTime} 
          setPomoSeconds={setPomoSeconds}
          alarmVolume={alarmVolume} 
          setAlarmVolume={setAlarmVolume}
          isClickEnabled={isClickEnabled} 
          setIsClickEnabled={setIsClickEnabled}
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  layout: { 
    flex: 1, 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === "android" ? 40 : 10 
  },
  headerRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 25 
  },
  title: { 
    fontSize: 35, 
    fontWeight: "900", 
    color: "#333" 
  },
});