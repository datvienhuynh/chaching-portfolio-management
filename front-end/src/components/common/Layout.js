import React from 'react';

import { makeStyles, Grid, Box } from '@material-ui/core';
import Loading from './Loading';
import { Error } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
  content: {
    padding: '3rem',
  },

  heading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
}));

const Layout = ({ loading, error, heading, children }) => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item md={12} className={classes.content}>
        <Box>
          {heading}
          {loading ? <Loading /> : error ? <Error message={error} /> : children}
        </Box>
      </Grid>
    </Grid>
  );
};
export default Layout;
