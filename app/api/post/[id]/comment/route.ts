import { NextResponse, NextRequest } from 'next/server';
import { Nullable } from '@/lib/types';
import prisma from '@/prisma/db';

type Body = {
  comment: string;
  parentId: Nullable<number>;
}

export async function POST(request: NextRequest, { params }: { params: { id: string }}) {
  const reqBody: Body = await request.json();
  const { id  } = params;

  try {
    if (!id || !reqBody.comment) {
      return new NextResponse('Invalid Request', {
        status: 400,
      });
    } else {
      const newComment = await prisma.comment.create({
        data: {
          body: reqBody.comment,
          postId: Number(id),
          createdBy: 1, // Logged In User
          parentId: reqBody.parentId,
        },
      });
      return NextResponse.json(newComment);
    }
  } catch (error) {
    console.error(error);
    return new NextResponse('Unknown Error', {
      status: 500,
    });
  }
}
