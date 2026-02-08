import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createFuelRecord = async (req, res) => {
  try {
    const { unit, amount, fuelType, couponNumbers, date } = req.body;
    const userId = req.user.id;

    const record = await prisma.fuelRecord.create({
      data: {
        unit,
        amount: parseFloat(amount),
        fuelType,
        couponNumbers,
        date: new Date(date),
        createdBy: userId,
      },
    });

    return res.status(201).json({ message: "تم إنشاء سجل المحروقات", data: record });
  } catch (error) {
    return res.status(500).json({ message: "فشل في إنشاء سجل المحروقات", error: error.message });
  }
};

export const getAllFuelRecords = async (req, res) => {
  try {
    const records = await prisma.fuelRecord.findMany({
      include: { creator: { select: { name: true } } },
      orderBy: { date: "desc" }
    });
    return res.status(200).json({ data: records });
  } catch (error) {
    return res.status(500).json({ message: "فشل في استرداد سجلات المحروقات" });
  }
};
