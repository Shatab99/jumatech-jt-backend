import path from "path";
import fs from "fs/promises";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3";


const deleteUploadImage = async (imagePath: string): Promise<boolean> => {
    try {
        const fullPath = path.join(__dirname, "../../../uploads", imagePath);
        console.log("Full path:", fullPath); // Debugging
        await fs.unlink(fullPath);
        return true; // Indicate success
    } catch (err) {
        console.error(`Error deleting file ${imagePath}:`, err);
        return false; // Throw the error so it can be caught where the function is called
    }
};

const extractS3KeyFromUrl = (url: string): string => {
    try {
        // Extract the path after the domain
        // URL format: https://nyc3.digitaloceanspaces.com/baafa/media/1775700515708-banner.jpeg
        // We need to extract: baafa/media/1775700515708-banner.jpeg
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        // Remove leading slash
        return pathname.startsWith('/') ? pathname.slice(1) : pathname;
    } catch (err) {
        console.error("Error extracting S3 key from URL:", err);
        return "";
    }
};

const deleteS3Images = async (mediaUrls: string[]): Promise<boolean> => {
    if (!mediaUrls || !Array.isArray(mediaUrls) || mediaUrls.length === 0) {
        console.warn("No media URLs provided");
        return false;
    }

    try {
        // Extract S3 keys from URLs
        const s3Keys = mediaUrls.map(url => extractS3KeyFromUrl(url)).filter(key => key);

        if (s3Keys.length === 0) {
            console.warn("No valid S3 keys extracted from provided URLs");
            return false;
        }

        // Delete all objects in parallel
        const deletePromises = s3Keys.map(key =>
            s3.send(new DeleteObjectCommand({
                Bucket: process.env.DO_SPACE_BUCKET,
                Key: key,
            }))
        );

        await Promise.all(deletePromises);
        console.log(`Successfully deleted ${s3Keys.length} media files from S3`);
        return true;
    } catch (err) {
        console.error("Error deleting multiple S3 images:", err);
        return false;
    }
};

const deleteS3Image = async (mediaUrl: string) => {
    if (!mediaUrl) {
        console.warn("No media URL provided");
        return false;
    }

    try {
        const s3Key = extractS3KeyFromUrl(mediaUrl);
        if (!s3Key) {
            console.warn("Failed to extract S3 key from URL");
            return false;
        }

        await s3.send(new DeleteObjectCommand({
            Bucket: process.env.DO_SPACE_BUCKET,
            Key: s3Key,
        }));

        console.log(`Successfully deleted media file from S3: ${s3Key}`);
        return true;
    } catch (err) {
        console.error("Error deleting S3 image:", err);
        return false;
    }
};


export const deleteFile = { deleteUploadImage, deleteS3Image, deleteS3Images }
