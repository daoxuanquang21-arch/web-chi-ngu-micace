import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const role = request.headers.get('x-user-role');
    if (role !== 'ADMIN' && role !== 'EDITOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, slug } = await request.json();
    const category = await prisma.category.create({
      data: { name, slug }
    });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Không thể tạo danh mục' }, { status: 500 });
  }
}
