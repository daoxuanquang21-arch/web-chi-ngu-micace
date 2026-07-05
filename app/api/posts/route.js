import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const authorId = url.searchParams.get('authorId');

    const whereClause = {};
    if (status) whereClause.status = status;
    if (authorId) whereClause.authorId = authorId;

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: { author: true, category: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const role = request.headers.get('x-user-role');
    const userId = request.headers.get('x-user-id');
    
    if (!role || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, date, categoryId, coverImage, excerpt, content, status } = body;

    if (!id || !title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // check if ID exists
    const existing = await prisma.post.findUnique({ where: { id } });
    if (existing) {
      return NextResponse.json({ error: 'Post with this ID already exists' }, { status: 400 });
    }

    const newPost = await prisma.post.create({
      data: {
        id,
        title,
        date: date || new Date().toISOString().split('T')[0],
        categoryId: categoryId || null,
        authorId: userId,
        status: status || 'DRAFT',
        coverImage: coverImage || '',
        excerpt: excerpt || '',
        content,
      }
    });

    return NextResponse.json(newPost);
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
