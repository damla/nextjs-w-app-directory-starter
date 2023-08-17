import { ROLES } from '@/app/types/types';
import { nextAuthSecret } from '@/app/utils/env';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     description: Returns the post data with the specific id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the post to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: No post with the ID found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const post = await prisma.post.findUnique({
      where: {
        id
      }
    });

    if (!post) {
      return new NextResponse('No post with the ID found', {
        status: 404
      });
    }
    return NextResponse.json(post);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

/**
 * @swagger
 * /api/posts/{id}:
 *   patch:
 *     description: Update the post data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the post to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: No post with the ID found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request, secret: nextAuthSecret });

    if (token?.role === ROLES.ADMIN) {
      const id = params.id;
      let json = await request.json();

      const updated_post = await prisma.post.update({
        where: { id },
        data: json
      });

      if (!updated_post) {
        return new NextResponse('No post with the ID found', { status: 404 });
      }

      return NextResponse.json(updated_post);
    }

    return new NextResponse('Unauthorized', { status: 401 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     description: Delete the post data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the post to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No post with ID found
 *       500:
 *        description: Internal Server Error
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request, secret: nextAuthSecret });
    if (token?.role === ROLES.ADMIN) {
      const id = params.id;
      await prisma.post.delete({
        where: { id }
      });

      return new NextResponse(null, { status: 204 });
    }
    return new NextResponse('Unauthorized', { status: 401 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new NextResponse('No post with the ID found', { status: 404 });
    }

    return new NextResponse(error.message, { status: 500 });
  }
}