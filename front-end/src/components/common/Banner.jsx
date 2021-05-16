import React from 'react';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import CloseIconButton from '../common/icon-buttons/CloseIconButton';

const useStyles = makeStyles({
  banner: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

const Banner = ({ children, onDismiss }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.banner} elevation={15}>
      <CloseIconButton onClick={onDismiss} />
      {children}
    </Paper>
  );
};

export default Banner;
