import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: 'admin@paroquia.com' } });

  if (!existing) {
    const hash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@paroquia.com',
        password: hash,
      },
    });
    console.log('✅ Admin criado: admin@paroquia.com / admin123');
  } else {
    console.log('ℹ️  Admin já existe, seed ignorado.');
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
