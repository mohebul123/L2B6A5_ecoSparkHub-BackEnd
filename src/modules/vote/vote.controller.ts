import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../utils/sendRes";
import { VoteService } from "./vote.service";

const triggerVote = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { ideaId, type } = req.body; // type hobe "UPVOTE" ba "DOWNVOTE"

  const result = await VoteService.handleVote(user.id, ideaId, type);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Vote recorded successfully!",
    data: result,
  });
});

export const VoteController = {
  triggerVote,
};
