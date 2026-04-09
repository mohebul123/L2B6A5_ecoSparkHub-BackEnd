import { prisma } from "../../lib/prisma";

const createCommentIntoDB = async (
  userId: string,
  payload: { ideaId: string; content: string; parentId?: string },
) => {
  return await prisma.comment.create({
    data: {
      userId,
      ideaId: payload.ideaId,
      content: payload.content,
      parentId:
        payload.parentId && payload.parentId.trim() !== ""
          ? payload.parentId
          : null,
    },
    include: {
      user: {
        select: { name: true, email: true }, // profileImage field-ta bad dilam
      },
    },
  });
};

const getCommentsByIdeaFromDB = async (ideaId: string) => {
  return await prisma.comment.findMany({
    where: {
      ideaId,
      parentId: null,
    },
    include: {
      user: {
        select: { name: true, email: true }, // Ekhane-o bad dilam
      },
      replies: {
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const CommentService = {
  createCommentIntoDB,
  getCommentsByIdeaFromDB,
};
