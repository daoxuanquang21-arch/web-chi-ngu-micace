import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const role = request.headers.get('x-user-role');
    if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, role: true, createdAt: true }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const role = request.headers.get('x-user-role');
    if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { email, password, userRole } = await request.json();
    const passwordHash = await bcrypt.hash(password, 10);
    const username = email.split('@')[0] + '-' + Math.floor(Math.random() * 10000);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        role: userRole || 'AUTHOR'
      }
    });

    return NextResponse.json({ success: true, user: { id: user.id, username: user.username } });
  } catch (error) {
    require('fs').writeFileSync('error_log.txt', error.message);
    console.error(error);
    return NextResponse.json({ error: error.message || 'Không thể tạo user' }, { status: 500 });
  }
}
