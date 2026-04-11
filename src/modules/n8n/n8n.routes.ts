import express from "express";
import { dataPreProcessing } from "./n8n.controller";
import { AuthMiddleware } from "../user/user.middleware";

const N8NRouter = express.Router();

//  protect all routes
N8NRouter.use(AuthMiddleware);

//  routes
N8NRouter.post("/data-preprocessing", dataPreProcessing);

export default N8NRouter;