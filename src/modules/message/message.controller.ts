import { catchError, tryError } from "../../utils/serverErrorhandler";
import ChatModel from "../chat/chat.model";
import { SessionInterface } from "../user/user.interface";
import { Response } from "express";
import MessageModel from "./message.model";
import { getUploadSignedUrl } from "../../utils/s3";

export const getUploadSignedUrlForSendMessageInChat = async (req: SessionInterface,res: Response) => {
  try {
    const userId = req.session?.id;
    const chatId = req.params.chatId;

    if (!chatId) {
      throw tryError("ChatId is required.", 403);
    }

    const chat = await ChatModel.findById(chatId);

    if (!chat || chat.userId.toString() !== userId?.toString()) {
      throw tryError("Unauthorized Access", 403);
    }

    const { role, prompt, fileName, fileType } = req.body;

    // 1. create message first
    const message = await MessageModel.create({
      chatId,
      role,
      prompt,
    });

    // 2. generate S3 signed URL
    const result = await getUploadSignedUrl(
      chatId.toString(),
      message._id.toString(),
      fileType,
      fileName
    );

    return res.json({
      messageId: message._id,
      uploadUrl: result.uploadUrl,
      fileUrl: result.fileUrl,
      key: result.key,
    });
  } 
  catch (error) {
    return catchError(error, res);
  }
};

export const sendMessageInChat = async (req: SessionInterface, res: Response) => {
  try {
    const userId = req.session?.id;
    const chatId = req.params.chatId;

    if (!chatId) {
      throw tryError("ChatId is required.", 403);
    }

    const chat = await ChatModel.findById(chatId);

    if (!chat || chat.userId.toString() !== userId?.toString()) {
      throw tryError("Unauthorized Access", 403);
    }

    const { messageId, fileUrl, fileName } = req.body;

    const message = await MessageModel.findByIdAndUpdate(
      messageId,
      {
        file: fileUrl
          ? {
              fileName,
              fileUrl,
            }
          : undefined,
      },
      { new: true }
    );

    await ChatModel.findByIdAndUpdate(chatId, {
      $push: { messages: messageId },
    });

    return res.json({
      message: "Message updated successfully",
      data: message,
      chatId
    });
  } 
  catch (error) {
    return catchError(error, res);
  }
};



export const deleteMessageById = async (req: SessionInterface, res: Response) => {
  try {
    const userId = req.session?.id;
    const { messageId } = req.params;

    if (!messageId) {
      throw tryError("MessageId is required.", 403);
    }

    // 1. Find message
    const message = await MessageModel.findById(messageId);

    if (!message) {
      throw tryError("Message not found.", 404);
    }

    const chatId = message.chatId;

    // 2. Find chat
    const chat = await ChatModel.findById(chatId);

    if (!chat) {
      throw tryError("Chat not found.", 404);
    }

    // 3. Authorization check
    if (chat.userId.toString() !== userId?.toString()) {
      throw tryError(
        "Unauthorized Access. You are not owner of this chat.",
        403
      );
    }

    // 4. Delete message
    await MessageModel.findByIdAndDelete(messageId);

    // 5. Remove from chat.messages array
    await ChatModel.findByIdAndUpdate(chatId, {
      $pull: { messages: messageId },
    });

    return res.json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    return catchError(error, res);
  }
};