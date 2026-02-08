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
      name: "Admin User",
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
      name: "Warehouse Manager",
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
      name: "Regular User",
      role: "USER",
    },
  });

  // Seed some equipment receptions
  const equipment = [
    {
      equipmentName: "Laptop Dell XPS",
      category: "IT",
      quantity: 10,
      minimumThreshold: 3,
      sendingDept: "Procurement",
      receptionDate: new Date(),
      referenceNumber: "REC-001",
      referenceDate: new Date(),
      createdBy: admin.id,
    },
    {
      equipmentName: "Office Chair",
      category: "Furniture",
      quantity: 50,
      minimumThreshold: 10,
      sendingDept: "Logistics",
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
