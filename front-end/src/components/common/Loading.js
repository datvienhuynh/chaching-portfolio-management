import { Box, CircularProgress } from '@material-ui/core';
import React from 'react';

export default function Loading() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Box>
  );
}
