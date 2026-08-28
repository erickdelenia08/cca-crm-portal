import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/prisma/generated/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
    const adapter = new PrismaMariaDb({
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "rootpassword",
        database: process.env.DB_NAME || "crm_db",
        connectionLimit: 5,
    });

    return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;