import { verifyAccessToken } from "../services/auth.service.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies.accessToken;

    console.log("🔐 Auth Debug - URL:", req.url, {
      hasAuthHeader: !!authHeader,
      hasCookieToken: !!cookieToken,
    });

    const token = authHeader?.split(" ")[1] || cookieToken;

    if (!token) {
      return res.status(401).json({
        message: "لم يتم تقديم رمز تفويض. يرجى تسجيل الدخول.",
      });
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "رمز غير صالح أو منتهي الصلاحية" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "خطأ داخلي في الخادم" });
  }
};
