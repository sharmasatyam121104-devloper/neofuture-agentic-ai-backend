import { Response } from "express";
import { catchError } from "../../utils/serverErrorhandler";
import { processN8nJob } from "./n8n.service";
import { SessionInterface } from "../user/user.interface";

const createHandler =
  (type: "data-processing" | "model-generation" | "data-visualization" | "ai-suggestion") =>
  async (req: SessionInterface, res: Response) => {
    try {
      const result = await processN8nJob(req, type);

      return res.json({
        success: true,
        message: `${type} completed successfully`,
        ...result,
      });
    } catch (error) {
      return catchError(error, res);
    }
  };

// ---------------- EXPORT ----------------
export const dataPreProcessing = createHandler("data-processing");
export const modelGeneration = createHandler("model-generation");
export const dataVisualization = createHandler("data-visualization");
export const aiSuggestion = createHandler("ai-suggestion");