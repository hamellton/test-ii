import prisma from "@utils/db";
import { PublicTicket, MemberTicket, Salon } from "@prisma/client";
import { getUserById, updateUser } from "@models/user";
import { Payout } from "@utils/types";

export const buyPublicTicket = async (email: string, name: string, customerEmail: string, salonId: string, stripePaymentId: string): Promise<PublicTicket> => {
  return await prisma.publicTicket.create({
    data: {
      email: email,
      name: name,
      customerEmail: customerEmail,
      salonId: salonId,
      stripePaymentId: stripePaymentId
    }
  });
};

export async function buyMemberTicket(salonId: string, userId: string): Promise<MemberTicket> {
  const ticket = await prisma.memberTicket.create({
    data: {
      userId: userId,
      salonId: salonId,
    }
  });
  const user = await getUserById(userId);
  updateUser(user!.id, { lastMemberTicket: new Date() });
  return ticket;
}

export async function salonsByEmail(email: string): Promise<Salon[]> {
  const salonIdsForMemberTickets = await prisma.memberTicket.findMany({
    where: {
      user: {
        email: email
      }
    },
    select: {
      salonId: true
    }
  });

  const salonIdsForPublicTickets = await prisma.publicTicket.findMany({
    where: {
      email: email
    },
    select: {
      salonId: true
    }
  });

  const uniqueSalonIds = [...new Set([...salonIdsForMemberTickets.map(ticket => ticket.salonId), ...salonIdsForPublicTickets.map(ticket => ticket.salonId)])];

  const salons = await prisma.salon.findMany({
    where: {
      id: {
        in: uniqueSalonIds
      }
    }
  });

  return salons;
};

export async function getPayoutsForHost(userId: string): Promise<Payout[]> {
  // Fetch public tickets with salon data to access publicPrice and startTime
  const publicTickets = await prisma.publicTicket.findMany({
    where: { salon: { hostId: userId } },
    include: { salon: true }
  });

  // Fetch tips where the user is the host, including the createdAt field
  const tips = await prisma.tip.findMany({
    where: { hostId: userId },
    select: { amount: true, createdAt: true }
  });

  // Explicitly specify the type as 'Ticket' or 'Tip' to satisfy TypeScript's type checking
  const ticketResults: Payout[] = publicTickets.map(ticket => ({
    type: ticket.salon.title,
    amount: ticket.salon.publicPrice,
    time: ticket.salon.startTime
  }));

  const tipResults: Payout[] = tips.map(tip => ({
    type: "Tip" as const,  // Use 'as const' to ensure the type is treated as a literal type
    amount: tip.amount,
    time: tip.createdAt
  }));

  return [...ticketResults, ...tipResults];
}

export const convertToCSV = (data: Payout[]): string => {
  const header = "Type,Amount,Time\n";
  const rows = data.map(item =>
    `${item.type},${item.amount},${item.time.toISOString()}`
  ).join("\n");

  return header + rows;
};
