import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/prisma/db';



// HARD DELETE. We could do a soft delete but for a reaction I think an AUDIT_ACTION record would be sufficient. So in the future add support for audit actions.
export async function DELETE(request: NextRequest, { params }: { params: { id: string }}) {
  const { id  } = params;

  try {
    // validate request references a post
    if (!id) {
      return new NextResponse('Invalid Request', {
        status: 400,
      });
    }

    const deletedReaction = await prisma.reactionInsights.deleteMany({ // Only 1 record will exist where these conditions match
      where: { postId: Number(id), likedBy: 1 }, // we may not have the reactionInsightId due to how we're pre-emptively updating feed post before a successful like
    });

    return NextResponse.json(deletedReaction);
  } catch (error) {
    console.error(error);
    return new NextResponse('Unknown Error', {
      status: 500,
    });
  }
}
