import { Types } from "mongoose";

export interface MessageInterface {
    chatId: Types.ObjectId
    role: "user" | "assistant";

    prompt?: string; // only for user

    file?: {
        fileName: string;
        fileUrl: string;
    };

    createdAt?: Date;
    updatedAt?: Date;
}