import { PrismaClient } from '@/app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

let prisma: PrismaClient;

function getClient(): PrismaClient {
  if (!prisma) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    const pool = new Pool({
      connectionString: databaseUrl,
    });

    const adapter = new PrismaPg(pool);

    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}

async function disconnect(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null as any;
  }
}

process.on('SIGINT', async () => {
  await disconnect();
  process.exit(0);
});

export { getClient, disconnect, PrismaClient };
