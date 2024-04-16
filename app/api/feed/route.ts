import { NextResponse } from 'next/server';
import prisma from '@/prisma/db';

export const dynamic = 'force-dynamic'

export async function GET() {
  const posts = await prisma.post.findMany({
    include: {
      account: {
        include: {
          accountType: true,
        },
      },
      reaction: {
        include: { account: true },
        where: { likedBy: 1 }, // liked by account ID of current signin user
      },
      _count: {
        select: { commentList: true, reaction: true },
      },
    },
  });

  return NextResponse.json(posts);
}