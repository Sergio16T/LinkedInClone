import React, { useCallback, useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { AccountTypeEnum, Article, Nullable, Post, ReactionInsights } from '@/lib/types';
import FeedContext from '@/lib/page-context';

import { CardHeader, CardTitle } from '@/components/Card';

import Image from 'next/image';
import MiniThumbsUpIcon from '../Icon/MiniThumbsUp';
import usePrevious from '@/lib/hooks/usePrevious';

// Override MUI Styles to align with current font styles
// Added MUI to be able to rapidly build out modal
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiTypography-root': {
    fontWeight: 600,
    fontSize: '20px',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  },
  '& .MuiPaper-root': {
    width: '60%',
    top: '-20%',
    height: '500px',
  },
}));

type Props = {
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  item: Nullable<Article>;
}

function isPost(item: Article): item is Post {
  return (item as Post).content !== undefined;
}

export default function ReactionInsightsModal({ open, onClose, item }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false); // @Todo Explore Loading State. LinkedIn Doesn't display a loader.
  const [reactionInsights, setReactionInsights] = useState<ReactionInsights[]>([])
  const { dispatchErrorAlert } = useContext(FeedContext);
  const previousModalState = usePrevious(open);

  // make API call here for reaction insights
  const getReactionInsights = useCallback(async () => {
    try {
      if (!item) {
        throw new Error('No Post or Comment Provided To Retrieve Insights');
      }
      setLoading(true);
      let url = `${location.protocol + '//' + location.host}/api`;
      if (isPost(item)) {
        url += `/post/${item.id}/reactionInsights`
      } else {
        url += `/post/${item.postId}/comment/${item.id}/reactionInsights`
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Status: ${response.status} Request URL:  ${response.url}`);
      }

      const reactionInsightList = await response.json();
      const currentInsightList = [...item.reaction, ...reactionInsightList];
      setReactionInsights(currentInsightList);
    } catch (error) {
      console.log(error);
      dispatchErrorAlert!('Sorry, we weren\'t able to retrieve the reaction insights at this time. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [item, dispatchErrorAlert]);

  useEffect(() => {
    if (open !== previousModalState && open) {
      if (item?.reaction.length) {
        setReactionInsights(item.reaction);
      }
    }
  }, [open, item, previousModalState]);

  useEffect(() => {
    if (open !== previousModalState) {
      if (open) {
        getReactionInsights();
      } else {
        setReactionInsights([]);
      }
    }
  }, [open, getReactionInsights, previousModalState]);


  return (
    <BootstrapDialog
      aria-labelledby="customized-dialog-title"
      open={open}
      onClose={onClose}
    >
      <DialogTitle className="font-semibold text-base" id="customized-dialog-title" sx={{ m: 0, p: 2 }}>
          Reactions
      </DialogTitle>
      <IconButton
        aria-label="close"
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent dividers>
        {reactionInsights.map((reaction, index) =>
          <ReactionInsightStat
            key={`reaction-insight-${index + 1}`}
            lastItem={reactionInsights.length === index + 1}
            reaction={reaction}
          />,
        )}
      </DialogContent>

    </BootstrapDialog>
  );
}

type ReactionInsightRowProps = {
  reaction: ReactionInsights;
  lastItem: boolean;
}
const ReactionInsightStat = ({ reaction, lastItem }: ReactionInsightRowProps) => {
  return (
    <div className={`${lastItem ? 'pb-2' : ''} px-3 flex grow`}>
      <div style={{ position: 'relative' }}>
        <div style={{ width: '45px', height: '45px',  position: 'relative', borderRadius: '50%', overflow: 'hidden' }}>
          <Image
            alt="account image"
            fill={true}
            src={reaction.account.photoUrl}
            unoptimized={true} // @TODO review https://nextjs.org/docs/messages/next-image-missing-loader-width
          />
        </div>
        <div className="reaction-insight-type-icon flex text-xs items-center">
          <div className="reaction-icon"><MiniThumbsUpIcon/></div>
        </div>
      </div>
      <div className="grow">
        <div className="reaction-insight pr-3">
          <CardHeader className="py-2 pl-2">
            <div className="c_account-details flex flex-col px-2">
              <CardTitle className="post-title">{reaction.account.username}</CardTitle>
              <span className="post-subtitle">{reaction.account.accountType?.type === AccountTypeEnum.ORGANIZATION ? `${reaction.account.followerCount.toLocaleString()} followers` : reaction.account.headline}</span>
            </div>
          </CardHeader>
          {!lastItem &&
            <div className="reaction-divider">
              <div></div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}