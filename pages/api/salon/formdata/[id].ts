import { NextApiResponse } from "next";
import { AuthorizedRequest, ErrorResponse, FileObject, HTTPMethod, ZoomMeetingResponse } from "@utils/types";
import { authenticateMiddleware } from "@utils/authMiddleware";
import { createZoomMeeting, deleteZoomMeeting, updateZoomMeeting } from "@services/zoom";
import multer from "multer";
import { runMiddleware, uploadS3Image } from "@services/s3";
import { validateSalonPostObject, getDuration, createSalonBody } from "@utils/api-helpers";
import { createSalon, editSalon, getSalonChangedFields, getSalonById } from "@models/salon";
import { getUserById } from "@models/user";
import { LOCATION_TYPE, Salon } from "@prisma/client";
import { emailSalonConfirmation, notifyEvent } from "@services/email";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handlePostRequest = async (req: AuthorizedRequest, res: NextApiResponse): Promise<void> => {
  // Run middleware to get formData including the file
  const storage = multer.memoryStorage();
  const multerUpload = multer({ storage: storage });
  await runMiddleware(req, res, multerUpload.single("file"));
  const file = req.file;
  const isDraft = req.body.isDraft === "true" ? true : false;
  const recordEvent = req.body.recordEvent === "true";

  // Ensure that all fields are present
  const salonBody = createSalonBody(req);

  const validation = await validateSalonPostObject(salonBody);
  if (!validation.valid && validation.error) {
    console.log("validation error", validation.error);
    return res.status(400).json(validation.error);
  }

  // Create S3 Image
  let s3: string;
  try {
    s3 = await uploadS3Image(file as FileObject, process.env.S3_SALON_KEY!);
    console.log("S3 succeeded:", s3);
  } catch (error) {
    console.log("S3 error:", error);
    return res.status(500).json("Error uploading to S3");
  }

  // Create Zoom Meeting
  let zoomMeeting: ZoomMeetingResponse | undefined;
  try {
    zoomMeeting = salonBody.locationType === LOCATION_TYPE.VIRTUAL ? await createZoomMeeting({
      name: salonBody.title,
      description: salonBody.description,
      // Zoom Meeting API is weird, needed an extra hour added to UTC time to make it work
      startTime: new Date(new Date(req.body.startTime).getTime() + 3600000),
      duration: getDuration(req.body.startTime, req.body.endTime),
      settings: recordEvent ? { auto_recording: "local" } : {} // "cloud" for recording in the cloud
    }) : undefined;
    console.log("Zoom meeting id: ", zoomMeeting?.id);
  } catch (error) {
    console.log("Zoom error:", error);
    return res.status(500).json("Error creating Zoom meeting");
  }

  try {
    // Get Host Id
    const host = await getUserById(req.userId);
    // Save Salon to DB
    const salon = await createSalon({...salonBody, stripeConnectedAccountId: host?.stripeConnectedAccountId || undefined }, s3, zoomMeeting!, host!.id, isDraft);

    if (!isDraft) {
      await emailSalonConfirmation(salon.id, host!.id);
      await notifyEvent(`salons/${salon.slug}`, "created");
    }

    res.status(201).json(salon);
  } catch (error) {
    return res.status(500).json({ error: JSON.stringify(error) });
  }
};

const handlePatchRequest = async (req: AuthorizedRequest, res: NextApiResponse<Salon | ErrorResponse>) => {
  const salonId = req.query.id;
  if (!salonId || typeof salonId !== "string")
    return res.status(400).json({ error: "Bad Request - ID is missing or invalid" });
  // Run middleware to get formData including the file
  const storage = multer.memoryStorage();
  const multerUpload = multer({ storage: storage, limits: {
    fileSize: 5 * 1024 * 1024,
    fields: 100,
    fieldSize: 10 * 1024 * 1024
  } });
  await runMiddleware(req, res, multerUpload.single("file"));
  const fileChanged = req.body.fileChanged === "true" ? true : false;
  const file = fileChanged && req.file ? req.file : null;
  const isDraft = req.body.isDraft === "true" ? true : false;
  const recordEvent = req.body.recordEvent === "true" ? true : false;

  const salonBody = createSalonBody(req);
  // S3
  let s3: string | undefined = undefined;

  if (file) {
    try {
      s3 = await uploadS3Image(file as FileObject, process.env.S3_SALON_KEY!);
      console.log("S3 succeeded:", s3);
    } catch (error) {
      console.log("S3 error:", error);
      return res.status(500).json({ error: JSON.stringify(error) });
    }
  }

  const prevSalonData = await getSalonById(salonId);

  // Zoom
  if (salonBody.locationType === LOCATION_TYPE.IRL && prevSalonData && prevSalonData.zoomStartUrl) {
    try {
      const deleteZoomMeet = await deleteZoomMeeting(prevSalonData.zoomId!);
      console.log("🚀 ~ handlePatchRequest 113 ~ deleteZoomMeet:", deleteZoomMeet);
      salonBody.zoomId = null;
      salonBody.zoomStartUrl = null;
      salonBody.zoomJoinUrl = null;
      console.log("🚀 ~ handlePatchRequest 116 ~ salonBody:", salonBody);
    } catch (error) {
      console.log("🚀 ~ Error deleting Zoom meeting:", error);
      return res.status(500).json({ error: JSON.stringify(error) });
    }
  }

  // Zoom
  if (salonBody.locationType === LOCATION_TYPE.VIRTUAL && prevSalonData && prevSalonData.locationType === LOCATION_TYPE.VIRTUAL) {
    try {
      await updateZoomMeeting(salonId, {
        name: salonBody.title,
        description: salonBody.description,
        startTime: new Date(new Date(req.body.startTime).getTime() + 3600000),
        duration: getDuration(req.body.startTime, req.body.endTime),
        settings: recordEvent ? { auto_recording: "local" } : {} // "cloud" for recording in the cloud
      });
    } catch (error) {
      console.log("Error creating Zoom meeting: ", error);
      return res.status(500).json({ error: JSON.stringify(error) });
    }
  }

  // Zoom
  if (salonBody.locationType === LOCATION_TYPE.VIRTUAL && prevSalonData && prevSalonData.locationType === LOCATION_TYPE.IRL) {
    // Create Zoom Meeting
    let zoomMeeting: ZoomMeetingResponse | undefined;
    try {
      zoomMeeting = salonBody.locationType === LOCATION_TYPE.VIRTUAL ? await createZoomMeeting({
        name: salonBody.title,
        description: salonBody.description,
        // Zoom Meeting API is weird, needed an extra hour added to UTC time to make it work
        startTime: new Date(new Date(req.body.startTime).getTime() + 3600000),
        duration: getDuration(req.body.startTime, req.body.endTime),
        settings: recordEvent ? { auto_recording: "local" } : {} // "cloud" for recording in the cloud
      }) : undefined;
      console.log("🚀 153 ~ handlePatchRequest ~ zoomMeeting?.id:", zoomMeeting?.id);
    } catch (error) {
      console.log("🚀 155 Zoom error:", error);
      return res.status(500).json({ error: JSON.stringify(error) });
    }

    if (zoomMeeting) {
      console.log("🚀 160 ~ handlePatchRequest ~ zoomMeeting:", zoomMeeting);
      salonBody.zoomId = zoomMeeting?.id.toString();
      salonBody.zoomStartUrl = zoomMeeting?.start_url;
      salonBody.zoomJoinUrl = zoomMeeting?.join_url;
      salonBody.locationUrl = null;
    }
  }

  // Save to DB
  try {
    // const { title, file, ...restOfSalonBody } = salonBody;
    const { ...restOfSalonBody } = salonBody;
    const intermediateSalonBody = s3 ? { ...restOfSalonBody, imageUrl: s3 } : restOfSalonBody;
    const salonEditBody = Object.fromEntries(
      Object.entries(intermediateSalonBody).filter(([_, value]) => value !== undefined)
    );
    salonEditBody.recordEvent = salonEditBody.recordEvent === "true" ? true : false;
    // Compare and get changed fields
    const changes = getSalonChangedFields(prevSalonData, salonEditBody);
    const salon = await editSalon(salonId, isDraft, salonEditBody);
    const user = await getUserById(salon!.hostId);
    await notifyEvent(`salons/${salon!.slug}`, "edited", {
      salonTitle: `${salon!.title}`,
      changes,
      userName: user ? user.name : null,
    });
    
    res.status(201).json(salon!);
  } catch (error) {
    return res.status(500).json({ error: JSON.stringify(error) });
  }
};

const handler = async (req: AuthorizedRequest, res: NextApiResponse<Salon | Salon[] | ErrorResponse>) => {
  if (req.method === HTTPMethod.Post) {
    return handlePostRequest(req, res);
  } else if (req.method === HTTPMethod.Patch) {
    return handlePatchRequest(req, res);
  }
  return res.status(405).json({ error: "Method Not Allowed" });
};

export default authenticateMiddleware(handler);
