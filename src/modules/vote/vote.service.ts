import { VoteType } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const handleVote = async (userId: string, ideaId: string, type: VoteType) => {
  // ১. Check koro user age kono vote diyeche kina
  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_ideaId: { userId, ideaId },
    },
  });

  if (existingVote) {
    // ২. Jodi same type vote hoy (e.g. Upvote-e click korlo abar), tahole delete (Toggle)
    if (existingVote.type === type) {
      return await prisma.vote.delete({
        where: { id: existingVote.id },
      });
    } else {
      // ৩. Jodi type alada hoy (Upvote theke Downvote), tahole update koro
      return await prisma.vote.update({
        where: { id: existingVote.id },
        data: { type },
      });
    }
  }

  // ৪. Jodi age kono vote na thake, tahole notun create koro
  return await prisma.vote.create({
    data: { userId, ideaId, type },
  });
};

export const VoteService = {
  handleVote,
};
