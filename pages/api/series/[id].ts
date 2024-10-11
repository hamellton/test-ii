import { getSeriesById, getSeriesByHostId, deleteSeriesById, approveSeriesById, submitSeriesById } from "@models/series";
import { getSalonsBySeriesId } from "@models/salon";
import { authenticateMiddleware } from "@utils/authMiddleware";
import { AuthorizedRequest, ErrorResponse, ExtendedSalon, HTTPMethod } from "@utils/types";
import { Series } from "@prisma/client";
import { NextApiResponse } from "next";

const handleGetRequest = async (req: AuthorizedRequest, res: NextApiResponse<any | Series[] | Series | ExtendedSalon[] | ErrorResponse>) => {
  // Check if the request is for all series
  if (req.query.id === "all") {
    const series = await getSeriesByHostId(req.userId);
    return res.status(200).json(series);
  }

  // Check for a specific salon by ID
  const seriesId = req.query.id;
  if (!seriesId || typeof seriesId !== "string") {
    return res.status(400).json({ error: "Bad Request - ID is missing or invalid" });
  }
  const series = await getSeriesById(seriesId);
  if (series) {
    if (req.query.episodes) {
      const episodes = await getSalonsBySeriesId(seriesId);
      return res.status(200).json(episodes);
    }

    return res.status(200).json(series);
  } else {
    return res.status(404).json({ error: "Series not found!" });
  }
};

const handleDeleteRequest = async (req: AuthorizedRequest, res: NextApiResponse<Series | ErrorResponse>) => {
  const seriesId = req.query.id;
  if (!seriesId || typeof seriesId !== "string")
    return res.status(400).json({ error: "Bad Request - ID is missing or invalid" });
  try {
    // Delete the salon with the given ID
    await deleteSeriesById(seriesId);
    res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error: JSON.stringify(error) });
  }
};

const handleApproveRequest = async (req: AuthorizedRequest, res: NextApiResponse<any | ErrorResponse>) => {
  const seriesId = req.query.id;
  if (!seriesId || typeof seriesId !== "string") {
    return res.status(400).json({ error: "Bad Request - ID is missing or invalid" });
  }
  try {
    await approveSeriesById(seriesId);

    
    res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error: JSON.stringify(error) });
  }
};

const handleStatusChangeRequest = async (req: AuthorizedRequest, res: NextApiResponse<any | ErrorResponse>) => {
  const seriesId = req.query.id;
  // const userId = req.body.userId;
  if (!seriesId || typeof seriesId !== "string")
    return res.status(400).json({ error: "Bad Request - ID is missing or invalid" });

  try {
    const salon = await submitSeriesById(seriesId);

    // const host = await getUserById(userId);


      
    // await notifyEvent(`salons/${salon.slug}`, "created");
    

    res.status(200).json(salon);
  } catch (error) {
    return res.status(500).json({ error: JSON.stringify(error) });
  }
};

const handler = async (req: AuthorizedRequest, res: NextApiResponse<Series | Series[] | ErrorResponse>) => {
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
