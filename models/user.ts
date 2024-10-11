import prisma from "@utils/db";
import { UserPublic } from "@utils/types";
import { HostRequest, User, USER_ROLE } from "@prisma/client";
import slugify from "slugify";
import { slugifyOptions } from "@config";

export const getUserById = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
};

export const getUserBySlug = async (slug: string): Promise<UserPublic | null> => {
  const user = await prisma.user.findUnique({
    where: {
      slug: slug,
    },
    include: {
      salons: true,
    }
  });

  if (!user?.fullname || !user?.profileImageUrl || !user?.bio) {
    return null;
  }

  return {
    fullname: user?.fullname,
    id: user?.id,
    bio: user?.bio,
    quote: user?.quote || "",
    profileImageUrl: user.profileImageUrl,
    webLink: user?.webLink || "",
    xLink: user?.xLink || "",
    instaLink: user?.instaLink || "",
    substackLink: user?.substackLink || "",
    salons: user?.salons || [],
    memberfulId: user?.memberfulId || ""
  };
};

export const getAllUsers = async (): Promise<UserPublic[]> => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullname: true,
      bio: true,
      profileImageUrl: true,
      slug: true,
      salons: true,
      memberfulId: true,
    },
  });

  const formattedUsers: UserPublic[] = users.map(user => ({
    id: user.id,
    fullname: user.fullname || "",
    bio: user.bio || "",
    profileImageUrl: user.profileImageUrl || "",
    slug: user.slug || "",
    salons: user.salons || [],
    memberfulId: user.memberfulId || "",
  }));

  return formattedUsers;
};

export const getAllHosts = async (): Promise<UserPublic[]> => {
  const users = await prisma.user.findMany({
    where: {
      profileImageUrl: {
        not: null
      }
    },
    select: {
      id: true,
      fullname: true,
      bio: true,
      profileImageUrl: true,
      slug: true,
      salons: true,
      memberfulId: true,
      quote: true,
    },
  });

  const formattedUsers: UserPublic[] = users.map(user => ({
    id: user.id,
    fullname: user.fullname || "",
    bio: user.bio || "",
    profileImageUrl: user.profileImageUrl || "",
    slug: user.slug || "",
    salons: user.salons || [],
    memberfulId: user.memberfulId || "",
    quote: user.quote || "",
  }));

  return formattedUsers;
};

export const getAllAdmins = async (): Promise<UserPublic[]> => {
  const admins = await prisma.user.findMany({
    where: {
      role: {
        in: [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN],
      }
    },
    select: {
      id: true,
      fullname: true,
      bio: true,
      profileImageUrl: true,
      slug: true,
      salons: true,
      memberfulId: true,
      quote: true,
      role: true,
      email: true,
      notifyOnCreate: true,
      notifyOnUpdate: true,
      notifyOnDelete: true,
    },
  });

  const formattedAdmins: UserPublic[] = admins.map(admin => ({
    id: admin.id,
    fullname: admin.fullname || "",
    bio: admin.bio || "",
    profileImageUrl: admin.profileImageUrl || "",
    slug: admin.slug || "",
    salons: admin.salons || [],
    memberfulId: admin.memberfulId || "",
    quote: admin.quote || "",
    role: admin.role || "",
    email: admin.email || "",
    notifyOnCreate: admin.notifyOnCreate,
    notifyOnUpdate: admin.notifyOnUpdate,
    notifyOnDelete: admin.notifyOnDelete,
  }));

  return formattedAdmins;
};

export const createHostProfile = async (id: string, data: Partial<User>): Promise<User | null> => {
  const slug = slugify(data.fullname!, slugifyOptions);
  const updatedUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      slug: slug,
      ...data
    },
  });
  return updatedUser || null;
};

export const deleteUserById = async (id: string): Promise<User | null> => {
  const user = await prisma.user.delete({
    where: {
      id: id,
    },
  });
  return user || null; // Return null if user is not found
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User | null> => {
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: data
  });
};

export const deleteAllUsers = async (): Promise<void> => {
  await prisma.user.deleteMany({});
};


export const deleteHostRequest = async (id: string) => {
  try {
    const deletedHostRequest: HostRequest | null = await prisma.hostRequest.delete({
      where: { id },
    });
    return deletedHostRequest;
  } catch (error) {
    console.error("Error deleting HostRequest:", error);
    throw new Error("Failed to delete HostRequest");
  }
};

export const updateAdminNotifications = async (userId: string, notifyOnCreate: boolean, notifyOnUpdate: boolean, notifyOnDelete: boolean) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      notifyOnCreate,
      notifyOnUpdate,
      notifyOnDelete,
    },
  });
};