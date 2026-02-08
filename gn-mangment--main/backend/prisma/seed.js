// Prisma seed file for database initialization
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: adminPassword,
      name: "المسؤول العام",
      role: "ADMIN",
    },
  });

  // Create Manager User
  const managerPassword = await bcrypt.hash("manager123", 10);
  const manager = await prisma.user.upsert({
    where: { email: "manager@example.com" },
    update: {},
    create: {
      email: "manager@example.com",
      password: managerPassword,
      name: "مدير المستودع",
      role: "MANAGER",
    },
  });

  // Create Regular User
  const userPassword = await bcrypt.hash("user123", 10);
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      password: userPassword,
      name: "مستخدم عادي",
      role: "USER",
    },
  });

  // Seed some equipment receptions
  const equipment = [
    {
      equipmentName: "حاسوب محمول Dell XPS",
      category: "تكنولوجيا المعلومات",
      quantity: 10,
      minimumThreshold: 3,
      sendingDept: "قسم المشتريات",
      receptionDate: new Date(),
      referenceNumber: "REC-001",
      referenceDate: new Date(),
      createdBy: admin.id,
    },
    {
      equipmentName: "كرسي مكتب",
      category: "أثاث",
      quantity: 50,
      minimumThreshold: 10,
      sendingDept: "قسم اللوجستيك",
      receptionDate: new Date(),
      referenceNumber: "REC-002",
      referenceDate: new Date(),
      createdBy: manager.id,
    },
  ];

  for (const item of equipment) {
    await prisma.equipmentReception.create({
      data: item,
    });
  }

  // Seed Financial Credits
  await prisma.financialCredit.create({
    data: {
      description: "ميزانية التجهيزات السنوية",
      totalAmount: 100000,
      remainingAmount: 95000,
      spentAmount: 5000,
      year: 2024,
      createdBy: admin.id,
    }
  });

  // Seed Real Estate
  await prisma.realEstateStatus.create({
    data: {
      unitName: "المقر الجهوي بالمتلوي",
      location: "وسط مدينة المتلوي",
      status: "ملك",
      area: 2500,
      legalStatus: "مسجل",
      createdBy: admin.id,
    }
  });

  // Seed Vehicles
  const vehicle = await prisma.administrativeVehicle.create({
    data: {
      plateNumber: "123 تونس 456",
      vehicleType: "4x4",
      brand: "تويوتا",
      model: "لاند كروزر",
      assignedUnit: "وحدة التدخل",
      status: "وظيفية",
      createdBy: manager.id,
    }
  });

  // Seed Maintenance
  await prisma.maintenanceRecord.create({
    data: {
      vehicleId: vehicle.id,
      maintenanceDate: new Date(),
      description: "تغيير زيت وفحص الفرامل",
      cost: 450.5,
      garage: "الورشة المركزية",
      createdBy: manager.id,
    }
  });

  // Seed Fuel
  await prisma.fuelRecord.create({
    data: {
      unit: "وحدة التدخل",
      amount: 200,
      fuelType: "ديزل",
      couponNumbers: "C-9001 إلى C-9020",
      date: new Date(),
      createdBy: manager.id,
    }
  });

  // Seed Settings
  await prisma.systemSettings.upsert({
    where: { id: 1 },
    update: { regionName: "منطقة الحرس الوطني بالمتلوي" },
    create: { id: 1, regionName: "منطقة الحرس الوطني بالمتلوي" },
  });

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
