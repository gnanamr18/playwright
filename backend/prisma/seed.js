/**
 * Hardcoded demo accounts (passwords live in code, not the DB).
 * Profiles are created empty so you can fill them in the UI.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_USERS = ["alice", "bob"];

async function main() {
  for (const username of DEMO_USERS) {
    await prisma.user.upsert({
      where: { username },
      update: {},
      create: { username },
    });
  }
  console.log("Seeded users:", DEMO_USERS.join(", "));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
