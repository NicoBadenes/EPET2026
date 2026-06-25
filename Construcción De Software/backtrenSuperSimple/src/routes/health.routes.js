import { Router } from "express";
import { health, healthDB } from "../controllers/health.controllers.js";

const router = Router();

router.get("/", health);
router.get("/db", healthDB); // Esta es tu nueva ruta

export default router;