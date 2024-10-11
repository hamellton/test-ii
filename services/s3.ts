import { NextApiRequest, NextApiResponse } from "next";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { FileObject } from "@utils/types";

// Create S3 client
const s3Client = new S3Client({
  endpoint: process.env.S3_HOSTNAME,
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  region: process.env.S3_REGION, // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET as string
  }
});

export function runMiddleware(req: NextApiRequest & { [key: string]: any }, res: NextApiResponse, fn: (...args: any[]) => void): Promise<any> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export const uploadS3Image = async (file: FileObject, s3key: string) => {
  const key = Date.now().toString() + "-" + file.originalname;

  // Upload to S3
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${s3key}/${key}`, // Use the passed key
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read" as const
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `${process.env.S3_HOSTNAME}/${params.Bucket}/${params.Key}`;
  } catch (err) {
    throw { error: err, message: "Error Uploading to S3" };
  }
};


