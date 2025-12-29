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
  await prisma.mentor.deleteMany();
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

  // Create mentors
  const mentors = await prisma.mentor.createMany({
    data: [
      {
        userId: user.id,
        name: 'John Mitchell',
        title: 'Senior Tech Mentor',
        bio: '10+ years leading engineering teams at Fortune 500 companies. Expert in career transitions and technical growth.',
      },
      {
        userId: user.id,
        name: 'Sarah Chen',
        title: 'Career & Interview Coach',
        bio: 'Specializes in resume optimization, interview prep, and salary negotiation. Helped 500+ candidates land dream jobs.',
      },
      {
        userId: user.id,
        name: 'Mike Rodriguez',
        title: 'System Design Expert',
        bio: 'Platform architect with expertise in scalable systems. Focus on technical interviews and architectural decisions.',
      },
      {
        userId: user.id,
        name: 'Emma Thompson',
        title: 'Portfolio & Brand Specialist',
        bio: 'Builds personal brands and impressive portfolios. Expert in LinkedIn optimization and personal branding strategy.',
      },
      {
        userId: user.id,
        name: 'David Park',
        title: 'Startup Advisor',
        bio: 'Founded 2 successful startups and advised 20+. Deep expertise in entrepreneurship and startup strategy.',
      },
      {
        userId: user.id,
        name: 'Lisa Anderson',
        title: 'Product Management Coach',
        bio: 'Led product teams at tech giants. Specializes in PM interviews, roadmaps, and product strategy mentoring.',
      },
    ],
  });

  console.log('✅ Created 6 default mentors');
  
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