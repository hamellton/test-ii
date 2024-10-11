import prisma from "@utils/db";
import { SalonPostObject, ZoomMeetingResponse, SalonEditBody, ExtendedSalon, GroupedSalons } from "@utils/types";
import slugify from "slugify";
import { slugifyOptions } from "@config";
import { Prisma, SALON_STATE, SALON_TYPE, SERIES_STATE, Salon } from "@prisma/client";
import Fuse from "fuse.js";
import { groupSalonsByYearAndMonth } from "@utils/api-helpers";
import { createProductAndPriceInConnectedAccount } from "@services/stripe";
import isEqual from "lodash/isEqual";

export const getSalonById = async (id: string): Promise<ExtendedSalon | null> => {
  const salon = await prisma.salon.findUnique({
    where: {
      id: id,
    },
    include: {
      coHosts: true,
      tags: true,
      publicTickets: true,
      memberTickets: true,
      specialGuests: true
    }
  });
  return salon || null; // Return null if user is not found
};

export const salonFuzzySearch = async (searchTerm: string): Promise<GroupedSalons> => {
  // Options for Fuse search
  const options = {
    includeScore: true, // This is optional
    // Add more options here as needed, such as keys to search in
    keys: ["title", "description"], // Define which properties of the salon objects you want to search
    threshold: 0.4, // Adjust this threshold to make the search stricter or more lenient
  };

  // Initialize Fuse with the salons data and options
  const salons = await prisma.salon.findMany({
    where: {
      state: SALON_STATE.APPROVED,
    },
    include: {
      coHosts: true,
      tags: true,
      publicTickets: true,
      memberTickets: true,
      specialGuests: true
    },
    orderBy: {
      startTime: "asc",
    },
  });
  const fuse = new Fuse(salons, options);

  // Perform the search
  const result = fuse.search(searchTerm);

  // Extract the matched salon objects and limit to 12 items
  const matchedSalons = result.slice(0, 12).map(item => item.item);
  return groupSalonsByYearAndMonth(matchedSalons);
};

export const getSalonsAroundId = async (salonId: string, direction: "newer" | "older"): Promise<GroupedSalons> => {
  const targetSalon = await prisma.salon.findUnique({
    where: { id: salonId },
    include: {
      coHosts: true,
      tags: true,
      publicTickets: true,
      memberTickets: true,
      specialGuests: true
    },
  });

  if (!targetSalon) {
    throw new Error("Salon not found");
  }

  const allSalons = await prisma.salon.findMany({
    where: {
      state: SALON_STATE.APPROVED
    },
    include: {
      coHosts: true,
      tags: true,
      publicTickets: true,
      memberTickets: true,
      specialGuests: true
    },
    orderBy: {
      startTime: "asc",
    },
  });

  const index = allSalons.findIndex(salon => salon.id === salonId);

  let startIndex;
  let endIndex;

  if (direction === "newer") {
    startIndex = index + 1;
    endIndex = Math.min(startIndex + 11, allSalons.length - 1);
  } else {
    endIndex = index - 1;
    startIndex = Math.max(0, endIndex - 11);
  }

  const paginatedSalons = allSalons.slice(startIndex, endIndex + 1);
  return groupSalonsByYearAndMonth(paginatedSalons);
};

export const getNextSalon = async (): Promise<ExtendedSalon | null> => {
  const currentDate = new Date();
  try {
    const nextSalon = await prisma.salon.findFirst({
      where: {
        state: "APPROVED",
        startTime: {
          gt: currentDate,
        },
      },
      orderBy: {
        startTime: "asc",
      },
      include: {
        coHosts: true,
        tags: true,
        publicTickets: true,
        memberTickets: true,
        specialGuests: true
      },
    });
    return nextSalon;
  } catch (error) {
    console.error("Error in getNextSalon function:", error);
    throw error;
  }
};

export const getAllSalons = async (): Promise<ExtendedSalon[]> => {
  return await prisma.salon.findMany({
    include: {
      coHosts: true,
      tags: true,
      publicTickets: true,
      memberTickets: true,
      specialGuests: true
    },
    orderBy: {
      startTime: "asc",
    },
  });
};

export const checkSalonWithSlug = async (slug: string): Promise<boolean> => {
  const salon = await prisma.salon.findUnique({
    where: {
      slug: slug,
    },
  });
  return salon ? true : false;
};

export const getSalonBySlug = async (slug: string): Promise<ExtendedSalon | null> => {
  const salon = await prisma.salon.findUnique({
    where: {
      slug: slug,
    },
    include: {
      coHosts: true,
      tags: true,
      publicTickets: true,
      memberTickets: true,
      specialGuests: true,
      history: true,
    },
  });
  return salon || null; // Return null if salon is not found
};

export const getSalonsByHostId = async (hostId: string): Promise<ExtendedSalon[]> => {
  return await prisma.salon.findMany({
    where: {
      OR: [
        { hostId: hostId },
        { coHosts: { some: { id: hostId } } },
      ],
    },
    include: {
      coHosts: true,
      tags: true,
      publicTickets: true,
      memberTickets: true,
      specialGuests: true,
      history: true,
    },
    orderBy: {
      startTime: "asc",
    }
  });
};

export const getSalonCountByHostId = async (hostId: string): Promise<number> => {
  const count = await prisma.salon.count({
    where: {
      OR: [
        { hostId: hostId },
        { coHosts: { some: { id: hostId } } },
      ],
    },
  });
  return count;
};

export const getSalonCountByHostIdWithApproverState = async (hostId: string): Promise<number> => {
  const count = await prisma.salon.count({
    where: {
      state: "APPROVED",
      OR: [
        { hostId: hostId },
        { coHosts: { some: { id: hostId } } },
      ],
    },
  });
  return count;
};


export const getSalonsBySeriesId = async (seriesId: string): Promise<ExtendedSalon[]> => {
  return await prisma.salon.findMany({
    where: {
      seriesId: seriesId,
    },
    include: {
      coHosts: true,
      tags: true,
      publicTickets: true,
      memberTickets: true,
      specialGuests: true
    },
    orderBy: {
      startTime: "asc",
    },
  });
};

export const createSalon = async (
  salonBody: SalonPostObject, 
  imageUrl: string, 
  zoomMeeting: ZoomMeetingResponse, 
  hostId: string, 
  isDraft: boolean
): Promise<Salon> => {
  try {
    const slug = slugify(salonBody.title, slugifyOptions);

    const salon = await prisma.salon.create({
      data: {
        title: salonBody.title,
        description: salonBody.description,
        imageUrl: imageUrl,
        state: isDraft ? SERIES_STATE.DRAFT : SERIES_STATE.SUBMITTED,
        type: salonBody.type,
        startTime: salonBody.startTime,
        endTime: salonBody.endTime,
        memberSpaces: salonBody.memberSpaces,
        publicSpaces: salonBody.publicSpaces,
        publicPrice: salonBody.publicPrice,
        category: salonBody.category,
        locationType: salonBody.locationType,
        location: salonBody.location,
        locationUrl: salonBody.locationUrl,
        zoomId: zoomMeeting?.id.toString(),
        zoomStartUrl: zoomMeeting?.start_url,
        zoomJoinUrl: zoomMeeting?.join_url,
        slug: slug,
        host: {
          connect: {
            id: hostId,
          },
        },
        ...(salonBody.seriesId && salonBody.type === "SERIES_EPISODE" && {
          series: {
            connect: {
              id: salonBody.seriesId,
            },
          },
        }),
        ...(salonBody.coHosts && salonBody.coHosts.length > 0 && {
          coHosts: {
            connect: salonBody.coHosts.map((user) => ({ id: user.id })),
          },
        }),
        ...(salonBody.tags && salonBody.tags.length > 0 && {
          tags: {
            connect: salonBody.tags.map((tag) => ({ id: tag.id })),
          },
        }),
        additionalInfo: salonBody.additionalInfo,
        recordEvent: salonBody.recordEvent,
      },
    });

    if (salonBody.stripeConnectedAccountId) {
      await createProductAndPriceInConnectedAccount(
        salonBody.title,
        salonBody.publicPrice * 100,
        salonBody.stripeConnectedAccountId
      );
    }

    if (salonBody.specialGuests && salonBody.specialGuests.length > 0) {
      const specialGuestPromises = salonBody.specialGuests
        .filter(guest => guest.name && guest.email)
        .map(async (guest) => {
          const createdGuest = await prisma.specialGuest.create({
            data: {
              name: guest.name,
              email: guest.email,
              salon: {
                connect: { id: salon.id },
              },
            },
          });

          return createdGuest;
        });

      await Promise.all(specialGuestPromises);
    } else {
    }

    return salon;

  } catch (error) {
    throw error;
  }
};

export const getSalonChangedFields = (previous: any, updated: any) => {
  const changes: Record<string, { old: any; new: any }> = {};

  const fieldsToCheck = [
    "title",
    "description",
    "type",
    "imageUrl",
    "isDraft",
    "startTime",
    "endTime",
    "publicSpaces",
    "memberSpaces",
    "publicPrice",
    "category",
    "locationType",
    "location",
    "locationUrl",
    "seriesId",
    "coHosts",
    "tags",
    "additionalInfo",
    "recordEvent",
    "specialGuests"
  ];

  for (const key of fieldsToCheck) {
    if (updated[key] === undefined) {
      continue;
    }

    if (updated[key] === "undefined") {
      updated[key] = null;
    }

    if (isEqual(previous[key], updated[key])) {
      continue;
    }

    if (key === "startTime" || key === "endTime") {
      const oldTime = new Date(previous[key]).getTime();
      const newTime = new Date(updated[key]).getTime();
      if (oldTime !== newTime) {
        changes[key] = { old: previous[key], new: updated[key] };
      }
      continue;
    }

    if (Array.isArray(previous[key]) && Array.isArray(updated[key])) {
      const normalizedPrevious = previous[key].map(obj => JSON.stringify(obj));
      const normalizedUpdated = updated[key].map(obj => JSON.stringify(obj));

      if (!isEqual(normalizedPrevious, normalizedUpdated)) {
        changes[key] = { old: previous[key], new: updated[key] };
      }
      continue;
    }

    if (previous[key] !== updated[key]) {
      changes[key] = { old: previous[key], new: updated[key] };
    }
  }

  return changes;
};

export const editSalon = async (id: string, isDraft: boolean, data: SalonEditBody): Promise<Salon | null> => {
  if (data.seriesId === "undefined") {
    data.seriesId = null;
  }

  const filteredSpecialGuests = data.specialGuests ? data.specialGuests.filter(guest => guest.name && guest.email) : [];

  const specialGuestsUpdate = filteredSpecialGuests.length > 0 ? {
    deleteMany: {},
    create: filteredSpecialGuests.map(guest => ({
      name: guest.name,
      email: guest.email,
    })),
  } : {
    deleteMany: {},
  };

  const currentSalon = await prisma.salon.findUnique({
    where: { id },
    select: {
      state: true,
      description: true,
      type: true,
      startTime: true,
      endTime: true,
      memberSpaces: true,
      publicSpaces: true,
      publicPrice: true,
      category: true,
      locationType: true,
      location: true,
      locationUrl: true,
      additionalInfo: true,
      recordEvent: true,
      slug: true,
      title: true,
      imageUrl: true,
      zoomId: true,
      zoomStartUrl: true,
      zoomJoinUrl: true,
      seriesId: true,
      coHosts: true,
      tags: true,
      specialGuests: true,
    },
  });

  if (!currentSalon) {
    throw new Error("Salon not found");
  }

  const updateData: Prisma.SalonUpdateInput = {
    description: data.description,
    type: data.type,
    startTime: data.startTime,
    endTime: data.endTime,
    memberSpaces: data.memberSpaces,
    publicSpaces: data.publicSpaces,
    publicPrice: data.publicPrice,
    category: data.category,
    locationType: data.locationType,
    location: data.location,
    locationUrl: data.locationUrl,
    additionalInfo: data.additionalInfo,
    recordEvent: data.recordEvent,
    slug: data.slug,
    title: data.title,
    imageUrl: data.imageUrl,
    state: isDraft ? SALON_STATE.DRAFT : SALON_STATE.PENDING_APPROVAL,
    zoomId: data.zoomId,
    zoomStartUrl: data.zoomStartUrl,
    zoomJoinUrl: data.zoomJoinUrl,
    series: data.seriesId ? { connect: { id: data.seriesId } } : undefined,
    coHosts: data.coHosts ? { set: data.coHosts.map(host => ({ id: host.id })) } : undefined,
    tags: data.tags ? { set: data.tags.map(tag => ({ id: tag.id })) } : undefined,
    specialGuests: specialGuestsUpdate,
  };

  const updatedSalon = await prisma.salon.update({
    where: { id },
    data: updateData,
  });

  await prisma.salonHistory.create({
    data: {
      salonId: id,
      changes: {
        previous: JSON.parse(JSON.stringify(currentSalon)),
        updated: JSON.parse(JSON.stringify(updateData)),
      },
      changedAt: new Date(),
    },
  });

  return updatedSalon;
};

export const deleteSalonById = async (id: string): Promise<Salon | null> => {
  const salon = await prisma.salon.delete({
    where: {
      id: id,
    },
  });
  return salon || null; // Return null if user is not found
};

export const approveSalonById = async (id: string): Promise<Salon> => {
  return await prisma.salon.update({
    where: { id },
    data: { state: SALON_STATE.APPROVED },
  });
};

export const submitSalonById = async (id: string): Promise<Salon> => {
  return await prisma.salon.update({
    where: { id },
    data: { state: SALON_STATE.SUBMITTED },
  });
};

export const getSeriesEpisodesForUser = async (userId: string): Promise<Salon[]> => {
  const salons = await prisma.salon.findMany({
    where: {
      OR: [
        { hostId: userId },
        { coHosts: { some: { id: userId } } },
      ],
      type: SALON_TYPE.SERIES_EPISODE,
    },
    include: {
      coHosts: true,
      tags: true,
      publicTickets: true,
      memberTickets: true,
      specialGuests: true
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return salons;
};