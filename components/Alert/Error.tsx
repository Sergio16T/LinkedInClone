import React, { SyntheticEvent } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type Props = {
  open: boolean;
  handleClose: React.Dispatch<Event | SyntheticEvent>;
  message: string;
}

function ErrorAlert({ open, handleClose, message }: Props) {
  return (
    <Snackbar autoHideDuration={6000} open={open} onClose={handleClose}>
      <Alert
        severity="error"
        sx={{ width: '100%' }}
        variant="filled"
        onClose={handleClose}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default ErrorAlert;