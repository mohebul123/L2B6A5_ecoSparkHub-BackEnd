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

const getAllApprovedIdeasFromDB = async (query: any) => {
  const { searchTerm, category, page, limit } = query; // Query theke data nilam

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  // ১. Dynamic Filter Object
  const whereConditions: any = {
    status: "APPROVED",
  };

  // ২. Search Logic (Title e khujbe)
  if (searchTerm) {
    whereConditions.OR = [
      { title: { contains: searchTerm as string, mode: "insensitive" } },
      {
        problemStatement: {
          contains: searchTerm as string,
          mode: "insensitive",
        },
      },
    ];
  }

  // ৩. Category Filter Logic
  if (category) {
    whereConditions.categoryId = category;
  }

  const result = await prisma.idea.findMany({
    where: whereConditions, // Ekhane dynamic condition boshalo
    include: {
      category: true,
      author: { select: { name: true } },
      _count: { select: { votes: true, comments: true } },
    },
    skip,
    take: limitNumber,
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.idea.count({ where: whereConditions });

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber),
    },
    data: result,
  };
};

const getAllIdeasForAdminFromDB = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const result = await prisma.idea.findMany({
    include: {
      category: true,
      author: { select: { name: true, email: true } },
    },
    skip: skip,
    take: limit,
    orderBy: { createdAt: "desc" }, // Admin dekhbe shobcheye latest konta ashlo
  });

  const total = await prisma.idea.count();

  return {
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
    data: result,
  };
};

// ৪. Single Idea Details
const getSingleIdeaFromDB = async (
  id: string,
  userId?: string,
  userRole?: string,
) => {
  const idea = await prisma.idea.findUnique({
    where: { id },
    include: {
      category: true,
      author: { select: { id: true, name: true, email: true } },
      _count: { select: { votes: true, comments: true } },
    },
  });

  if (!idea) throw new Error("Idea not found");

  // ১. Logic Checks:
  const isAuthor = userId === idea.authorId;
  const isAdmin = userRole === "ADMIN"; // Eikhane add korbe logic-ta

  const isPurchased = userId
    ? await prisma.purchase.findUnique({
        where: { userId_ideaId: { userId, ideaId: id } },
      })
    : false;

  // ২. Access Control Logic:
  // Jodi Paid hoy EBONG (User Author na hoy, Admin-o na hoy, abar Purchase-o na thake)
  if (idea.isPaid && !isAuthor && !isAdmin && !isPurchased) {
    return {
      id: idea.id,
      title: idea.title,
      problemStatement: idea.problemStatement,
      status: idea.status,
      isPaid: true,
      price: idea.price,
      author: idea.author,
      category: idea.category,
      message:
        "This is a premium idea. Please purchase to see the solution and images.",
      solution: "LOCKED",
      description: "LOCKED",
      images: [],
    };
  }

  // ৩. Access granted (For Free ideas, Authors, Admins, or Buyers)
  return idea;
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
  getAllIdeasForAdminFromDB,
};
