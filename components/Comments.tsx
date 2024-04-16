import React from 'react';
import { CardRow } from '@/components/Card';

import { Comment } from '@/lib/types';
import PostComment from './PostComment';

type Props = {
  children?: React.ReactNode;
  comments: Comment[];
  count?: number;
}


function PostComments({ comments }: Props) {
  return (
    <CardRow className="px-0 py-0 pl-3 grow flex-col">
      {comments.map((comment, index) =>
        <PostComment
          comment={comment}
          key={index}
        />,
      )}
    </CardRow>
  );
}

export default PostComments;