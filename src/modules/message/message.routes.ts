import express from "express";
import {
  sendMessageInChat,
  deleteMessageById,
} from "./message.controller";
import { AuthMiddleware } from "../user/user.middleware";

const MessageRouter = express.Router();

// Apply auth to all routes
MessageRouter.use(AuthMiddleware);

// Send message in chat
MessageRouter.post("/:chatId/send", sendMessageInChat);

// Delete message by id
MessageRouter.delete("/:messageId", deleteMessageById);

export default MessageRouter;