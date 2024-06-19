'use client';

import React, { useState, useContext, useMemo, useCallback }  from 'react';
import KebobMenu from '@/components/KebobMenu';
import CommentIcon from '@/components/Icon/Comment';
import MiniThumbsUpIcon from '@/components/Icon/MiniThumbsUp';
import ThumpsUpIcon from '@/components/Icon/ThumbsUp';
import { Card, CardContent, CardFooter, CardHeader, CardRow, CardTitle } from '@/components/Card';
import Image from 'next/image';

import { Post, Comment, AccountTypeEnum } from '@/lib/types';
import PostComments from './Comments';
import FeedContext from '@/lib/page-context';

import SolidThumbsUp from './Icon/SolidThumbsUp';
import TextArea from './Form/TextArea';
import { Button } from './Button';
import EmojiActionMenu from './Form/EmojiActionMenu';

type Props = {
  children?: React.ReactNode;
  post: Post;
}

type CommentListContext = {
  comments: Comment[];
  setComments?: React.Dispatch<React.SetStateAction<Comment[]>>;
  getPostComments?: () => Promise<void>;
}

const PostCommentListContext = React.createContext<CommentListContext>({
  comments: [],
});

function PostItem({ post }: Props ) {
  // const [commentsLoading, setCommentsLoading] = useState(true); // review loading state currently not using
  const [comments, setComments] = useState<Comment[]>([]);
  const [viewCommentField, setViewCommentField] = useState(false);
  const { feed, setFeed, dispatchErrorAlert, setReactionInsightModalState } = useContext(FeedContext);
  const [state, setState] = useState({
    comment: '',
    commentError: '', // textarea validation error
    postingComment: false,
    showEmojiPicker: false,
  }); // textarea state


  /* ************************************** */
  /* ************* COMMENTS  ************** */
  /* ************************************** */

  const getPostComments = useCallback(async () => {
    try {
      // setCommentsLoading(true);

      const response = await fetch(`${location.protocol + '//' + location.host}/api/post/${post.id}/comments`);
      if (!response.ok) {
        throw new Error(`HTTP Status: ${response.status} Request URL:  ${response.url}`);
      }
      const comments = await response.json();

      setComments(comments);
    } catch (error) {
      console.log(error);
      dispatchErrorAlert!('Sorry, we weren\'t able to retrieve the comment(s) at this time. Please try again later.');
    } finally {
      // setCommentsLoading(false);
    }
  }, [post.id, dispatchErrorAlert]);


  const addComment = async () => {
    // open comment view / display text area
    if (post._count.commentList ) {
      getPostComments();
    }
    setViewCommentField(true);
  }

  const postComment = async () => {
    try {
      // @TODO validate characters
      setState({
        ...state,
        postingComment: true,
      })

      const response = await fetch(`${location.protocol + '//' + location.host}/api/post/${post.id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: state.comment,
          parentId: null,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP Status: ${response.status} Request URL:  ${response.url}`);
      }
      // Update the Post Comments Count at Feed level of component tree without refetching entire feed.
      const updatedFeed = feed.map(p => {
        if (p.id === post.id) {
          return {
            ...p,
            comments: post._count.commentList  += 1,
          }
        }
        return p;
      });
      setFeed!(updatedFeed);


      // Wait for successful response..
      await getPostComments();
      setViewCommentField(false);
      setState({
        comment: '',
        commentError: '',
        postingComment: false,
        showEmojiPicker: false,
      });
    } catch (error) {
      console.error(error);
      dispatchErrorAlert!('Sorry, we weren\'t able to create your comment at this time. Please try again later.');
      setState({
        ...state,
        postingComment: false,
      });
    }
  }


  /* ************************************** */
  /* ********* REACTION INSIGHTS  ********* */
  /* ************************************** */

  const getReactionInsights = () => {
    setReactionInsightModalState!({
      open: true,
      item: post,
    });
  }


  /* ************************************** */
  /* *********** LIKE/DISLIKE ************* */
  /* ************************************** */

  const toggleLike = async () => {
    let action = '';
    const updatedFeed = feed.map(p => {
      if (p.id === post.id) {
        if (!p.reaction.length) {
          action = 'LIKE';
          return {
            ...p,
            reaction: [{
              account: {
                // fill in account details for logged in user available in context or redux depending on global state management method
                id: 1,
                email: 'alonso@prisma.io',
                username: 'Alonso Oliveira',
                headline: 'Senior Software Engineer at Digital Ocean',
                photoUrl: 'https://media.licdn.com/dms/image/D4D0BAQEAFSZno0_znA/company-logo_100_100/0/1707299657994/digitalocean_logo?e=1721260800&v=beta&t=kldj5xzrq2sIg9PQR8ZVuvjbHmlPX2Vns2SlbHCRVfw',
                accountTypeId: 2,
                followerCount: 200,
              },
              likedBy: 1, // user account id,
              likedOn: new Date(),
              postId: p.id,
              commentId: null,
            }],
            _count: {
              ...p._count,
              reaction: p._count.reaction += 1,
            },
          }
        } else {
          action = 'DISLIKE';
          return {
            ...p,
            reaction: [],
            _count: {
              ...p._count,
              reaction: p._count.reaction ? post._count.reaction -= 1 : 0,
            },
          }
        }
      }
      return p;
    });
    setFeed!(updatedFeed);

    if (action === 'LIKE') {
      /* ********************************** */
      /* ***** API CALL TO LIKE POST ******  */
      /* ********************************** */
      try {
        const response = await fetch(`${location.protocol + '//' + location.host}/api/reaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId: post.id,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP Status: ${response.status} Request URL:  ${response.url}`);
        }
      } catch (error) {
        // Revert Eager Post Update
        const updatedFeed = feed.map(p => {
          if (p.id === post.id) {
            return {
              ...p,
              reaction: [],
              _count: {
                ...p._count,
                reaction: p._count.reaction ? post._count.reaction -= 1 : 0,
              },
            }
          }
          return p;
        });
        setFeed!(updatedFeed);
        dispatchErrorAlert!('Sorry, we weren\'t able to like this post at this time. Please try again later.');

      }
    } else {
      /* ********************************* */
      /* ***** API CALL TO DISLIKE ******  */
      /* ********************************* */
      try {
        const response = await fetch(`${location.protocol + '//' + location.host}/api/post/${post.id}/reaction`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP Status: ${response.status} Request URL:  ${response.url}`);
        }
      } catch (error) {
        // Revert Eager Post Update
        const updatedFeed = feed.map(p => {
          if (p.id === post.id) {
            return {
              ...p,
              reaction: [{
                account: {
                  // fill in account details for logged in user available in context or redux depending on global state management method
                  id: 1,
                  email: 'alonso@prisma.io',
                  username: 'Alonso Oliveira',
                  headline: 'Senior Software Engineer at Digital Ocean',
                  photoUrl: 'https://media.licdn.com/dms/image/D4D0BAQEAFSZno0_znA/company-logo_100_100/0/1707299657994/digitalocean_logo?e=1721260800&v=beta&t=kldj5xzrq2sIg9PQR8ZVuvjbHmlPX2Vns2SlbHCRVfw',
                  accountTypeId: 2,
                  followerCount: 200,
                },
                likedBy: 1, // user account id,
                likedOn: new Date(),
                postId: p.id,
                commentId: null,
              }],
              _count: {
                ...p._count,
                reaction: p._count.reaction += 1,
              },
            }
          }
          return p;
        });
        setFeed!(updatedFeed);
        dispatchErrorAlert!('Sorry, we weren\'t able to unlike this post at this time. Please try again later.');
      }
    }

    // If action fails then we can decrement the LIKE and notify the user that an error occured -- error alert
    // Otherwise we succeeded in updating top level state and updating the record in DB. We don't need to reload the entire list after each like change
  }

  /* ************************************** */
  /* ********* TEXT FIELD EVENTS  ********* */
  /* ************************************** */

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  }

  // Emoji Mart TypeScript Types @TODO review to further increase typesafety
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addEmojiToComment = (emojiData: any) => {
    setState({ ...state, comment: state.comment += emojiData.native });
  }

  // const handleFocusOut = (e: React.FocusEvent<HTMLTextAreaElement>) => {
  //   const { value } = e.target;
  //   console.log(value);
  //   const regex =
  //   use match to find invalid characters to display in error message
  // }


  const contextValue = useMemo(() => ({
    comments,
    setComments,
    getPostComments,
  }), [comments, setComments, getPostComments]);

  return (
    <Card>
      <CardHeader>
        <div style={{ width: '45px', height: '45px', position: 'relative' }}>
          <Image
            alt="account image"
            fill={true}
            src={post.account.photoUrl}
            unoptimized={true} // @TODO review https://nextjs.org/docs/messages/next-image-missing-loader-width
          />
        </div>
        <div className="c_account-details flex flex-col px-2">
          <CardTitle className="post-title">{post.account.username}</CardTitle>
          <span className="post-subtitle">{post.account.accountType?.type === AccountTypeEnum.ORGANIZATION ? `${post.account.followerCount.toLocaleString()} followers` : post.account.headline}</span>
        </div>
        <KebobMenu classList="ml-auto">
          <span> <button className="text-sm" onClick={() => console.log('SAVE')}>Save</button> </span>
        </KebobMenu>
      </CardHeader>
      <CardContent>
        {post.content}
      </CardContent>

      {/* SOCIAL STATS LIKES/COMMENTS COUNTS */}
      {/* @TODO Review Possible Component Duplicate JSX In Comment Threads */}
      <div className="social-details-social-counts px-6 flex justify-between">
        {post._count.reaction !== 0 &&
          <div className="post-reactions flex text-xs items-center" onClick={getReactionInsights}>
            <div className="reaction-icon"><MiniThumbsUpIcon/></div>
            <span className="ml-1.5">{post._count.reaction}</span>
          </div>
        }
        {post._count.commentList !== 0 &&
          <span className="comment-stats ml-auto" onClick={getPostComments}>{`${post._count.commentList} ${post._count.commentList > 1 ? 'comments' : 'comment'}`}</span>
        }
      </div>
      <div className="divider">
        <div></div>
      </div>

      {/* SOCIAL ACTION BUTTONS */}

      <CardFooter className="sm:px-9 px-4">
        <div className="basis-3/12 md:px-0 px-2">
          <button className="post-cta-btn flex"  type="button" onClick={toggleLike}>
            {post.reaction.length ? <SolidThumbsUp/> : <ThumpsUpIcon/>}
            <span className={`${post.reaction.length ? 'liked' : ''} pl-2 text-sm font-semibold`}>Like</span>
          </button>
        </div>

        <div className="basis-3/12 md:px-0 px-2">
          <button className="post-cta-btn flex" type="button" onClick={addComment}>
            <CommentIcon/>
            <span className="pl-2 text-sm font-semibold">Comment</span>
          </button>
        </div>
      </CardFooter>

      {/* COMMENTS */}
      {/* @TODO REVIEW the following JSX within conditional render for potential reusable component Duplicate JSX in PostComment.tsx  */}
      {viewCommentField &&
        <>
          <CardRow className="flex pb-3" style={{ position: 'relative' }}>
            <TextArea
              appendInnerIcon={
                <EmojiActionMenu id={`post-${post.id}-comment-cta-emoji`} onEmojiSelect={addEmojiToComment} />
              }
              errorMessages={state.commentError ? [state.commentError] : undefined}
              id={`${post.id}-comment-textarea`}
              name="comment"
              placeholder="Add a comment..."
              value={state.comment}
              variant="outlined"
              onChange={handleInputChange}
            />
          </CardRow>
          {state.comment &&
            <CardRow>
              <Button
                className="basis-1/12 flex text-sm button-primary"
                disabled={state.postingComment}
                onClick={postComment}
              >
                Post
              </Button>
            </CardRow>
          }
        </>
      }

      {comments.length !== 0 &&
        <CardRow className="sm:px-6 px-2">
          <PostCommentListContext.Provider value={contextValue}>
            <PostComments comments={comments} count={post._count.commentList}/>
          </PostCommentListContext.Provider>
        </CardRow>
      }

    </Card>
  );
}

export default PostItem;
export { PostCommentListContext };