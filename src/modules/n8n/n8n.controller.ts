import { getFileFromS3, uploadFileToS3 } from "../../utils/s3";
import { catchError, tryError } from "../../utils/serverErrorhandler";
import { SessionInterface } from "../user/user.interface";
import { Response } from "express";
import axiosInstance from "../../utils/axios";
import FormData from "form-data";
import fs from "fs"
import ChatModel from "../chat/chat.model";
import MessageModel from "../message/message.model";
import mongoose from "mongoose";


export const sendToN8n = async (buffer: Buffer, prompt: string, fileName: string) => {
  const form = new FormData();

  form.append("prompt", prompt);

  // THIS IS FILE
  form.append("data", buffer, fileName);

  const res = await axiosInstance.post("/data_processing", form, {
    headers: {
      ...form.getHeaders(),
    },
  });

  return res.data;
};

export const dataPreProcessing = async (req: SessionInterface, res: Response) => {
  try {
    const { fileUrl, prompt, chatId } = req.body;
    const userId = req.session?.id;

    // ---------------- VALIDATION ----------------
    if (!fileUrl) throw tryError("fileUrl is required", 400);
    if (!prompt) throw tryError("prompt is required", 400);
    if (!chatId) throw tryError("ChatId is required.", 403);

    // ---------------- AUTH ----------------
    const chat = await ChatModel.findById(chatId);

    if (!chat || chat.userId.toString() !== userId?.toString()) {
      throw tryError("Unauthorized Access", 403);
    }

    // ---------------- S3 DOWNLOAD ----------------
    const key = fileUrl.split(".amazonaws.com/")[1];
    const buffer = await getFileFromS3(key);

    // ---------------- N8N PROCESS ----------------
    const result = await sendToN8n(
      buffer,
      prompt,
      key.split("/").pop() || "file.csv"
    );

    // ---------------- SAFE CSV EXTRACTION ----------------
    const csvData =
      typeof result === "string"
        ? result
        : result?.data || result?.output || result;

    if (!csvData || typeof csvData !== "string") {
      throw new Error("Invalid CSV data received from n8n");
    }

    // ---------------- MESSAGE ID (IMPORTANT FIX) ----------------
    const messageId = new mongoose.Types.ObjectId().toString();

    // ---------------- CLEAN S3 KEY ----------------
    const outputKey = `processed/${chatId}/${messageId}.csv`;

    // ---------------- UPLOAD TO S3 ----------------
    const uploadResult = await uploadFileToS3(
      outputKey,
      csvData,
      "text/csv"
    );

    // ---------------- SAVE MESSAGE ----------------
    const message = await MessageModel.create({
        role: "assistant",
      chatId,
      file: {
        fileName: outputKey.split("/").pop(),
        fileUrl: uploadResult.fileUrl,
      },
    });

    // ---------------- LINK CHAT ----------------
    await ChatModel.findByIdAndUpdate(chatId, {
      $push: { messages: message._id },
    });

    // ---------------- RESPONSE ----------------
    return res.json({
      success: true,
      message: "File processed and uploaded to S3 successfully",
      inputFile: fileUrl,
      outputFile: uploadResult.fileUrl,
      data: csvData,
    });

  } catch (error) {
    return catchError(error, res);
  }
};
