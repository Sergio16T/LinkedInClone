'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Post, ModalState } from '@/lib/types';
import PostItem from '@/components/Post';
import ErrorAlert from '@/components/Alert/Error';
import ReactionInsightsModal from '@/components/Modal/ReactionInsightsModal';
import FeedContext from '@/lib/page-context';
import { Card, CardContent, CardHeader, Skeleton } from '@mui/material';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState<Post[]>([]);
  const [alertState, setAlertState] = useState({
    open: false,
    message: '',
  });
  const [reactionInsightModalState, setReactionInsightModalState] = useState<ModalState>({
    open: false,
    item: null,
  });

  /* ********************************* */
  /* ********* POST FEED  ************ */
  /* ********************************* */
  const getFeed = useCallback(async () => {
    try {
      setLoading(true);
      // @TODO replace location with ENV Variables for BASE_API_URL
      const response = await fetch(`${location.protocol + '//' + location.host}/api/feed`);
      if (!response.ok) {
        throw new Error(`HTTP Status: ${response.status} Request URL:  ${response.url}`);
      }
      const posts = await response.json();
      setFeed(posts);
    } catch (error) {
      console.error(error);
      dispatchErrorAlert!('Sorry, we weren\'t able to retrieve your feed at this time. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getFeed();
  }, [getFeed]);

  /* ************************************** */
  /* ******** ALERT MANAGEMENT  *********** */
  /* ************************************** */
  const closeAlert = () => {
    setAlertState({
      open: false,
      message: '',
    })
  }

  const dispatchErrorAlert = (message: string) => {
    setAlertState({
      open: true,
      message: message,
    })
  }

  /* *********************************** */
  /* *********** CONTEXT  ************** */
  /* *********************************** */

  const contextValue = useMemo(() => ({
    feed,
    setFeed,
    dispatchErrorAlert,
    setReactionInsightModalState,
  }), [feed, setFeed]);

  return (
    <main className="flex flex-col items-center justify-between sm:p-24 my-0 w-full">
      <div className={`feed flex flex-col sm:p-2 w-full ${!loading ? 'space-y-2' : ''}`}>
        <ReactionInsightsModal
          item={reactionInsightModalState.item}
          open={reactionInsightModalState.open}
          onClose={() => setReactionInsightModalState({ open: false, item: null })}
        />
        <ErrorAlert
          handleClose={closeAlert}
          message={alertState.message}
          open={alertState.open}
        />
        {loading ?
          <SkeletonPost/>
          :
          <FeedContext.Provider value={contextValue}>
            {feed.map((post, index) => {
              return (
                <PostItem
                  key={index}
                  post={post}
                />
              );
            })}
          </FeedContext.Provider>
        }

      </div>
    </main>
  );
}


const SkeletonPost = () => {
  return (
    <Card sx={{ borderRadius: '.75rem', boxShadow: 'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px' }}>
      <CardHeader
        action={null}
        avatar={
          <Skeleton animation="wave" height={40} variant="circular" width={40} />
        }
        subheader={
          <Skeleton animation="wave" height={10} width="40%" />
        }
        title={
          <Skeleton
            animation="wave"
            height={10}
            style={{ marginBottom: 6 }}
            width="80%"
          />
        }
      />
      <Skeleton animation="wave" sx={{ height: 190 }} variant="rectangular" />
      <CardContent>
        <React.Fragment>
          <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
          <Skeleton animation="wave" height={10} width="80%" />
        </React.Fragment>
      </CardContent>
    </Card>
  );
}