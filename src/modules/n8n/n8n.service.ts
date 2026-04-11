import mongoose from "mongoose";
import FormData from "form-data";
import axiosInstance from "../../utils/axios";
import { getFileFromS3, uploadFileToS3 } from "../../utils/s3";
import ChatModel from "../chat/chat.model";
import MessageModel from "../message/message.model";
import { tryError } from "../../utils/serverErrorhandler";
import { SessionInterface } from "../user/user.interface";


// ---------------- ENDPOINT MAP ----------------
const N8N_ENDPOINTS = {
  "data-processing": "/data-processing",
  "model-generation": "/model-generation",
  "data-visualization": "/data-visualization",
  "ai-suggestion": "/ai-suggestion",
} as const;


// ---------------- SEND TO N8N ----------------
export const sendToN8n = async (
  buffer: Buffer,
  prompt: string,
  fileName: string,
  endpoint: string
) => {
  const form = new FormData();

  form.append("prompt", prompt);
  form.append("data", buffer, fileName);

  const res = await axiosInstance.post(endpoint, form, {
    headers: {
      ...form.getHeaders(),
    },
  });

  return res.data;
};


// ---------------- MAIN PROCESS FUNCTION ----------------
export const processN8nJob = async (
  req: SessionInterface,
  type: keyof typeof N8N_ENDPOINTS
) => {
  const { fileUrl, prompt, chatId } = req.body;
  const userId = req.session?.id;

  // ---------------- VALIDATION ----------------
  if (!fileUrl) throw tryError("fileUrl is required", 400);
  if (!prompt) throw tryError("prompt is required", 400);
  if (!chatId) throw tryError("chatId is required", 400);

  // ---------------- AUTH CHECK ----------------
  const chat = await ChatModel.findById(chatId);

  if (!chat || chat.userId.toString() !== userId?.toString()) {
    throw tryError("Unauthorized Access", 403);
  }

  // ---------------- GET ENDPOINT ----------------
  const endpoint = N8N_ENDPOINTS[type];

  if (!endpoint) {
    throw new Error("Invalid N8N type");
  }

  // ---------------- DOWNLOAD FROM S3 ----------------
  const key = fileUrl.split(".amazonaws.com/")[1];
  const buffer = await getFileFromS3(key);

  // ---------------- CALL N8N ----------------
  const result = await sendToN8n(
    buffer,
    prompt,
    key.split("/").pop() || "file.csv",
    endpoint
  );

  // ---------------- CLEAN RESPONSE ----------------
  const csvData =
    typeof result === "string"
      ? result
      : result?.data || result?.output || result;

  if (!csvData || typeof csvData !== "string") {
    throw new Error("Invalid response received from n8n");
  }

  // ---------------- SAVE FILE TO S3 ----------------
  const messageId = new mongoose.Types.ObjectId().toString();
  const outputKey = `${type}/${chatId}/${messageId}.csv`;

  const uploadResult = await uploadFileToS3(
    outputKey,
    csvData,
    "text/csv"
  );

  // ---------------- SAVE MESSAGE ----------------
  const message = await MessageModel.create({
    role: "assistant",
    chatId,
    type,
    file: {
      fileName: outputKey.split("/").pop(),
      fileUrl: uploadResult.fileUrl,
    },
  });

  await ChatModel.findByIdAndUpdate(chatId, {
    $push: { messages: message._id },
  });

  // ---------------- RESPONSE ----------------
  return {
    type,
    inputFile: fileUrl,
    outputFile: uploadResult.fileUrl,
    data: csvData,
  };
};