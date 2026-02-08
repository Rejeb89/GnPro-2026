import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCredit = async (req, res) => {
  try {
    const { description, totalAmount, year } = req.body;
    const userId = req.user.id;

    const credit = await prisma.financialCredit.create({
      data: {
        description,
        totalAmount: parseFloat(totalAmount),
        remainingAmount: parseFloat(totalAmount),
        year: parseInt(year),
        createdBy: userId,
      },
    });

    return res.status(201).json({ message: "تم إنشاء الاعتماد بنجاح", data: credit });
  } catch (error) {
    return res.status(500).json({ message: "فشل في إنشاء الاعتماد", error: error.message });
  }
};

export const getAllCredits = async (req, res) => {
  try {
    const credits = await prisma.financialCredit.findMany({
      orderBy: { year: "desc" },
      include: { creator: { select: { name: true } } }
    });
    return res.status(200).json({ data: credits });
  } catch (error) {
    return res.status(500).json({ message: "فشل في استرداد الاعتمادات" });
  }
};

export const updateCreditSpending = async (req, res) => {
  try {
    const { id } = req.params;
    const { spentAmount } = req.body;

    const credit = await prisma.financialCredit.findUnique({ where: { id: parseInt(id) } });
    if (!credit) return res.status(404).json({ message: "الاعتماد غير موجود" });

    const newSpent = credit.spentAmount + parseFloat(spentAmount);
    const newRemaining = credit.totalAmount - newSpent;

    if (newRemaining < 0) return res.status(400).json({ message: "الرصيد المتبقي غير كافٍ" });

    const updatedCredit = await prisma.financialCredit.update({
      where: { id: parseInt(id) },
      data: {
        spentAmount: newSpent,
        remainingAmount: newRemaining
      }
    });

    return res.status(200).json({ message: "تم تحديث الاعتماد بنجاح", data: updatedCredit });
  } catch (error) {
    return res.status(500).json({ message: "فشل في تحديث الاعتماد" });
  }
};
