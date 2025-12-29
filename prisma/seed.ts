import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting seed...');

  // Delete existing data
  await prisma.booking.deleteMany();
  await prisma.workingHours.deleteMany();
  await prisma.user.deleteMany();

  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
      slug: 'johndoe',
      timezone: 'America/New_York',
    },
  });

  console.log('✅ Created user:', user.name);

  // Create working hours (Monday to Friday, 9 AM - 5 PM)
  for (let day = 1; day <= 5; day++) {
    await prisma.workingHours.create({
      data: {
        userId: user.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '17:00',
        timezone: 'America/New_York',
      },
    });
  }

  console.log('✅ Created working hours (Mon-Fri, 9 AM - 5 PM)');
  
  // Add your seed data here
  // Example:
  // const user = await prisma.user.create({
  //   data: {
  //     email: 'demo@example.com',
  //     name: 'Demo User'
  //   }
  // })
  
  console.log('✅ Seed completed successfully')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })