import { prisma } from "../../lib/prisma";
import { cloudinaryUpload } from "../../config/cloudinary.config";

// ১. Idea Create
const createIdeaIntoDB = async (file: any, payload: any, userId: string) => {
  let imageUrl = "";
  if (file) {
    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinaryUpload.uploader.upload_stream(
        { folder: "eco-spark" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      uploadStream.end(file.buffer);
    });
    imageUrl = uploadResult.secure_url;
  }

  return await prisma.idea.create({
    data: {
      ...payload,
      authorId: userId,
      images: imageUrl ? [imageUrl] : [],
      isPaid: payload.isPaid === "true" || payload.isPaid === true,
      price: payload.price ? parseFloat(payload.price) : 0,
      status: "PENDING",
    },
  });
};

// ২. Admin Status Update
const updateIdeaStatusInDB = async (
  id: string,
  payload: { status: any; feedback?: string },
) => {
  return await prisma.idea.update({
    where: { id },
    data: {
      status: payload.status,
      feedback: payload.status === "REJECTED" ? payload.feedback : null,
    },
  });
};

// ৩. Public Approved Ideas (Full Logic with Vote Count)
const getAllApprovedIdeasFromDB = async (query: any) => {
  const { searchTerm, categoryId } = query;

  return await prisma.idea.findMany({
    where: {
      status: "APPROVED",
      ...(categoryId && { categoryId }),
      ...(searchTerm && {
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      category: true,
      author: { select: { name: true, profileImage: true } },
      votes: true, // Protita vote details dekhabe
      _count: {
        select: {
          votes: true, // Total koyta vote poreche tar count dekhabe
          comments: true, // Pore jakhon comment korbo tar count-o auto ashbe
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// ৪. Single Idea Details
const getSingleIdeaFromDB = async (id: string) => {
  return await prisma.idea.findUnique({
    where: { id },
    include: {
      category: true,
      author: { select: { name: true, profileImage: true, bio: true } },
      votes: true,
      comments: {
        include: {
          user: { select: { name: true, profileImage: true } },
        },
      },
    },
  });
};

// ৫. My Ideas (Member Dashboard)
const getMyIdeasFromDB = async (userId: string) => {
  return await prisma.idea.findMany({
    where: { authorId: userId },
    include: { category: true, _count: { select: { votes: true } } },
    orderBy: { createdAt: "desc" },
  });
};

export const IdeaService = {
  createIdeaIntoDB,
  updateIdeaStatusInDB,
  getAllApprovedIdeasFromDB,
  getSingleIdeaFromDB,
  getMyIdeasFromDB,
};
