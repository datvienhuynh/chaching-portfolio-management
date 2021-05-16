import React from 'react';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  closeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

const CloseIconButton = ({ onClick }) => {
  const classes = useStyles();
  return (
    <IconButton className={classes.closeIcon} onClick={onClick}>
      <CloseIcon />
    </IconButton>
  );
};

export default CloseIconButton;
