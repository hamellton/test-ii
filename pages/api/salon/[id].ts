import { NextApiResponse } from "next";
import { AuthorizedRequest, ErrorResponse, HTTPMethod } from "@utils/types";
import { authenticateMiddleware } from "@utils/authMiddleware";
import { getSalonById, getSalonsByHostId, approveSalonById, deleteSalonById, submitSalonById, getSeriesEpisodesForUser } from "@models/salon";
import { Salon } from "@prisma/client";
import { getAttendees } from "@utils/api-helpers";
import { emailSalonApproval, emailSalonConfirmation, notifyEvent } from "@services/email";
import { getUserById } from "@models/user";

const handleGetRequest = async (req: AuthorizedRequest, res: NextApiResponse<Salon | Salon[] | Array<string> | ErrorResponse>) => {
  // Check if the request is for all salons

  if (req.query.id === "all") {
    const salons = await getSalonsByHostId(req.userId);
    return res.status(200).json(salons);
  }

  if (req.query.id === "episodes") {
    const salons = await getSeriesEpisodesForUser(req.userId);
    return res.status(200).json(salons);
  }

  // Check for a specific salon by ID
  const salonId = req.query.id;
  if (!salonId || typeof salonId !== "string") {
    return res.status(400).json({ error: "Bad Request - ID is missing or invalid" });
  }

  const attendees = req.query.attendees as string;
  // Fetch and return tickets for the specified salon
  const salon = await getSalonById(salonId);
  if (salon) {
    if (attendees) {
      return res.status(200).json(await getAttendees(salon));
    }
    return res.status(200).json(salon);
  } else {
    return res.status(404).json({ error: "Salon not found" });
  }
};

const handleApproveRequest = async (req: AuthorizedRequest, res: NextApiResponse<Salon | ErrorResponse>) => {
  const salonId = req.query.id;
  if (!salonId || typeof salonId !== "string") {
    return res.status(400).json({ error: "Bad Request - ID is missing or invalid" });
  }
  try {
    // Approve the salon with the given ID
    const salon = await approveSalonById(salonId);

    if (salon) await emailSalonApproval(salonId, salon.hostId);
    
    res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error: JSON.stringify(error) });
  }
};

const handleDeleteRequest = async (req: AuthorizedRequest, res: NextApiResponse<Salon | ErrorResponse>) => {
  const salonId = req.query.id;
  if (!salonId || typeof salonId !== "string") {
    return res.status(400).json({ error: "Bad Request - ID is missing or invalid" });
  }
  try {
    const salon = await getSalonById(salonId);

    // Delete the salon with the given ID
    await deleteSalonById(salonId);

    if (salon) {
      const user = await getUserById(salon!.hostId);
      await notifyEvent(`salons/${salon!.slug}`, "deleted", {
        salonTitle: `${salon!.title}`,
        userName: user ? user.name : null,
      });
    }
    res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error: JSON.stringify(error) });
  }
};

const handleStatusChangeRequest = async (req: AuthorizedRequest, res: NextApiResponse<Salon | ErrorResponse>) => {
  const salonId = req.query.id;
  const userId = req.body.userId;
  if (!salonId || typeof salonId !== "string")
    return res.status(400).json({ error: "Bad Request - ID is missing or invalid" });

  try {
    const salon = await submitSalonById(salonId);

    const host = await getUserById(userId);


    if (userId) await emailSalonConfirmation(salon.id, host!.id);
      
    await notifyEvent(`salons/${salon.slug}`, "created");
    

    res.status(200).json(salon);
  } catch (error) {
    return res.status(500).json({ error: JSON.stringify(error) });
  }
};

const handler = async (req: AuthorizedRequest, res: NextApiResponse<Salon | Salon[] | Array<string> | ErrorResponse>) => {
  if (req.method === HTTPMethod.Get) {
    return handleGetRequest(req, res);
  } else if (req.method === HTTPMethod.Patch) {
    return handleApproveRequest(req, res);
  } else if (req.method === HTTPMethod.Delete) {
    return handleDeleteRequest(req, res);
  } else if (req.method === HTTPMethod.Put) {
    return handleStatusChangeRequest(req, res);
  }
  return res.status(405).json({ error: "Method Not Allowed" });
};

export default authenticateMiddleware(handler);
