import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../utils/sendRes";
import { IdeaService } from "./idea.service";

const createIdea = catchAsync(async (req, res) => {
  const ideaData = JSON.parse(req.body.data);
  const user = (req as any).user;
  const result = await IdeaService.createIdeaIntoDB(
    req.file,
    ideaData,
    user.id,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Idea submitted!",
    data: result,
  });
});

const updateStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await IdeaService.updateIdeaStatusInDB(id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Status updated!",
    data: result,
  });
});

const getAllApprovedIdeas = catchAsync(async (req, res) => {
  const result = await IdeaService.getAllApprovedIdeasFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Ideas fetched successfully!",
    meta: result.meta, // Eita missing chilo
    data: result.data,
  });
});

const getAllIdeasForAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await IdeaService.getAllIdeasForAdminFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All ideas fetched for admin moderation!",
    meta: result.meta,
    data: result.data,
  });
});

const getMyIdeas = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await IdeaService.getMyIdeasFromDB(user.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My ideas fetched!",
    data: result,
  });
});

const getSingleIdea = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user; // Auth middleware theke user info ashe

  // userId ar role pathiye dilam
  const result = await IdeaService.getSingleIdeaFromDB(
    id as string,
    user?.id,
    user?.role,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Idea details fetched!",
    data: result,
  });
});

// controller export list-e 'getSingleIdea' add korte bhulo na

export const IdeaController = {
  createIdea,
  updateStatus,
  getAllApprovedIdeas,
  getAllIdeasForAdmin,
  getMyIdeas,
  getSingleIdea,
};
