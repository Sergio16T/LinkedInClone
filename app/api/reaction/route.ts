import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/prisma/db';
import { Nullable } from '@/lib/types';

type Body = {
  postId: Nullable<number>;
  commentId: Nullable<number>;
}

export async function POST(request: NextRequest) {
  const reqBody: Body = await request.json();
  try {
    // validate request references a post or comment but not both
    if ((!reqBody.postId && !reqBody.commentId) || (reqBody.postId && reqBody.commentId)) {
      return new NextResponse('Invalid Request', {
        status: 400,
      });
    } else {
      const newReaction = await prisma.reactionInsights.create({
        data: {
          likedBy: 1,
          postId: reqBody.postId,
          commentId: reqBody.commentId,
        },
      });
      return NextResponse.json(newReaction);
    }

  } catch (error) {
    console.error(error);
    return new NextResponse('Unknown Error', {
      status: 500,
    });
  }
}
