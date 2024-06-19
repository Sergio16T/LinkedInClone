'use client';

import React, { useState, useRef }  from 'react';


import data from '@emoji-mart/data'
import EmojiPicker from '@emoji-mart/react'
import Popper from '@mui/material/Popper';

import FaceSmile from '../Icon/FaceSmile';

type EmojiActionMenuProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEmojiSelect: any; // Emoji Market Types Not Readily Available. Allow Any. @Todo review
  id: string;
}
const EmojiActionMenu = ({ onEmojiSelect, id }: EmojiActionMenuProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  return (
    <div className="emoji-action-item" ref={actionMenuRef}>
      <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
        <FaceSmile/>
      </button>
      <Popper
        anchorEl={actionMenuRef.current}
        id={`emoji-action-menu-popper_${id}`}
        open={showEmojiPicker}
        placement="auto"
      >
        <EmojiPicker
          data={data}
          onClickOutside={() => setShowEmojiPicker(false)}
          onEmojiSelect={onEmojiSelect}
        />
      </Popper>
    </div>
  )
}

export default EmojiActionMenu;