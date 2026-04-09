import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../utils/sendRes";
import { PurchaseService } from "./purchase.service";

const purchaseIdea = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { ideaId } = req.body;

  const result = await PurchaseService.purchaseIdeaInDB(user.id, ideaId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Idea purchased successfully! Access granted.",
    data: result,
  });
});

const getMyPurchases = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await PurchaseService.getMyPurchasesFromDB(user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Purchased ideas fetched!",
    data: result,
  });
});

export const PurchaseController = {
  purchaseIdea,
  getMyPurchases,
};
