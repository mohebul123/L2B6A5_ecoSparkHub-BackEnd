import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { UserRole } from "../middlewares/auth";
async function seedAdmin() {
  try {
    const adminData = {
      name: "adminMoheb",
      email: "adminmoheb@gmail.com",
      password: "pass1234",
      role: UserRole.admin,
    };

    const isAdminExist = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });
    if (isAdminExist) {
      throw new Error("User Already Exists");
    }
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const admin = await prisma.user.create({
      data: { ...adminData, password: hashedPassword },
    });
    console.log("Admin Created Successfully", admin);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
