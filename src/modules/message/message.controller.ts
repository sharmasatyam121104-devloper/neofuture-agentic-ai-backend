import { catchError, tryError } from "../../utils/serverErrorhandler";
import ChatModel from "../chat/chat.model";
import { SessionInterface } from "../user/user.interface";
import { Response } from "express";
import MessageModel from "./message.model";

export const sendMessageInChat = async(req: SessionInterface, res: Response)=>{
    try {
        const userId = req.session?.id
        const chatId = req.params.chatId
        if(!chatId){
            throw tryError("ChatId is required.", 403)
        }

        const chat = await ChatModel.findById(chatId)

        if (chat.userId.toString() !== userId?.toString()){
            throw tryError("UnAuthorized Access,You are not craete this chat.", 403)
        }

        const body = req.body
        const {role, prompt, fileName, fileUrl} = body

        const messageDataPayLoad = {
            chatId,
            role,
            prompt,
            file: {
                fileName,
                fileUrl,
            }
        }
        
        const message = await MessageModel.create(messageDataPayLoad)
        if(!message){
            throw tryError("Message not created.", 400)
        }

        await ChatModel.findByIdAndUpdate(chatId, {
            $push: { messages: message._id },
        });

        return res.json({message: "message send successfully."})

    } 
    catch (error) {
        return catchError(error, res)    
    }
}



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