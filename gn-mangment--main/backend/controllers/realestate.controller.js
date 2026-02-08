import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createRealEstate = async (req, res) => {
  try {
    const { unitName, location, status, area, legalStatus, notes } = req.body;
    const userId = req.user.id;

    const realEstate = await prisma.realEstateStatus.create({
      data: {
        unitName,
        location,
        status,
        area: area ? parseFloat(area) : null,
        legalStatus,
        notes,
        createdBy: userId,
      },
    });

    return res.status(201).json({ message: "Real estate record created", data: realEstate });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create real estate record", error: error.message });
  }
};

export const getAllRealEstate = async (req, res) => {
  try {
    const records = await prisma.realEstateStatus.findMany({
      include: { creator: { select: { name: true } } }
    });
    return res.status(200).json({ data: records });
  } catch (error) {
    return res.status(500).json({ message: "Failed to retrieve real estate records" });
  }
};
