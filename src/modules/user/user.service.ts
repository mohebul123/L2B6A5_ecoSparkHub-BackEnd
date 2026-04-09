import { prisma } from "../../lib/prisma";

const getUserDashboardStats = async (userId: string) => {
  // ১. User-er post kora shob ideas fetch koro (Upvote count shoho)
  const userIdeas = await prisma.idea.findMany({
    where: { authorId: userId },
    include: {
      _count: {
        select: { votes: true },
      },
    },
  });

  // ২. Total Upvotes calculation: Sob idea-r vote jog koro
  const totalVotesReceived = userIdeas.reduce(
    (acc, idea) => acc + idea._count.votes,
    0,
  );

  // ৩. User koyta premium idea kineche tar count
  const totalPurchasedIdeas = await prisma.purchase.count({
    where: { userId },
  });

  return {
    totalIdeasPosted: userIdeas.length,
    totalVotesReceived,
    totalPurchasedIdeas,
    recentActivity: userIdeas.slice(0, 5), // Latest 5 ideas for dashboard preview
  };
};

// Profile update ba onno function thakle ekhane add hobe
export const UserService = {
  getUserDashboardStats,
};
