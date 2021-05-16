import { Box, Typography } from '@material-ui/core';
import React from 'react';

export default function ErrorText({ message }) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Typography
        variant="h6"
        style={{ backgroundColor: 'red', color: 'white', padding: '0.7rem' }}
      >
        {message}
      </Typography>
    </Box>
  );
}
