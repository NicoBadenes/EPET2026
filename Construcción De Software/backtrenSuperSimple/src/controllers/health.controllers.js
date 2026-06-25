import { checkHealth, checkHealthDB } from "../services/health.services.js";

export const health = (req, res) => {
  res.status(200).json(checkHealth());
};

export const healthDB = async (req, res) => {
  const result = await checkHealthDB();
  if (result.status === "error") {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
};