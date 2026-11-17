import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { inMemoryFileStore } from "./uploadToS3.js";

export const getFromS3 = async (fileName, expiresIn = 86400) => {
  const bucketName = process.env.AWS_BUCKET_NAME;

  if (bucketName && (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI)) {
    try {
      return await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: bucketName,
          Key: fileName,
        }),
        { expiresIn }
      );
    } catch (err) {
      console.warn("AWS S3 Presign failed, falling back to data URL:", err.message);
    }
  }

  // Fallback if S3 is unavailable: serve as base64 data URI
  const cached = inMemoryFileStore.get(fileName);
  if (cached) {
    const base64 = cached.buffer.toString("base64");
    return `data:${cached.contentType};base64,${base64}`;
  }

  return `https://placehold.co/600x400?text=${encodeURIComponent(fileName)}`;
};
