import prisma from "@utils/db"
import { Tip } from '@prisma/client';

export const createTip = async (senderEmail: string, hostId: string, amount: number, stripePaymentId: string): Promise<Tip> => {
  console.log('Create Tip DB: ', hostId)
  return await prisma.tip.create({
    data: {
      senderEmail: senderEmail,
      hostId: hostId,
      amount: amount,
      stripePaymentId: stripePaymentId,
    }
  });
};