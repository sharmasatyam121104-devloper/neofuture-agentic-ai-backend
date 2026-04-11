import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

const BUCKET = process.env.AWS_BUCKET_NAME!;

//  Upload Signed URL
export const getUploadSignedUrl = async (
  chatId: string,
  messageId: string,
  fileType: string,
  fileName: string
) => {
  const key = `uploads/${chatId}/${messageId}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: fileType,
  });

  const url = await getSignedUrl(s3, command, {
    expiresIn: 120,
  });

  return {
    uploadUrl: url,
    fileUrl: `https://${BUCKET}.s3.amazonaws.com/${key}`,
    key,
  };
};

//Download Signed URL (fixed)
export const getDownloadSignedUrl = async (key: string) => {
  if (!key.startsWith("uploads/")) {
    throw new Error("Invalid file path");
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  const url = await getSignedUrl(s3, command, {
    expiresIn: 60,
  });

  return {
    downloadUrl: url,
  };
};


export const getFileFromS3 = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  const response = await s3.send(command);

  const streamToBuffer = async (stream: any) =>
    new Promise<Buffer>((resolve, reject) => {
      const chunks: any[] = [];
      stream.on("data", (chunk: any) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });

  const fileBuffer = await streamToBuffer(response.Body);

  return fileBuffer;
};


export const uploadFileToS3 = async (key: string,body: Buffer | string,contentType: string = "text/csv") => {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3.send(command);

  return {
    fileUrl: `https://${BUCKET}.s3.amazonaws.com/${key}`,
    key,
  };
};