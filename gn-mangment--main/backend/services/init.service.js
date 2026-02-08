import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

/**
 * Ensures the default admin user exists in the database.
 * This helps with "Quick Access" working out of the box.
 */
export const ensureDefaultAdmin = async () => {
  try {
    const email = "rejebmohamed@gn.com";
    const passwordRaw = process.env.REJEB_ADMIN_PASSWORD || "rejebmohamed1989";

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      console.log(`🚀 Initializing default admin user: ${email}`);
      const hashedPassword = await bcrypt.hash(passwordRaw, 10);

      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: "محمد رجب",
          role: "ADMIN",
        }
      });
      console.log("✅ Default admin user created successfully.");
    } else {
      console.log("ℹ️ Default admin user already exists.");
    }

    // Also ensure system settings exist
    const settingsCount = await prisma.systemSettings.count();
    if (settingsCount === 0) {
      await prisma.systemSettings.create({
        data: { id: 1, regionName: "منطقة الحرس الوطني بالمتلوي" }
      });
      console.log("✅ Default system settings initialized.");
    }

  } catch (error) {
    // If it's a "table does not exist" error, we just log it
    if (error.code === 'P2021') {
      console.warn("⚠️ Database tables not found. Please run 'npx prisma migrate dev' or 'npx prisma db push'.");
    } else {
      console.error("❌ Failed to initialize default admin:", error.message);
    }
  }
};
