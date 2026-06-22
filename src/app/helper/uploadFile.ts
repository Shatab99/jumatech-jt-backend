import multer from "multer";
import multerS3 from "multer-s3";
import { Request } from "express";
import { s3 } from "./s3";


// 1. Configure Multer to use S3 (Google Cloud)
const s3Storage = multerS3({
  s3: s3,
  bucket: process.env.SPACE_BUCKET || "",
  // IMPORTANT: Since you selected "Uniform" access, do NOT set 'acl: public-read' here.
  // Access is handled by the bucket permissions we set earlier.
  contentType: multerS3.AUTO_CONTENT_TYPE, // Auto-detects mime type (image/png, etc.)
  key: (req, file, cb) => {
    // Save files inside a 'media' folder in the bucket
    const uniqueName = `erp/media/${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// 2. File filter (Same as before)
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  cb(null, true); // allow all files
};

// 3. Upload config
const upload = multer({
  storage: s3Storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Optional: Limit to 5MB
});

// ✅ Generate public file URL
// Multer-S3 adds a 'location' property to the file object with the full URL
export const getImageUrl = async (file: Express.Multer.File, req: Request) => {
  if (!file) return null;
  // Use the S3 URL if available, otherwise fallback (failsafe)
  return (file as any).location || `https://storage.googleapis.com/${process.env.SPACE_BUCKET}/${file.filename}`;
};

export const getImageUrls = async (files: Express.Multer.File[], req: Request) => {
  if (!files || files.length === 0) return [];
  return files.map((file) => (file as any).location);
};

// ✅ Universal (dynamic fields + files)
export const createUploader = (fields: { name: string; maxCount: number }[]) => {
  return upload.fields(fields);
};

// ✅ Export like your structure
export const fileUploader = {
  upload,
  createUploader,
};