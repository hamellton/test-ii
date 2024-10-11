import { ErrorResponse, HTTPMethod } from "@utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getActiveTags } from "@models/tag";
import { Tag } from "@prisma/client";

const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse<Tag[] | ErrorResponse>) => {
  // const tags = await getAllTags();
  const tags = await getActiveTags();
  if (tags) {
    return res.status(200).json(tags);
  } else {
    return res.status(404).json({ error: "Tags not found" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Tag[] | ErrorResponse>) => {
  if (req.method === HTTPMethod.Get) {
    return handleGetRequest(req, res);
  }
  else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default handler;
