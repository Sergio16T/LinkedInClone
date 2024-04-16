import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/prisma/db';


// HARD DELETE. We could do a soft delete but for a reaction I think an AUDIT_ACTION record would be sufficient. So in the future add support for audit actions.
export async function DELETE(request: NextRequest, { params }: { params: { commentId: string }}) {
  const { commentId  } = params;

  try {
    // validate request references a comment
    if (!commentId) {
      return new NextResponse('Invalid Request', {
        status: 400,
      });
    }

    const deletedReaction = await prisma.reactionInsights.deleteMany({
      where: { commentId: Number(commentId), likedBy: 1 }, // we may not have the reactionInsightId //since we're hard deleting we can be guaranteed there will be only 1 record if it exists
    });

    return NextResponse.json(deletedReaction);
  } catch (error) {
    console.error(error);
    return new NextResponse('Unknown Error', {
      status: 500,
    });
  }
}
