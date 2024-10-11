import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@utils/db";
import { HostRequest } from "@prisma/client";

const createHostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, status, name } = req.body;

  try {
    const newHostRequest: HostRequest = await prisma.hostRequest.create({
      data: {
        email,
        status,
        name,
      },
    });
    res.status(200).json(newHostRequest);
  } catch (error) {
    console.error("Error creating HostRequest:", error);
    res.status(500).json({ error: "Failed to create HostRequest" });
  }
};

const getAllHostRequests = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const allHostRequests: HostRequest[] = await prisma.hostRequest.findMany();
    res.status(200).json(allHostRequests);
  } catch (error) {
    console.error("Error fetching HostRequests:", error);
    res.status(500).json({ error: "Failed to fetch HostRequests" });
  }
};

const deleteHostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid id parameter" });
  }
  
  try {
    const deletedHostRequest: HostRequest | null = await prisma.hostRequest.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(deletedHostRequest);
  } catch (error) {
    console.error("Error deleting HostRequest:", error);
    res.status(500).json({ error: "Failed to delete HostRequest" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    return createHostRequest(req, res);
  } else if (req.method === "GET") {
    return getAllHostRequests(req, res);
  } else if (req.method === "DELETE") {
    return deleteHostRequest(req, res);
  }
  
  return res.status(405).json({ error: "Method Not Allowed" });
};

export default handler;