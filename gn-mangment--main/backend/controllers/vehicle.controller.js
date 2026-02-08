import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Vehicles
export const createVehicle = async (req, res) => {
  try {
    const { plateNumber, vehicleType, brand, model, assignedUnit, status } = req.body;
    const userId = req.user.id;

    const vehicle = await prisma.administrativeVehicle.create({
      data: {
        plateNumber,
        vehicleType,
        brand,
        model,
        assignedUnit,
        status,
        createdBy: userId,
      },
    });

    return res.status(201).json({ message: "تم إنشاء الوسيلة", data: vehicle });
  } catch (error) {
    return res.status(500).json({ message: "فشل في إنشاء الوسيلة", error: error.message });
  }
};

export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.administrativeVehicle.findMany({
      include: {
        creator: { select: { name: true } },
        maintenance: true
      }
    });
    return res.status(200).json({ data: vehicles });
  } catch (error) {
    return res.status(500).json({ message: "فشل في استرداد الوسائل" });
  }
};

// Maintenance
export const createMaintenanceRecord = async (req, res) => {
  try {
    const { vehicleId, maintenanceDate, description, cost, garage } = req.body;
    const userId = req.user.id;

    const record = await prisma.maintenanceRecord.create({
      data: {
        vehicleId: parseInt(vehicleId),
        maintenanceDate: new Date(maintenanceDate),
        description,
        cost: parseFloat(cost),
        garage,
        createdBy: userId,
      },
    });

    return res.status(201).json({ message: "تم إنشاء سجل الصيانة", data: record });
  } catch (error) {
    return res.status(500).json({ message: "فشل في إنشاء سجل الصيانة", error: error.message });
  }
};
