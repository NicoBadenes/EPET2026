import { pool } from "../database.js";

export const checkHealth = () => {
  return {
    status: "ok",
    message: "API running",
    timestamp: new Date().toISOString(),
  };
};

export const checkHealthDB = async () => {
  try {
    await pool.query("SELECT 1"); 
    return { status: "ok", message: "Conexión a la base de datos exitosa" };
  } catch (error) {
    return { status: "error", message: "Fallo la conexión: " + error.message };
  }
};