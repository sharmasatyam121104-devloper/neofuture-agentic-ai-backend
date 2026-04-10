import express from "express";
import {
  createChat,
  fetchChatById,
  fetchAllChat,
} from "./chat.controller";
import { AuthMiddleware } from "../user/user.middleware";

const ChatRouter = express.Router();

// Apply auth middleware to all routes
ChatRouter.use(AuthMiddleware);

// Create new chat
ChatRouter.post("/create", createChat);

// Get all chats
ChatRouter.get("/", fetchAllChat);

// Get single chat
ChatRouter.get("/:chatId", fetchChatById);

export default ChatRouter;