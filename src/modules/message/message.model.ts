// message.model.ts
import  { model, models, Schema, Types } from "mongoose";
import { MessageInterface } from "./message.interface";

const messageSchema = new Schema<MessageInterface>(
  {
    chatId: {
      type: Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    // user ke liye
    prompt: {
      type: String,
    },

    // file (user ya assistant dono ke liye)
    file: {
      fileName: {
        type: String,
      },
      fileUrl: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const MessageModel = models.Message || model<MessageInterface>("Message", messageSchema);

export default MessageModel

