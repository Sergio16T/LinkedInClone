import { Comment } from '@/lib/types';
import prisma from '@/prisma/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

// eslint-disable-next-line no-unused-vars
export async function GET(_: Request, { params }: { params: { id: string } }) {
  // FIRST SOLUTION IS TO QUERY ALL COMMENTS and then construct the response shape here
  // @TODO Review Potential SQL with Recursive CTE to build nested comments in JSON arrays PostgreSQL is pretty powerful with PLPGSQL. Less familiar with SQLLite.

  async function buildResponse(comments: Comment[], depth: number = 0) {
    for (const comment of comments) {
      comment.depth = depth;
    }
    for (const comment of comments) {
      const childComments = await prisma.comment.findMany({
        where: { parentId: comment.id },
        include: {
          account: true,
          reaction: { include: { account: true }, where: { likedBy: 1 }  },
          _count: {
            select: {
              children: true, // count of direct replies where parentId is equal to comment
              reaction:  true }, // total number of likes on comment
          },
        },
      });

      comment.commentThread = childComments;

      if (childComments.length) {
        await buildResponse(comment.commentThread, depth += 1);
      }
    }
  }

  const comments = await prisma.comment.findMany({
    where: { postId: Number(params.id), parentId: null },
    include: {
      account: true,
      reaction: { include: { account: true }, where: { likedBy: 1 }  },
      _count: {
        select: {
          children: true, // count of direct replies where parentId is equal to comment
          reaction: true }, // number of likes
      },
    },
  });

  await buildResponse(comments);

  return NextResponse.json(comments);
}
