import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ROLES } from '@/app/types/types';
import { nextAuthSecret } from '@/app/utils/env';

/**
 * @swagger
 * /api/posts:
 *   get:
 *     description: Returns the posts list
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *        description: Internal Server Error
 */
export async function GET(request: Request) {
  try {
    const posts = await prisma.post.findMany();

    return NextResponse.json(posts);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

/**
 * @swagger
 * /api/posts:
 *   post:
 *     description: Creates a new post
 *     responses:
 *       201:
 *         description: Success
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: nextAuthSecret });

    if (token?.role === ROLES.ADMIN) {
      const json = await request.json();

      const post = await prisma.post.create({
        data: json
      });

      return new NextResponse(JSON.stringify(post), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new NextResponse('Unauthorized', { status: 401 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
