import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  generateTokens,
  verifyRefreshToken,
  getUserById,
} from "../services/auth.service.js";

const prisma = new PrismaClient();

// Register
export const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة" });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "المستخدم موجود بالفعل" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || "USER",
      },
      select: { id: true, email: true, name: true, role: true },
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Set access token in non-httpOnly cookie so client can read it
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });

    console.log("✅ User registered:", {
      id: user.id,
      email: user.email,
      token: accessToken.substring(0, 20) + "...",
    });

    return res.status(201).json({
      message: "تم تسجيل المستخدم بنجاح",
      user,
      accessToken,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "خطأ داخلي في الخادم" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "البريد الإلكتروني وكلمة المرور مطلوبان" });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "بيانات الاعتماد غير صالحة" });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "بيانات الاعتماد غير صالحة" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Set access token in non-httpOnly cookie so client can read it
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1 * 60 * 60 * 1000,
    });

    console.log("✅ User logged in:", { id: user.id, email: user.email });

    return res.status(200).json({
      message: "تم تسجيل الدخول بنجاح",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "خطأ داخلي في الخادم" });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "تم تسجيل الخروج بنجاح" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "خطأ داخلي في الخادم" });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    const decoded = verifyRefreshToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await getUserById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user.id,
      user.role,
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Token refreshed",
      accessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
