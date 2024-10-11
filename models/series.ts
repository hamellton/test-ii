import prisma from "@utils/db";
import slugify from "slugify";
import { slugifyOptions } from "@config";
import { SeriesPostObject, SeriesEditBody } from "@utils/types";
import { Series, SERIES_STATE } from "@prisma/client";
import { createProductAndPriceInConnectedAccount } from "@services/stripe";

export const getSeriesById = async (seriesId: string): Promise<Series | null> => {
  return await prisma.series.findUnique({
    where: {
      id: seriesId
    },
    include: {
      tags: true
    },
  });
};

export const createSeries = async (seriesPostBody: SeriesPostObject, imageUrl: string, hostId: string): Promise<Series> => {
  const slug = slugify(seriesPostBody.title, slugifyOptions);

  if (seriesPostBody.stripeConnectedAccountId) {
    await createProductAndPriceInConnectedAccount(
      seriesPostBody.title,
      0,
      seriesPostBody.stripeConnectedAccountId
    );
  }

  return await prisma.series.create({
    data: {
      title: seriesPostBody.title,
      description: seriesPostBody.description,
      imageUrl: imageUrl,
      state: seriesPostBody.isDraft ? SERIES_STATE.DRAFT : SERIES_STATE.SUBMITTED,
      slug: slug,
      host: {
        connect: {
          id: hostId
        }
      },
      ...(seriesPostBody.tags && seriesPostBody.tags.length > 0 && {
        tags: {
          connect: seriesPostBody.tags.map((tag) => ({ id: tag.id })),
        },
      }),
    }
  });
};

export const editSeries = async (id: string, data: SeriesEditBody, isDraft: boolean): Promise<Series | null> => {
  return await prisma.series.update({
    where: {
      id: id
    },
    data: {
      ...data,
      state: isDraft ? SERIES_STATE.DRAFT : SERIES_STATE.SUBMITTED,
      tags: data.tags ? { set: data.tags.map(tag => ({ id: tag.id })) } : undefined,
    },
  });
};

export const getSeriesByHostId = async (hostId: string): Promise<Series[]> => {
  return await prisma.series.findMany({
    where: {
      hostId: hostId
    }
  });
};

export const deleteSeriesById = async (seriesId: string): Promise<void> => {
  await prisma.series.delete({
    where: {
      id: seriesId
    }
  });
};

export const checkSeriesWithSlug = async (slug: string): Promise<boolean> => {
  const series = await prisma.series.findUnique({
    where: {
      slug: slug,
    },
  });
  return series ? true : false;
};

export const getSeriesBySlug = async (slug: string): Promise<Series | null> => {
  return await prisma.series.findUnique({
    where: {
      slug: slug
    },
    include: {
      tags: true,
      salons: {
        include: {
          host: true,
          publicTickets: true
        }
      },
      host: true,
    },
  });
};

export const getAllSeries = async (): Promise<Series[]> => {
  return await prisma.series.findMany();
};

export const approveSeriesById = async (id: string): Promise<any> => {
  return await prisma.series.update({
    where: { id },
    data: { state: SERIES_STATE.APPROVED },
  });
};

export const submitSeriesById = async (id: string): Promise<any> => {
  return await prisma.series.update({
    where: { id },
    data: { state: SERIES_STATE.SUBMITTED },
  });
};