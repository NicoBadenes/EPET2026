# 🍅 Pomodoro Timer

> App minimalista de productividad con técnica Pomodoro, desarrollada en **React Native + Expo**. Diseño dinámico con feedback de audio y cambio de colores según el modo.

---

## 📋 ¿Qué hace esta app?

Una implementación limpia y funcional de la técnica Pomodoro:

- 🍅 **Pomodoro**: 25 minutos de enfoque (fondo rojo `#ba4949`)
- ☕ **Descanso Corto**: 5 minutos (fondo cyan `#16A4F0`)
- 🛋️ **Descanso Largo**: 10 minutos (fondo azul `#0376F0`)

Al finalizar cada sesión, suena una alarma (3 repeticiones) para avisarte. Todo con feedback de sonido en los botones y una interfaz que cambia de color según lo que estés haciendo.

---

## ✨ Características

| Feature                   | Descripción                                                   |
| ------------------------- | ------------------------------------------------------------- |
| 🎨 **UI Dinámica**        | El fondo cambia de color según el modo activo                 |
| 🔊 **Feedback de Audio**  | Sonido al presionar botones + alarma al finalizar             |
| 🔄 **3 Modos Integrados** | Pomodoro / Descanso Corto / Descanso Largo                    |
| ⏱️ **Timer Preciso**      | Formato MM:SS con actualización cada segundo                  |
| 📱 **Multiplataforma**    | Funciona en Web, iOS y Android vía Expo Go                    |
| 🧠 **Código Simple**      | Lógica concentrada en `App.js`, fácil de entender y modificar |

---

## 🛠️ Tecnologías

- **React Native**: Framework para apps móviles nativas
- **Expo**: Desarrollo, testing y despliegue simplificado
- **expo-av**: Reproducción de sonidos (clicks + alarma)
- **JavaScript**: Lógica con hooks: `useState`, `useEffect`, `useRef`
