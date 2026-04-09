import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../utils/sendRes";
import { CommentService } from "./comment.service";

// ১. Notun comment ba reply create kora
const createComment = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { ideaId, content, parentId } = req.body;

  const result = await CommentService.createCommentIntoDB(user.id, {
    ideaId,
    content,
    parentId,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: parentId ? "Reply added!" : "Comment added!",
    data: result,
  });
});

// ২. Ekta specific idea-r shob comment fetch kora
const getCommentsByIdea = catchAsync(async (req: Request, res: Response) => {
  const { ideaId } = req.params;
  const result = await CommentService.getCommentsByIdeaFromDB(ideaId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comments fetched successfully!",
    data: result,
  });
});

export const CommentController = {
  createComment,
  getCommentsByIdea,
};
