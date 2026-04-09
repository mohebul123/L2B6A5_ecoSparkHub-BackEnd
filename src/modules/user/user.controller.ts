import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../utils/sendRes";
import { UserService } from "./user.service";

const getMyStats = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user; // Auth middleware theke user info nichi

  const result = await UserService.getUserDashboardStats(user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User dashboard statistics fetched successfully!",
    data: result,
  });
});

export const UserController = {
  getMyStats,
};
