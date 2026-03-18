// npx tsx prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const positions = [
    { name: "UX_UI", salary: 18000 },
    { name: "Frontend", salary: 20000 },
    { name: "Backend", salary: 20000 },
    { name: "FullStack", salary: 30000 },
    { name: "Tester", salary: 18000 },
    { name: "DevOps", salary: 25000 },
    { name: "ProjectManager", salary: 15000 },
  ];

  for (const pos of positions) {
    await prisma.position.upsert({
      where: { name: pos.name },
      update: {},
      create: pos,
    });
  }

  console.log("Positions seeded ✅");

  // --- สร้าง Admin User ---
  const passwordHash = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@gmail.com",
      password: passwordHash,
      role: Role.Admin,
      positionId: 4,
    },
  });

  // --- สร้าง Manager User ---
  await prisma.user.upsert({
    where: { email: "manager@gmail.com" },
    update: {},
    create: {
      name: "Manager",
      email: "manager@gmail.com",
      password: passwordHash,
      role: Role.Manager,
      positionId: 7,
    },
  });

  console.log("Users seeded ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
