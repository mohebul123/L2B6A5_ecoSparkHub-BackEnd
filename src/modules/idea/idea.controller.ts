import { Request, Response, NextFunction } from "express";
import { IdeaService } from "./idea.service";

const createIdea = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Note: Form-data pathale req.body.data JSON string thake, seta parse korte hoy
    const ideaData = JSON.parse(req.body.data);
    const user = (req as any).user; // Auth middleware theke user pabo

    const result = await IdeaService.createIdeaIntoDB(
      req.file,
      ideaData,
      user.id,
    );

    res.status(201).json({
      success: true,
      message: "Idea created successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const IdeaController = {
  createIdea,
};
