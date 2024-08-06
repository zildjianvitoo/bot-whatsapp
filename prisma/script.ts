const { PrismaClient } = require("@prisma/client");

const prismadb = new PrismaClient();

async function createBot() {
  await prismadb.bot.create({
    data: {
      status: "offline ",
    },
  });
}

createBot();
