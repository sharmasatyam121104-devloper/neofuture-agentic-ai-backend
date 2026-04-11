import express from "express";
import {
  sendMessageInChat,
  deleteMessageById,
  getUploadSignedUrlForSendMessageInChat,
  downlodCsvFile,
} from "./message.controller";
import { AuthMiddleware } from "../user/user.middleware";

const MessageRouter = express.Router();

// Apply auth to all routes
MessageRouter.use(AuthMiddleware);

MessageRouter.post("/:chatId/getUploadUrl", getUploadSignedUrlForSendMessageInChat);

// Send message in chat
MessageRouter.post("/:chatId/send", sendMessageInChat);

// Delete message by id
MessageRouter.delete("/:messageId", deleteMessageById);

MessageRouter.get("/:messageId", downlodCsvFile);



export default MessageRouter;