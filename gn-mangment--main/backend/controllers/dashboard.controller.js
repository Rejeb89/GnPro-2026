import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalReceptions = await prisma.equipmentReception.count();
    const totalDeliveries = await prisma.equipmentDelivery.count();
    const totalVehicles = await prisma.administrativeVehicle.count();
    const totalRealEstate = await prisma.realEstateStatus.count();
    const totalCredits = await prisma.financialCredit.findMany();
    const totalAvailableCredit = totalCredits.reduce((sum, c) => sum + c.remainingAmount, 0);

    // Get all items to calculate stock stats
    const receptions = await prisma.equipmentReception.findMany();
    const deliveries = await prisma.equipmentDelivery.findMany();

    const stockMap = {};
    receptions.forEach((rec) => {
      if (!stockMap[rec.equipmentName]) {
        stockMap[rec.equipmentName] = { stock: 0, threshold: rec.minimumThreshold };
      }
      stockMap[rec.equipmentName].stock += rec.quantity;
    });

    deliveries.forEach((del) => {
      if (stockMap[del.equipmentName]) {
        stockMap[del.equipmentName].stock -= del.quantity;
      }
    });

    const stockItems = Object.values(stockMap);
    const lowStockCount = stockItems.filter(item => item.stock < item.threshold).length;
    const totalEquipmentTypes = stockItems.length;

    // Get recent activities
    const recentReceptions = await prisma.equipmentReception.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    const recentDeliveries = await prisma.equipmentDelivery.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "تم استرداد إحصائيات لوحة التحكم بنجاح",
      data: {
        counts: {
          users: totalUsers,
          receptions: totalReceptions,
          deliveries: totalDeliveries,
          equipmentTypes: totalEquipmentTypes,
          lowStockItems: lowStockCount,
          vehicles: totalVehicles,
          realEstate: totalRealEstate,
          totalAvailableCredit,
        },
        recentReceptions,
        recentDeliveries,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({ message: "فشل في استرداد إحصائيات لوحة التحكم" });
  }
};
