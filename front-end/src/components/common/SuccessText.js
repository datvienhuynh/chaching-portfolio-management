import { Box, Typography } from '@material-ui/core';
import React from 'react';

export default function SuccessText({ message }) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Typography
        variant="body"
        style={{ backgroundColor: '#1de9b6', color: 'white', padding: '0.7rem' }}
      >
        {message}
      </Typography>
    </Box>
  );
}
