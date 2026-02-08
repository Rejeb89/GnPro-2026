export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "المستخدم غير موثق" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "تم رفض الوصول: صلاحيات غير كافية",
      });
    }

    next();
  };
};
