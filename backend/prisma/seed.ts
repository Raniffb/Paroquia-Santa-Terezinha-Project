import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ── Admin ────────────────────────────────────────────────────────────────────

async function seedAdmin(): Promise<void> {
  const email    = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name     = process.env.ADMIN_NAME ?? 'Administrador';

  if (!email || !password) {
    console.warn('');
    console.warn('⚠️  ADMIN_EMAIL ou ADMIN_PASSWORD não definidos.');
    console.warn('   Seed do admin ignorado. Para criar o administrador:');
    console.warn('   1. Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env');
    console.warn('   2. Execute: npx prisma db seed');
    console.warn('');
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('ℹ️  Usuário admin já existe, seed ignorado.');
    return;
  }

  const hash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, email, password: hash } });
  console.log(`✅ Admin criado: ${email}`);
}

// ── Horários de missa ────────────────────────────────────────────────────────

async function seedMissas(): Promise<void> {
  const count = await prisma.massSchedule.count();
  if (count > 0) {
    console.log('ℹ️  Horários já existem, seed ignorado.');
    return;
  }

  await prisma.massSchedule.createMany({
    data: [
      { day: 'Segunda-feira', times: '07h00' },
      { day: 'Terça-feira',   times: '07h00' },
      { day: 'Quarta-feira',  times: '07h00,19h00' },
      { day: 'Quinta-feira',  times: '07h00' },
      { day: 'Sexta-feira',   times: '07h00,19h00' },
      { day: 'Sábado',        times: '07h00,18h00' },
      { day: 'Domingo',       times: '07h00,09h00,11h00,18h00' },
    ],
  });
  console.log('✅ Horários de missa criados (7 dias).');
}

// ── Sacramentos ──────────────────────────────────────────────────────────────

async function seedSacramentos(): Promise<void> {
  const count = await prisma.sacramento.count();
  if (count > 0) {
    console.log('ℹ️  Sacramentos já existem, seed ignorado.');
    return;
  }

  await prisma.sacramento.createMany({
    data: [
      {
        title: 'Batismo',
        description:
          'Celebrado aos domingos, às 12h30. Inscrições e preparação na secretaria paroquial. Exige participação em reunião preparatória.',
        icon: 'pi-drop',
        sortOrder: 1,
      },
      {
        title: 'Casamento',
        description:
          'Agendar com mínimo de 6 meses de antecedência. Curso pré-matrimonial obrigatório. Procure a secretaria para orientações.',
        icon: 'pi-heart-fill',
        sortOrder: 2,
      },
      {
        title: 'Intenção de Missa',
        description:
          'Solicite missa em intenção de um familiar (vivo ou falecido) na secretaria paroquial durante o horário de atendimento.',
        icon: 'pi-bookmark',
        sortOrder: 3,
      },
      {
        title: 'Unção dos Enfermos',
        description:
          'Em caso de emergência ou doença grave, entre em contato com a secretaria para solicitar visita e unção dos enfermos em domicílio.',
        icon: 'pi-home',
        sortOrder: 4,
      },
    ],
  });
  console.log('✅ Sacramentos criados (4 itens).');
}

// ── Informações Importantes ──────────────────────────────────────────────────

async function seedHorariosInfo(): Promise<void> {
  const count = await prisma.horariosInfo.count();
  if (count > 0) {
    console.log('ℹ️  Informações de horários já existem, seed ignorado.');
    return;
  }

  await prisma.horariosInfo.createMany({
    data: [
      {
        title: 'Horários especiais',
        description:
          'Em dias de festas litúrgicas especiais (Natal, Semana Santa, Corpus Christi, festa da padroeira) os horários podem ser alterados. Acompanhe os avisos.',
        sortOrder: 1,
      },
      {
        title: 'Missa de intenção',
        description:
          'Para solicitar missa em intenção de alguém (falecidos, enfermos, aniversariantes etc.), procure a secretaria paroquial durante o horário de atendimento.',
        sortOrder: 2,
      },
      {
        title: 'Acessibilidade',
        description:
          'A Igreja conta com rampa de acesso para cadeirantes, espaço reservado para pessoas com mobilidade reduzida e loop indutivo para deficientes auditivos.',
        sortOrder: 3,
      },
    ],
  });
  console.log('✅ Informações de horários criadas (3 itens).');
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  await seedAdmin();
  await seedMissas();
  await seedSacramentos();
  await seedHorariosInfo();
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
