import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, timezone } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use', userExists: true, slug: existingUser.slug },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '');

    // Check if slug is unique
    let uniqueSlug = slug;
    let counter = 1;
    while (true) {
      const existing = await prisma.user.findUnique({
        where: { slug: uniqueSlug }
      });
      if (!existing) break;
      uniqueSlug = `${slug}${counter}`;
      counter++;
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        slug: uniqueSlug,
        timezone: timezone || 'UTC'
      }
    });

    return NextResponse.json({
      success: true,
      slug: user.slug,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
