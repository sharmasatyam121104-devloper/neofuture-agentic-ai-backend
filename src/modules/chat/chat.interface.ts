// chat.interface.ts
import { Document, Types } from "mongoose";
import { MessageInterface } from "../message/message.interface";

export interface ChatInterface extends Document {
  userId: Types.ObjectId;

  messages: MessageInterface[];

  createdAt: Date;
  updatedAt: Date;
}