import express from "express";
import { AuthMiddleware } from "../user/user.middleware";
import {
  dataPreProcessing,
  modelGeneration,
  dataVisualization,
  aiSuggestion,
} from "./n8n.controller";

const router = express.Router();

router.use(AuthMiddleware);

// ---------------- ROUTES ----------------
router.post("/data-processing", dataPreProcessing);
router.post("/model-generation", modelGeneration);
router.post("/data-visualization", dataVisualization);
router.post("/ai-suggestion", aiSuggestion);

export default router;