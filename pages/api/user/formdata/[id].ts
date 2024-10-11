import { NextApiResponse } from "next";
import { createHostProfile } from "@models/user";
import { AuthorizedRequest, ErrorResponse, FileObject, HTTPMethod, S3ErrorResponse } from "@utils/types";
import { authenticateMiddleware } from "@utils/authMiddleware";
import { runMiddleware, uploadS3Image } from "@services/s3";
import { User } from "@prisma/client";
import multer from "multer";
import { notifyEvent } from "@services/email";
import { updateMemberInfo } from "@services/memberful";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handlePatchRequest = async (req: AuthorizedRequest, res: NextApiResponse<User | ErrorResponse>) => {
  const userId = req.query.id;
  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Bad Request - ID is missing or invalid" });
  }
  // Non Admin user will only edit their own info, admin user can edit the info for the email in the query param
  const param = req.isAdmin ? userId : req.userId;

  // Run middleware to get formData including the file
  const storage = multer.memoryStorage();
  const multerUpload = multer({ storage: storage });
  await runMiddleware(req, res, multerUpload.single("file"));
  const file = req.file;

  const userBody: Partial<User> = {
    fullname: req.body.name,
    bio: req.body.bio,
    quote: req.body.quote,
    profileImageUrl: req.body.file,
    webLink: req.body.webLink ? req.body.webLink : undefined,
    xLink: req.body.xLink ? req.body.xLink : undefined,
    instaLink: req.body.instaLink ? req.body.instaLink : undefined,
    substackLink: req.body.substackLink ? req.body.substackLink : undefined,
  };

  let s3: string | null = null;
  try {
    if (file) {
      try {
        // Create S3 Image 
        s3 = await uploadS3Image(file as FileObject, process.env.S3_HOST_KEY!);
        console.log("S3 succeeded:", s3);
      } catch (error) {
        console.error("S3 failed:", error);
        return res.status(500).json({ error: (error as S3ErrorResponse).message });
      }
    }

    // Conditionally add profileImageUrl if s3 is not null
    if (s3) {
      userBody.profileImageUrl = s3;
    }

    const user = await createHostProfile(param, userBody);
    await notifyEvent(`hosts/${user!.slug}`, "edited");
    
    if (user && user.memberfulId && user.fullname) {
      await updateMemberInfo(user.memberfulId, user.fullname);
    }

    return res.status(201).json(user!);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: JSON.stringify(error) });
  }
};

const handler = async (req: AuthorizedRequest, res: NextApiResponse<User | ErrorResponse>) => {
  if (req.method === HTTPMethod.Patch) {
    return handlePatchRequest(req, res);
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default authenticateMiddleware(handler);

