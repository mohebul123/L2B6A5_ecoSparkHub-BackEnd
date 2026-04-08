import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../utils/sendRes";
import { IdeaService } from "./idea.service";

const createIdea = catchAsync(async (req: Request, res: Response) => {
  // Form-data theke 'data' key-r bhitor asha JSON string-ke parse kora
  const ideaData = JSON.parse(req.body.data);
  const user = (req as any).user; // Auth middleware token theke 'id' bosiye dibe

  const result = await IdeaService.createIdeaIntoDB(
    req.file, // Multer file
    ideaData,
    user.id,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Sustainability idea created and submitted for review!",
    data: result,
  });
});

export const IdeaController = {
  createIdea,
};
