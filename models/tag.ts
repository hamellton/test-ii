import prisma from "@utils/db";
import { Tag } from "@prisma/client";

export const getAllTags = async (): Promise<Tag[]> => {
  return await prisma.tag.findMany({});
};

export const getActiveTags = async (): Promise<Tag[]> => {
  return await prisma.tag.findMany({
    where: {
      isActive: true,
    },
  });
};