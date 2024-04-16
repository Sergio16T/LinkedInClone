import prisma from '@/prisma/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_: Request, { params }: { params: { id: string } }) {

  const posts = await prisma.reactionInsights.findMany({
    where: {
      postId: Number(params.id),
      NOT: {
        likedBy: 1, // Logged in Account
      },
    },
    include: {
      account: {
        include: {
          accountType: true,
        },
      },
    },
  });

  return NextResponse.json(posts);
}