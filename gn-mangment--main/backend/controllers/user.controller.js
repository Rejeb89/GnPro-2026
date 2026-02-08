import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ success: false, message: "خطأ في استرجاع قائمة المستخدمين" });
  }
};

// Create user (Admin only)
export const createUser = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ success: false, message: "جميع الحقول مطلوبة" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "البريد الإلكتروني موجود بالفعل" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({ success: true, message: "تم إنشاء الحساب بنجاح", data: user });
  } catch (error) {
    console.error("Create user error:", error);
    return res.status(500).json({ success: false, message: "خطأ في إنشاء الحساب" });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting self
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ success: false, message: "لا يمكنك حذف حسابك الخاص" });
    }

    await prisma.user.delete({ where: { id: parseInt(id) } });

    return res.status(200).json({ success: true, message: "تم حذف المستخدم بنجاح" });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ success: false, message: "خطأ في حذف المستخدم" });
  }
};
