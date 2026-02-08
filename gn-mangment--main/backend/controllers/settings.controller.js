import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSettings = async (req, res) => {
  try {
    let settings = await prisma.systemSettings.findFirst();
    if (!settings) {
      settings = await prisma.systemSettings.create({ data: { regionName: "Metlaoui" } });
    }
    return res.status(200).json({ data: settings });
  } catch (error) {
    return res.status(500).json({ message: "Failed to retrieve settings" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { regionName } = req.body;
    let settings = await prisma.systemSettings.findFirst();

    if (settings) {
      settings = await prisma.systemSettings.update({
        where: { id: settings.id },
        data: { regionName }
      });
    } else {
      settings = await prisma.systemSettings.create({ data: { regionName } });
    }

    return res.status(200).json({ message: "Settings updated successfully", data: settings });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update settings" });
  }
};
