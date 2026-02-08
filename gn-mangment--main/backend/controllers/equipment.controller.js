import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Equipment Reception (Create)
export const createEquipmentReception = async (req, res) => {
  try {
    const {
      equipmentName,
      category,
      quantity,
      minimumThreshold,
      sendingDept,
      receptionDate,
      reference,
      referenceNumber,
      referenceDate,
      notes,
    } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (
      !equipmentName ||
      !category ||
      !quantity ||
      !minimumThreshold ||
      !sendingDept ||
      !receptionDate ||
      !referenceNumber ||
      !referenceDate
    ) {
      return res
        .status(400)
        .json({ message: "يجب تقديم جميع الحقول المطلوبة" });
    }

    const equipment = await prisma.equipmentReception.create({
      data: {
        equipmentName,
        category,
        quantity: parseInt(quantity),
        minimumThreshold: parseInt(minimumThreshold),
        sendingDept,
        receptionDate: new Date(receptionDate),
        reference: reference || null,
        referenceNumber,
        referenceDate: new Date(referenceDate),
        notes: notes || null,
        createdBy: userId,
      },
    });

    console.log(`✅ Equipment created:`, {
      id: equipment.id,
      name: equipment.equipmentName,
      quantity: equipment.quantity,
    });

    return res.status(201).json({
      message: "تم تسجيل استلام التجهيزات بنجاح",
      data: equipment,
    });
  } catch (error) {
    console.error("Create equipment error:", error);
    return res
      .status(500)
      .json({ message: "فشل في تسجيل استلام التجهيزات" });
  }
};

// Get All Equipment Receptions (Read All)
export const getAllEquipmentReceptions = async (req, res) => {
  try {
    const equipments = await prisma.equipmentReception.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        creator: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    console.log(`✅ Retrieved ${equipments.length} equipment records`);

    return res.status(200).json({
      message: "تم استرداد عمليات استلام التجهيزات بنجاح",
      data: equipments,
      count: equipments.length,
    });
  } catch (error) {
    console.error("Get equipments error:", error);
    return res
      .status(500)
      .json({ message: "فشل في استرداد عمليات استلام التجهيزات" });
  }
};

// Get Equipment Reception By ID (Read One)
export const getEquipmentReceptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const equipment = await prisma.equipmentReception.findUnique({
      where: { id: parseInt(id) },
      include: {
        creator: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    if (!equipment) {
      return res.status(404).json({ message: "لم يتم العثور على استلام التجهيزات" });
    }

    console.log(`✅ Retrieved equipment:`, {
      id: equipment.id,
      name: equipment.equipmentName,
    });

    return res.status(200).json({
      message: "تم استرداد استلام التجهيزات بنجاح",
      data: equipment,
    });
  } catch (error) {
    console.error("Get equipment error:", error);
    return res
      .status(500)
      .json({ message: "فشل في استرداد استلام التجهيزات" });
  }
};

// Update Equipment Reception (Update)
export const updateEquipmentReception = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      equipmentName,
      category,
      quantity,
      minimumThreshold,
      sendingDept,
      receptionDate,
      reference,
      referenceNumber,
      referenceDate,
      notes,
    } = req.body;

    const equipment = await prisma.equipmentReception.findUnique({
      where: { id: parseInt(id) },
    });

    if (!equipment) {
      return res.status(404).json({ message: "لم يتم العثور على استلام التجهيزات" });
    }

    const updatedEquipment = await prisma.equipmentReception.update({
      where: { id: parseInt(id) },
      data: {
        equipmentName: equipmentName || equipment.equipmentName,
        category: category || equipment.category,
        quantity: quantity ? parseInt(quantity) : equipment.quantity,
        minimumThreshold: minimumThreshold
          ? parseInt(minimumThreshold)
          : equipment.minimumThreshold,
        sendingDept: sendingDept || equipment.sendingDept,
        receptionDate: receptionDate
          ? new Date(receptionDate)
          : equipment.receptionDate,
        reference: reference !== undefined ? reference : equipment.reference,
        referenceNumber: referenceNumber || equipment.referenceNumber,
        referenceDate: referenceDate
          ? new Date(referenceDate)
          : equipment.referenceDate,
        notes: notes !== undefined ? notes : equipment.notes,
      },
    });

    console.log(`✅ Equipment updated:`, {
      id: updatedEquipment.id,
      name: updatedEquipment.equipmentName,
    });

    return res.status(200).json({
      message: "تم تحديث استلام التجهيزات بنجاح",
      data: updatedEquipment,
    });
  } catch (error) {
    console.error("Update equipment error:", error);
    return res
      .status(500)
      .json({ message: "فشل في تحديث استلام التجهيزات" });
  }
};

// Delete Equipment Reception (Delete)
export const deleteEquipmentReception = async (req, res) => {
  try {
    const { id } = req.params;

    const equipment = await prisma.equipmentReception.findUnique({
      where: { id: parseInt(id) },
    });

    if (!equipment) {
      return res.status(404).json({ message: "لم يتم العثور على استلام التجهيزات" });
    }

    await prisma.equipmentReception.delete({
      where: { id: parseInt(id) },
    });

    console.log(`✅ Equipment deleted:`, { id, name: equipment.equipmentName });

    return res.status(200).json({
      message: "تم حذف استلام التجهيزات بنجاح",
      data: { id: equipment.id },
    });
  } catch (error) {
    console.error("Delete equipment error:", error);
    return res
      .status(500)
      .json({ message: "فشل في حذف استلام التجهيزات" });
  }
};

// Get Equipment By Category
export const getEquipmentByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const equipments = await prisma.equipmentReception.findMany({
      where: { category },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "تم استرداد التجهيزات حسب الفئة",
      data: equipments,
      count: equipments.length,
    });
  } catch (error) {
    console.error("Get equipment by category error:", error);
    return res
      .status(500)
      .json({ message: "فشل في استرداد التجهيزات حسب الفئة" });
  }
};

// Get Low Stock Equipment (quantity below minimum threshold)
export const getLowStockEquipment = async (req, res) => {
  try {
    // Prisma currently doesn't support direct column comparison in where clause
    // We can use $queryRaw or filter in JS. For simplicity and keeping Prisma types, we use filter here.
    const allEquipments = await prisma.equipmentReception.findMany({
      orderBy: { createdAt: "desc" },
    });

    const lowStockEquipments = allEquipments.filter(
      (item) => item.quantity < item.minimumThreshold,
    );

    return res.status(200).json({
      message: "تم استرداد التجهيزات ذات المخزون المنخفض",
      data: lowStockEquipments,
      count: lowStockEquipments.length,
    });
  } catch (error) {
    console.error("Get low stock error:", error);
    return res
      .status(500)
      .json({ message: "فشل في استرداد التجهيزات ذات المخزون المنخفض" });
  }
};

// Get Equipment Stock Summary (Aggregated by name)
export const getEquipmentStockSummary = async (req, res) => {
  try {
    // Get all receptions
    const receptions = await prisma.equipmentReception.findMany();
    // Get all deliveries
    const deliveries = await prisma.equipmentDelivery.findMany();

    // Calculate stock for each equipment name
    const stockMap = {};

    receptions.forEach((rec) => {
      if (!stockMap[rec.equipmentName]) {
        stockMap[rec.equipmentName] = {
          name: rec.equipmentName,
          category: rec.category,
          received: 0,
          delivered: 0,
          stock: 0,
          minimumThreshold: rec.minimumThreshold, // Taking threshold from the latest reception for now
        };
      }
      stockMap[rec.equipmentName].received += rec.quantity;
      stockMap[rec.equipmentName].stock += rec.quantity;
      // Update threshold to the latest reception's threshold
      stockMap[rec.equipmentName].minimumThreshold = rec.minimumThreshold;
    });

    deliveries.forEach((del) => {
      if (stockMap[del.equipmentName]) {
        stockMap[del.equipmentName].delivered += del.quantity;
        stockMap[del.equipmentName].stock -= del.quantity;
      } else {
        // This shouldn't normally happen if data is consistent
        stockMap[del.equipmentName] = {
          name: del.equipmentName,
          category: del.category,
          received: 0,
          delivered: del.quantity,
          stock: -del.quantity,
          minimumThreshold: 0,
        };
      }
    });

    const summary = Object.values(stockMap);

    return res.status(200).json({
      message: "تم استرداد ملخص مخزون التجهيزات بنجاح",
      data: summary,
      count: summary.length,
    });
  } catch (error) {
    console.error("Get stock summary error:", error);
    return res
      .status(500)
      .json({ message: "فشل في استرداد ملخص مخزون التجهيزات" });
  }
};
