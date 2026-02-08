import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Equipment Delivery
export const createEquipmentDelivery = async (req, res) => {
  try {
    const {
      equipmentName,
      category,
      quantity,
      beneficiaryUnit,
      beneficiary,
      receiver,
      deliveryDate,
      referenceNumber,
      referenceDate,
      warehouseManager,
      unitHead,
      notes,
    } = req.body;

    const deliveredBy = req.user.id; // المسلم هو المستخدم الحالي

    // Validate required fields
    if (
      !equipmentName ||
      !category ||
      !quantity ||
      !beneficiaryUnit ||
      !beneficiary ||
      !receiver ||
      !deliveryDate ||
      !referenceNumber ||
      !referenceDate ||
      !warehouseManager ||
      !unitHead
    ) {
      return res.status(400).json({
        message: "يجب تقديم جميع الحقول المطلوبة",
      });
    }

    // التحقق من أن warehouseManager موجود ولديه صلاحيات Manager
    const managerUser = await prisma.user.findFirst({
      where: {
        name: warehouseManager,
        role: "MANAGER",
      },
    });

    if (!managerUser) {
      return res.status(400).json({
        message: "يجب أن يكون مدير المستودع مستخدماً بدور مدير (MANAGER)",
      });
    }

    // Check stock availability
    const receptions = await prisma.equipmentReception.findMany({
      where: { equipmentName },
    });
    const deliveries = await prisma.equipmentDelivery.findMany({
      where: { equipmentName },
    });

    const totalReceived = receptions.reduce((sum, rec) => sum + rec.quantity, 0);
    const totalDelivered = deliveries.reduce(
      (sum, del) => sum + del.quantity,
      0,
    );
    const currentStock = totalReceived - totalDelivered;

    if (currentStock < parseInt(quantity)) {
      return res.status(400).json({
        message: `المخزون غير كافٍ لـ ${equipmentName}`,
        requested: parseInt(quantity),
        available: currentStock,
      });
    }

    const delivery = await prisma.equipmentDelivery.create({
      data: {
        equipmentName,
        category,
        quantity: parseInt(quantity),
        beneficiaryUnit,
        beneficiary,
        receiver,
        deliveredBy,
        deliveryDate: new Date(deliveryDate),
        referenceNumber,
        referenceDate: new Date(referenceDate),
        warehouseManager,
        unitHead,
        notes: notes || null,
      },
    });

    console.log(`✅ Equipment delivered:`, {
      id: delivery.id,
      equipment: delivery.equipmentName,
      to: delivery.beneficiary,
      quantity: delivery.quantity,
    });

    return res.status(201).json({
      message: "تم تسجيل تسليم التجهيزات بنجاح",
      data: delivery,
    });
  } catch (error) {
    console.error("Create delivery error:", error);
    return res.status(500).json({
      message: "فشل في تسجيل تسليم التجهيزات",
      error: error.message,
    });
  }
};

// Get All Equipment Deliveries
export const getAllEquipmentDeliveries = async (req, res) => {
  try {
    const deliveries = await prisma.equipmentDelivery.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        deliverer: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    console.log(`✅ Retrieved ${deliveries.length} delivery records`);

    return res.status(200).json({
      message: "تم استرداد عمليات تسليم التجهيزات بنجاح",
      data: deliveries,
      count: deliveries.length,
    });
  } catch (error) {
    console.error("Get deliveries error:", error);
    return res.status(500).json({
      message: "فشل في استرداد عمليات تسليم التجهيزات",
    });
  }
};

// Get Equipment Delivery By ID
export const getEquipmentDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await prisma.equipmentDelivery.findUnique({
      where: { id: parseInt(id) },
      include: {
        deliverer: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    if (!delivery) {
      return res.status(404).json({ message: "لم يتم العثور على تسليم التجهيزات" });
    }

    console.log(`✅ Retrieved delivery:`, {
      id: delivery.id,
      equipment: delivery.equipmentName,
    });

    return res.status(200).json({
      message: "تم استرداد تسليم التجهيزات بنجاح",
      data: delivery,
    });
  } catch (error) {
    console.error("Get delivery error:", error);
    return res.status(500).json({
      message: "فشل في استرداد تسليم التجهيزات",
    });
  }
};

// Update Equipment Delivery
export const updateEquipmentDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      equipmentName,
      category,
      quantity,
      beneficiaryUnit,
      beneficiary,
      receiver,
      deliveryDate,
      referenceNumber,
      referenceDate,
      warehouseManager,
      unitHead,
      notes,
    } = req.body;

    const delivery = await prisma.equipmentDelivery.findUnique({
      where: { id: parseInt(id) },
    });

    if (!delivery) {
      return res.status(404).json({ message: "لم يتم العثور على تسليم التجهيزات" });
    }

    // إذا تم تحديث warehouseManager، تحقق من أنه Manager
    if (warehouseManager && warehouseManager !== delivery.warehouseManager) {
      const managerUser = await prisma.user.findFirst({
        where: {
          name: warehouseManager,
          role: "MANAGER",
        },
      });

      if (!managerUser) {
        return res.status(400).json({
          message: "يجب أن يكون مدير المستودع مستخدماً بدور مدير (MANAGER)",
        });
      }
    }

    const updatedDelivery = await prisma.equipmentDelivery.update({
      where: { id: parseInt(id) },
      data: {
        equipmentName: equipmentName || delivery.equipmentName,
        category: category || delivery.category,
        quantity: quantity ? parseInt(quantity) : delivery.quantity,
        beneficiaryUnit: beneficiaryUnit || delivery.beneficiaryUnit,
        beneficiary: beneficiary || delivery.beneficiary,
        receiver: receiver || delivery.receiver,
        deliveryDate: deliveryDate
          ? new Date(deliveryDate)
          : delivery.deliveryDate,
        referenceNumber: referenceNumber || delivery.referenceNumber,
        referenceDate: referenceDate
          ? new Date(referenceDate)
          : delivery.referenceDate,
        warehouseManager: warehouseManager || delivery.warehouseManager,
        unitHead: unitHead || delivery.unitHead,
        notes: notes !== undefined ? notes : delivery.notes,
      },
    });

    console.log(`✅ Delivery updated:`, {
      id: updatedDelivery.id,
      equipment: updatedDelivery.equipmentName,
    });

    return res.status(200).json({
      message: "تم تحديث تسليم التجهيزات بنجاح",
      data: updatedDelivery,
    });
  } catch (error) {
    console.error("Update delivery error:", error);
    return res.status(500).json({
      message: "فشل في تحديث تسليم التجهيزات",
    });
  }
};

// Delete Equipment Delivery
export const deleteEquipmentDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await prisma.equipmentDelivery.findUnique({
      where: { id: parseInt(id) },
    });

    if (!delivery) {
      return res.status(404).json({ message: "لم يتم العثور على تسليم التجهيزات" });
    }

    await prisma.equipmentDelivery.delete({
      where: { id: parseInt(id) },
    });

    console.log(`✅ Delivery deleted:`, {
      id,
      equipment: delivery.equipmentName,
    });

    return res.status(200).json({
      message: "تم حذف تسليم التجهيزات بنجاح",
      data: { id: delivery.id },
    });
  } catch (error) {
    console.error("Delete delivery error:", error);
    return res.status(500).json({
      message: "فشل في حذف تسليم التجهيزات",
    });
  }
};

// Get Deliveries by Beneficiary Unit
export const getDeliveriesByUnit = async (req, res) => {
  try {
    const { unit } = req.params;

    const deliveries = await prisma.equipmentDelivery.findMany({
      where: { beneficiaryUnit: unit },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "تم استرداد عمليات التسليم حسب الوحدة",
      data: deliveries,
      count: deliveries.length,
    });
  } catch (error) {
    console.error("Get deliveries by unit error:", error);
    return res.status(500).json({
      message: "فشل في استرداد عمليات التسليم حسب الوحدة",
    });
  }
};

// Get Deliveries by Date Range
export const getDeliveriesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "تاريخ البدء وتاريخ الانتهاء مطلوبان",
      });
    }

    const deliveries = await prisma.equipmentDelivery.findMany({
      where: {
        deliveryDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: { deliveryDate: "desc" },
    });

    return res.status(200).json({
      message: "تم استرداد عمليات التسليم حسب النطاق الزمني",
      data: deliveries,
      count: deliveries.length,
    });
  } catch (error) {
    console.error("Get deliveries by date error:", error);
    return res.status(500).json({
      message: "فشل في استرداد عمليات التسليم حسب النطاق الزمني",
    });
  }
};
