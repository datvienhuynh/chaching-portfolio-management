import React from 'react';
import { Box } from '@material-ui/core';
import logo from './logo.jpg';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles({
  imageContainer: {
    width: 155,
    height: 58,
    objectFit: 'cover',
    overflow: 'hidden',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

const Logo = () => {
  const classes = useStyles();

  return (
    <Box display="flex">
      <Link component={RouterLink} to="/">
        <div className={classes.imageContainer}>
          <img className={classes.image} src={logo} alt="Cha-Ching" />
        </div>
      </Link>
    </Box>
  );
};

export default Logo;
