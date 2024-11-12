import { TicketStatus } from "@prisma/client";
import prisma from "@utils/db";
// import { subDays } from "date-fns";

// async function updateExpiredTickets() {
//   const sevenDaysAgo = subDays(new Date(), 7);

//   await prisma.publicTicket.updateMany({
//     where: {
//       status: "PENDING",
//       createdAt: {
//         lt: sevenDaysAgo,
//       },
//     },
//     data: {
//       status: "EXPIRED",
//     },
//   });
// }

export const getSalonsWithPublicTicketsPaginated = async (
  hostId: string, 
  page: number = 1, 
  pageSize: number = 10
) => {
//   await updateExpiredTickets();
  
  const skip = (page - 1) * pageSize;
  
  const [total, salons] = await Promise.all([
    prisma.salon.count({
      where: {
        hostId: hostId,
        state: {
          in: ["APPROVED", "PENDING_APPROVAL"]
        },
        startTime: {
          gt: new Date()
        }
      }
    }),
    prisma.salon.findMany({
      where: {
        hostId: hostId,
        state: {
          in: ["APPROVED", "PENDING_APPROVAL"]
        },
        startTime: {
          gt: new Date()
        }
      },
      include: {
        publicTickets: {
          where: {
            status: {
              in: ["PENDING", "APPROVED"]
            }
          },
          orderBy: {
            createdAt: "asc"
          }
        }
      },
      orderBy: {
        startTime: "asc"
      },
      skip,
      take: pageSize
    })
  ]);
  
  return {
    salons: salons.map(salon => ({
      ...salon,
      publicTicketsCount: salon.publicTickets.length
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
};


export const updateTicketStatus = async (
  ticketId: string, 
  status: TicketStatus,
  salonId: string,
  paymentIntentId: string
) => {
  return await prisma.$transaction(async (tx) => {
    const ticket = await tx.publicTicket.update({
      where: { id: ticketId },
      data: { status },
      include: { salon: { include: { host: true } } }
    });
  
    return { ticket };
  });
};