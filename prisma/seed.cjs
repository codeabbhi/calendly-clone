const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      timezone: 'UTC',
      slug: 'alice',
    },
  });

  await prisma.workingHours.create({
    data: {
      userId: user.id,
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '17:00',
      timezone: 'UTC',
    },
  });

  console.log('Seed data created (prisma client)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
