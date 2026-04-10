// chat.model.ts
import  { model, models, Schema, Types } from "mongoose";
import { ChatInterface } from "./chat.interface";

const chatSchema = new Schema<ChatInterface>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    messages: [
      {
        type: Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

const ChatModel = models.Chat || model<ChatInterface>("Chat", chatSchema);

export default ChatModel