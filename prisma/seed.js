const { Client } = require('pg');

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const client = new Client({ connectionString });
  await client.connect();

  try {
    // Insert a user
    const res = await client.query(
      `INSERT INTO "User" (id, email, name, timezone, slug, "createdAt") VALUES (gen_random_uuid()::text, $1, $2, $3, $4, now()) RETURNING id`,
      ['alice@example.com', 'Alice', 'UTC', 'alice']
    );
    const userId = res.rows[0].id;

    // Insert working hours
    await client.query(
      `INSERT INTO "WorkingHours" (id, "userId", "dayOfWeek", "startTime", "endTime", timezone) VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5)`,
      [userId, 1, '09:00', '17:00', 'UTC']
    );

    console.log('Seed data created (pg)');
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
