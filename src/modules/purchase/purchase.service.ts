import { prisma } from "../../lib/prisma";

const purchaseIdeaInDB = async (userId: string, ideaId: string) => {
  // ১. Idea-ta Paid kina check koro
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
  });

  if (!idea) throw new Error("Idea not found!");
  if (!idea.isPaid) throw new Error("This idea is free, no need to purchase!");

  // ২. Already kineche kina check koro (@@unique constraint handle kora)
  const existingPurchase = await prisma.purchase.findUnique({
    where: {
      userId_ideaId: { userId, ideaId },
    },
  });

  if (existingPurchase)
    throw new Error("You have already purchased this idea!");

  // ৩. Purchase record create koro
  return await prisma.purchase.create({
    data: {
      userId,
      ideaId,
      amount: idea.price,
    },
    include: {
      idea: { select: { title: true, price: true } },
    },
  });
};

// ৪. User tar nijer kena shob idea dekhbe
const getMyPurchasesFromDB = async (userId: string) => {
  return await prisma.purchase.findMany({
    where: { userId },
    include: {
      idea: {
        include: { category: true, author: { select: { name: true } } },
      },
    },
  });
};

export const PurchaseService = {
  purchaseIdeaInDB,
  getMyPurchasesFromDB,
};
