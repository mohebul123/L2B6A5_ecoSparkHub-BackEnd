import { prisma } from "../../lib/prisma";
import { cloudinaryUpload } from "../../config/cloudinary.config";

const createIdeaIntoDB = async (file: any, payload: any, userId: string) => {
  let imageUrl = "";

  // ১. Cloudinary-te image upload logic
  if (file) {
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinaryUpload.uploader.upload_stream(
        { folder: "eco-spark-ideas" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      uploadStream.end(file.buffer);
    });
    imageUrl = (uploadResult as any).secure_url;
  }

  // ২. Database-e Idea create (Model: images String[], status PENDING)
  const result = await prisma.idea.create({
    data: {
      title: payload.title,
      problemStatement: payload.problemStatement,
      solution: payload.solution,
      description: payload.description,
      categoryId: payload.categoryId,
      authorId: userId,
      images: imageUrl ? [imageUrl] : [], // Prisma model onujayi Array-e pathano
      // Form-data theke asha string-ke boolean o number-e convert kora
      isPaid: payload.isPaid === "true" || payload.isPaid === true,
      price: payload.price ? parseFloat(payload.price) : 0,
      status: "PENDING", // Requirement: Initial status Under Review (Pending)
    },
  });

  return result;
};

export const IdeaService = {
  createIdeaIntoDB,
};
