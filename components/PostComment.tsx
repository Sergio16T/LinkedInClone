import React, { useContext, useState } from 'react';
import MiniThumbsUpIcon from '@/components/Icon/MiniThumbsUp';
import { CardContent, CardHeader, CardRow, CardTitle } from '@/components/Card';

import Image from 'next/image';

import { format } from 'date-fns';
import { AccountTypeEnum, Comment } from '@/lib/types';
import { EmojiActionMenu, PostCommentListContext } from './Post';
import PostComments from './Comments';
import TextArea from './Form/TextArea';
import { Button } from './Button';
import FeedContext from '@/lib/page-context';

type Props = {
  comment: Comment;
}

function PostComment({ comment }: Props) {
  const { comments, setComments, getPostComments } = useContext(PostCommentListContext)
  const [viewCommentField, setViewCommentField] = useState(false);
  const [state, setState] = useState({
    comment: '',
    commentError: '',
    postingComment: false,
    showEmojiPicker: false,
  }); // textarea state
  const { feed, setFeed, dispatchErrorAlert, setReactionInsightModalState } = useContext(FeedContext);


  /* ************************************** */
  /* *********** LIKE/DISLIKE ************* */
  /* ************************************** */

  const toggleLike = async () => {
    let action;

    async function updateComment(commentList: Comment[]) {
      for (const _comment of commentList) {
        if (_comment.id === comment.id) {

          const likedByAccount = comment.reaction.length > 0;

          if (!likedByAccount) {
            action = 'LIKE';
            _comment._count.reaction += 1
            _comment.reaction = [{
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
              likedBy: 1, // logged in account id,
              likedOn: new Date(),
              commentId: _comment.id,
              postId: null,
            }];
          } else if (likedByAccount) {
            action = 'DISLIKE';
            _comment._count.reaction -= 1;
            _comment.reaction = [];
          }
          break;
        }

        if (_comment.commentThread?.length) {
          await updateComment(_comment.commentThread);
        }
      }
    }

    const commentList = [...comments];
    await updateComment(commentList);
    setComments!(commentList);

    if (action === 'LIKE') {
      // API CALL TO LIKE POST with error handling
      try {
        const response = await fetch(`${location.protocol + '//' + location.host}/api/reaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            commentId: comment.id,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP Status: ${response.status} request URL: ${response.url}`);
        }
      } catch (error) {
        // Revert Eager Comment Update
        console.error(error);
        const commentList = [...comments];
        await updateComment(commentList);
        setComments!(commentList);
        dispatchErrorAlert!('Sorry, we weren\'t able to like this comment at this time. Please try again later.');
      }
    } else {
      // API CALL TO DISLIKE with error handling
      try {
        const response = await fetch(`${location.protocol + '//' + location.host}/api/post/${comment.postId}/comment/${comment.id}/reaction`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP Status: ${response.status} request URL: ${response.url}`);
        }
      } catch (error) {
        // Revert Eager Comment Update
        console.error(error);
        const commentList = [...comments];
        await updateComment(commentList);
        setComments!(commentList);
        dispatchErrorAlert!('Sorry, we weren\'t able to unlike this comment at this time. Please try again later.');

      }
    }
  }


  /* ************************************** */
  /* ************* COMMENTS  ************** */
  /* ************************************** */

  const addComment = async () => {
    setViewCommentField(true);
  }

  const postComment = async () => {
    try {
      // @TODO validate characters
      setState({
        ...state,
        postingComment: true,
      })

      const response = await fetch(`${location.protocol + '//' + location.host}/api/post/${comment.postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: state.comment,
          parentId: comment.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Status: ${response.status} Request URL:  ${response.url}`);
      }

      // Update the Post Comments Count at Feed level of component tree without refetching entire feed.
      const updatedFeed = feed.map(p => {
        if (p.id === comment.postId) {
          return {
            ...p,
            comments: p._count.commentList  += 1,
          }
        }
        return p;
      });
      setFeed!(updatedFeed);


      // Wait for successful response..
      await getPostComments!();
      setViewCommentField(false);
      setState({
        comment: '',
        commentError: '',
        postingComment: false,
        showEmojiPicker: false,
      });
    } catch (error) {
      console.log(error);
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
      item: comment,
    });
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

  return (
    <div className="flex grow">
      <div className="flex-1/4">
        <div className="comment-account-avatar">
          <Image
            alt="account image"
            fill={true}
            src={comment.account.photoUrl}
            unoptimized={true} // @TODO review https://nextjs.org/docs/messages/next-image-missing-loader-width
          />
        </div>
      </div>
      <div className="grow">
        <div className="comment ml-3">
          <CardHeader className="sm:p-3 p-3">
            <div className="c_account-details flex flex-col px-2">
              <CardTitle className="post-title">{comment.account.username}</CardTitle>
              <span className="post-subtitle">{comment.account.accountType?.type === AccountTypeEnum.ORGANIZATION ? `${comment.account.followerCount.toLocaleString()} followers` : comment.account.headline}</span>
            </div>
            <span className="text-xs ml-auto">{format(comment.createDate, 'MMMM dd, yyyy')}</span>
          </CardHeader>
          <CardContent className="sm:px-5 px-5">
            {comment.body}
          </CardContent>
        </div>
        <div className="social-details-social-counts p-3 pt-2 flex items-center">

          <button className="post-cta-btn flex" type="button" onClick={toggleLike}>
            <span className={`pl-2 text-base ${comment.reaction.length > 0 ? 'liked font-semibold' : ''}`}>Like</span>
          </button>

          {comment._count.reaction !== 0 &&
                  <div className="post-reactions flex text-xs items-center ml-3" onClick={getReactionInsights}>
                    <div className="reaction-icon"><MiniThumbsUpIcon/></div>
                    <span className="ml-1.5">{comment._count.reaction}</span>
                  </div>
          }
          {/* Client Side LIMIT Comments to 2 levels deep */}
          {(!comment.depth || comment.depth < 2) &&
            <>
              <span className="p-2"> | </span>
              <button className="post-cta-btn flex mr-3" type="button" onClick={addComment}>
                <span className="text-base">Reply</span>
              </button>
            </>
          }
          {comment._count.children !== 0 &&
            <span className="pl-2"> {comment._count.children} {comment._count.children > 1 ? 'Replies' : 'Reply'} </span>
          }
        </div>

        {viewCommentField &&
          <>
            <CardRow className="flex pb-3" style={{ position: 'relative' }}>
              <TextArea
                appendInnerIcon={
                  <EmojiActionMenu onEmojiSelect={addEmojiToComment}/>
                }
                errorMessages={state.commentError ? [state.commentError] : undefined}
                id={`${comment.id}-child-comment-textarea`}
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

        {/* RECURSIVE COMMENTS */}
        {comment.commentThread && comment.commentThread.length > 0 && <PostComments comments={comment.commentThread}/>}
      </div>

    </div>
  );
}

export default PostComment;