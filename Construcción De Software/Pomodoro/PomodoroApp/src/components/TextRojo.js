// --- CODIGO EJEMPLO ---

// npm install -g eas-cli
// 	eas login
// eas build:configure
//     "preview": {
//       "android": {
//         "buildType": "apk"
//       }
//     },

// eas build -p android --profile preview
// eas update --branch main --message "publicación inicial"

// El que importe 'import React from "react"' o 'from React' queda DESAPROBADO;

import { Text } from "react-native";

export default function TextRojo({ texto }) {
  return <Text style={{ color: "red", fontSize: 20 }}>{texto}</Text>;
}
