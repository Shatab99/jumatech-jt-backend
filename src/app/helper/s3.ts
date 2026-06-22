import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
    endpoint: process.env.SPACE_ENDPOINT,
    region: process.env.SPACE_REGION, 
    credentials: {
        accessKeyId: process.env.SPACE_ACCESS_KEY || "", 
        secretAccessKey: process.env.SPACE_SECRET_KEY || ""
    },
    forcePathStyle: true,
});