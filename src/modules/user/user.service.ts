import { prisma } from "../../lib/prisma";

const getUserDashboardStats = async (userId: string) => {
  // ১. User-er post kora shob ideas fetch koro
  const userIdeas = await prisma.idea.findMany({
    where: { authorId: userId },
    include: {
      _count: {
        select: { votes: true }, // Protita idea-te koyta vote ache
      },
    },
  });

  // ২. Total Upvotes calculate koro
  const totalVotes = userIdeas.reduce(
    (acc, idea) => acc + idea._count.votes,
    0,
  );

  // ৩. Total Purchased Ideas count koro
  const totalPurchases = await prisma.purchase.count({
    where: { userId },
  });

  return {
    totalIdeas: userIdeas.length,
    totalVotes,
    totalPurchases,
    recentIdeas: userIdeas.slice(0, 5), // Shudhu latest 5-ta idea preview-r jonno
  };
};

export const UserService = {
  getUserDashboardStats,
};
