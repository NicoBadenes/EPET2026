import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Switch } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Slider from '@react-native-community/slider';
import CustomButton from "./CustomButton";

export default function SideMenu({ 
  visible, onClose, pomoTime, pomoSeconds, setPomoTime, setPomoSeconds, 
  alarmVolume, setAlarmVolume, isClickEnabled, setIsClickEnabled 
}) {
  const [view, setView] = useState("menu"); // menu, pomo, sounds
  const [mins, setMins] = useState(pomoTime.toString());
  const [secs, setSecs] = useState(pomoSeconds.toString());

  function handleClose() {
    setView("menu");
    onClose();
  }

  function handleSavePomo() {
    const m = parseInt(mins) || 0;
    const s = parseInt(secs) || 0;
    if (m >= 0 && s >= 0 && (m + s) > 0) {
      setPomoTime(m);
      setPomoSeconds(s);
      setView("menu");
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.menuContainer}>
              
              {view === "menu" ? (
                /* --- VISTA PRINCIPAL --- */
                <View>
                  <Text style={styles.menuTitle}>Configuración</Text>
                  
                  <TouchableOpacity style={styles.menuItem} onPress={() => setView("pomo")}>
                    <Ionicons name="timer-outline" size={24} color="#333" />
                    <Text style={styles.menuItemText}>Modificar Pomodoro</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuItem} onPress={() => setView("sounds")}>
                    <Ionicons name="volume-high-outline" size={24} color="#333" />
                    <Text style={styles.menuItemText}>Ajustes de Sonido</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                  </TouchableOpacity>
                </View>

              ) : view === "pomo" ? (
                /* --- VISTA MODIFICAR TIEMPO --- */
                <View>
                  <TouchableOpacity style={styles.backButton} onPress={() => setView("menu")}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                    <Text style={styles.backText}>Volver</Text>
                  </TouchableOpacity>
                  <Text style={styles.subTitle}>Tiempo Pomodoro</Text>
                  <View style={styles.inputGroup}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>Mins:</Text>
                      <TextInput style={styles.input} keyboardType="numeric" value={mins} onChangeText={setMins} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.label}>Segs:</Text>
                      <TextInput style={styles.input} keyboardType="numeric" value={secs} onChangeText={setSecs} />
                    </View>
                  </View>
                  <CustomButton title="GUARDAR" onPress={handleSavePomo} />
                </View>

              ) : (
                /* --- VISTA SONIDOS CON EL SLIDER --- */
                <View>
                  <TouchableOpacity style={styles.backButton} onPress={() => setView("menu")}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                    <Text style={styles.backText}>Volver</Text>
                  </TouchableOpacity>
                  <Text style={styles.subTitle}>Sonidos</Text>

                  <View style={styles.switchRow}>
                    <Text style={styles.menuItemText}>Sonido Botones (On/Off)</Text>
                    <Switch 
                      value={isClickEnabled} 
                      onValueChange={setIsClickEnabled}
                      trackColor={{ false: "#767577", true: "#333" }}
                    />
                  </View>

                  <View style={{ marginTop: 30 }}>
                    <Text style={styles.label}>Volumen Alarma: {Math.round(alarmVolume * 100)}%</Text>
                    <Slider
                      style={{ width: "100%", height: 40 }}
                      minimumValue={0}
                      maximumValue={1}
                      minimumTrackTintColor="#333"
                      maximumTrackTintColor="#ccc"
                      thumbTintColor="#333"
                      value={alarmVolume}
                      onValueChange={setAlarmVolume} 
                    />
                  </View>
                </View>
              )}

              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeText}>Cerrar Menú</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "flex-end" },
  menuContainer: { width: "85%", height: "100%", backgroundColor: "#fff", padding: 25, paddingTop: 60 },
  menuTitle: { fontSize: 28, fontWeight: "bold", marginBottom: 30 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 15, borderBottomWidth: 1, borderColor: "#eee" },
  menuItemText: { flex: 1, fontSize: 18, marginLeft: 15 },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backText: { fontSize: 16, marginLeft: 10, fontWeight: "600" },
  subTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  inputGroup: { flexDirection: "row", marginBottom: 30 },
  label: { color: "#666", marginBottom: 5 },
  input: { borderBottomWidth: 2, borderColor: "#333", fontSize: 20, padding: 5 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 15, borderBottomWidth: 1, borderColor: "#eee" },
  closeButton: { position: "absolute", bottom: 40, width: "100%", left: 25, alignItems: "center" },
  closeText: { color: "#999", fontWeight: "bold" },
});