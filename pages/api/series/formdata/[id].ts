import { createSeries, editSeries } from "@models/series";
import { getUserById } from "@models/user";
import { validateSeriesPostObject, createSeriesBody } from "@utils/api-helpers";
import { AuthorizedRequest, ErrorResponse, FileObject, HTTPMethod, SeriesEditBody, SeriesPostObject } from "@utils/types";
import { NextApiResponse } from "next";
import { authenticateMiddleware } from "@utils/authMiddleware";
import multer from "multer";
import { runMiddleware, uploadS3Image } from "@services/s3";
import { Series } from "@prisma/client";
import { notifyEvent } from "@services/email";

export const config = {
  api: {
    bodyParser: false,
  },
};


const handlePatchRequest = async (req: AuthorizedRequest, res: NextApiResponse): Promise<void> => {
  const seriesId = req.query.id;
  if (!seriesId || typeof seriesId !== "string")
    return res.status(400).json({ error: "Bad Request - ID is missing or invalid" });
  // Run middleware to get formData including the file
  const storage = multer.memoryStorage();
  const multerUpload = multer({ storage: storage });
  await runMiddleware(req, res, multerUpload.single("file"));
  const file = req.file;
  const isDraft = req.body.isDraft === "true" ? true : false;

  const seriesEditBody: SeriesEditBody = {
    description: req.body.description,
    tags: req.body.tags ? JSON.parse(req.body.tags) : undefined,
  };

  let s3: string | undefined;
  if (req.file) {
    try {
      s3 = await uploadS3Image(file as FileObject, process.env.S3_SALON_KEY!);
      console.log("S3 succeeded:", s3);
    } catch (error) {
      console.log("S3 error:", error);
      return res.status(500).json({ error: JSON.stringify(error) });
    }
  }
  if (s3) {
    seriesEditBody.imageUrl = s3;
  }

  try {
    const series = await editSeries(seriesId, seriesEditBody, isDraft);
    await notifyEvent(`series/${series!.slug}`, "edited");
    res.status(201).json(series);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: JSON.stringify(error) });
  }
};

const handlePostRequest = async (req: AuthorizedRequest, res: NextApiResponse): Promise<void> => {
  // Run middleware to get formData including the file
  const storage = multer.memoryStorage();
  const multerUpload = multer({ storage: storage });
  await runMiddleware(req, res, multerUpload.single("file"));
  const file = req.file;
  const isDraft = req.body.isDraft === "true" ? true : false;
  req.body.isDraft = isDraft;

  // Ensure that all fields are present
  const seriesBody: SeriesPostObject = createSeriesBody(req);

  const validation = await validateSeriesPostObject(seriesBody);
  if (!validation.valid && validation.error) {
    console.log("validation error", validation.error);
    return res.status(400).json(validation.error);
  }

  let s3: string;
  try {
    s3 = await uploadS3Image(file as FileObject, process.env.S3_SALON_KEY!);
    console.log("S3 succeeded:", s3);
  } catch (error) {
    console.log("S3 error:", error);
    return res.status(500).json("Error uploading to S3");
  }

  try {
    // Get Host Id
    const host = await getUserById(req.userId);

    // Save Series to DB
    const series = await createSeries({...seriesBody, stripeConnectedAccountId: host?.stripeConnectedAccountId || undefined }, s3, host!.id);
    await notifyEvent(`series/${series!.slug}`, "created");
    res.status(201).json(series);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: JSON.stringify(error) });
  }
};

const handler = async (req: AuthorizedRequest, res: NextApiResponse<Series | ErrorResponse>) => {
  if (req.method === HTTPMethod.Post) {
    return handlePostRequest(req, res);
  } else if (req.method === HTTPMethod.Patch) {
    return handlePatchRequest(req, res);
  }
  return res.status(405).json({ error: "Method Not Allowed" });
};

export default authenticateMiddleware(handler);
