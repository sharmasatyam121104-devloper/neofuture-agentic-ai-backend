import { catchError, tryError } from "../../utils/serverErrorhandler";
import { SessionInterface } from "../user/user.interface";
import { Response } from "express";
import ChatModel from "./chat.model";

export const createChat = async(req: SessionInterface, res: Response)=>{
    try {
        const userId = req.session?.id 
        if(!userId){
            throw tryError("UnAuthorised Access.", 403)
        }
        const chat = await ChatModel.create({userId})
        if(!chat){
            throw tryError("Chat not created.", 400)
        }

        return res.json(chat)
    } 
    catch (error) {
        return catchError(error, res)
    }
}


export const fetchChatById = async(req: SessionInterface, res: Response)=>{
    try {
        const userId = req.session?.id 
        if(!userId){
            throw tryError("UnAuthorised Access.", 403)
        }

        const chatId = req.params.chatId
        if(!chatId){
            throw tryError("ChatId is missing", 404)
        }

        const chat = await ChatModel.findById(chatId).populate("messages")

        if(!chat) {
            throw tryError("Chat not found", 404)
        }

        if (chat.userId.toString() !== userId.toString()){
            throw tryError("UnAuthorized Access,You are not craete this chat.", 403)
        }

       return res.json(chat)
    } 
    catch (error) {
        return catchError(error, res)
    }
}

export const fetchAllChat = async(req: SessionInterface, res: Response)=>{
    try {
        const userId = req.session?.id 
        if(!userId){
            throw tryError("UnAuthorised Access.", 403)
        }

        const chats = await ChatModel.find({userId}).populate("messages")
        if (chats.length === 0){
            throw tryError("Chats not found", 404)
        }

        return res.json(chats)
    } 
    catch (error) {
        return catchError(error, res)    
    }
}