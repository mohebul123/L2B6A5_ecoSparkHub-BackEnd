// import { PrismaClient } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { cloudinaryUpload } from "../../config/cloudinary.config";

// const prisma = new PrismaClient();

const createIdeaIntoDB = async (file: any, payload: any, userId: string) => {
  let imageUrl = "";

  // 1. Image upload to Cloudinary (jodi file thake)
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

  // 2. Create Idea in Database
  const result = await prisma.idea.create({
    data: {
      ...payload,
      image: imageUrl,
      authorId: userId, // Auth middleware theke ashbe
    },
  });

  return result;
};

export const IdeaService = {
  createIdeaIntoDB,
};
