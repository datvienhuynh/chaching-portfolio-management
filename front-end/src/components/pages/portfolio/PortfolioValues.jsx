import React from 'react';
import { makeStyles, Typography, Paper, Grid, CircularProgress } from '@material-ui/core';

import ChartTabs from './ChartTabs';

const useStyles = makeStyles(() => ({
  paper: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
  },
  negativeTrend: {
    color: '#ff1744',
  },
  positiveTrend: {
    color: '#4caf50',
  },
}));

const PortfolioValues = ({ portfolio }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6" style={{ marginBottom: 20 }}>
        <strong>Portfolio Performance</strong>
      </Typography>
      <Grid align="center">
        {portfolio.values ? (
          <ChartTabs portfolio={portfolio} />
        ) : (
          <CircularProgress color="primary" align="center" />
        )}
      </Grid>
    </Paper>
  );
};

export default PortfolioValues;
