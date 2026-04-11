type PrismaClientType = import("@prisma/client").PrismaClient;

declare global {
  var prismaGlobal: PrismaClientType | undefined;
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPrismaClient() {
  if (!hasDatabaseUrl()) {
    throw new Error("DATABASE_URL não configurada.");
  }

  if (!global.prismaGlobal) {
    const { PrismaClient } = require("@prisma/client") as typeof import("@prisma/client");
    global.prismaGlobal = new PrismaClient({
      log: ["error"]
    });
  }

  return global.prismaGlobal;
}
