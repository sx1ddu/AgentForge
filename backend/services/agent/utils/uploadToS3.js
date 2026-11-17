import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3.js";

// Local fallback cache if S3 is not configured
const inMemoryFileStore = new Map();

export const uploadToS3 = async (filename, buffer, contentType) => {
  const bucketName = process.env.AWS_BUCKET_NAME;

  if (bucketName && (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI)) {
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Body: buffer,
          Key: filename,
          ContentType: contentType,
        })
      );
      return filename;
    } catch (err) {
      console.warn("AWS S3 PutObject failed, using memory store fallback:", err.message);
    }
  }

  // Fallback: store buffer in local memory store
  inMemoryFileStore.set(filename, {
    buffer,
    contentType,
    createdAt: Date.now(),
  });

  return filename;
};

export { inMemoryFileStore };
