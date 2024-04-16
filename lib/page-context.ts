'use client';

import React from 'react';
import { Post, ModalState } from '@/lib/types';

type PostFeedContext = {
  feed: Post[];
  setFeed?: React.Dispatch<React.SetStateAction<Post[]>>;
  dispatchErrorAlert?:  (m: string) => void;
  setReactionInsightModalState?: React.Dispatch<React.SetStateAction<ModalState>>;
}

const FeedContext = React.createContext<PostFeedContext>({
  feed: [],
});


export default FeedContext;