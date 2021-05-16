import React from 'react';
import { makeStyles, Grid, Paper, Typography, CircularProgress } from '@material-ui/core';
import ComparingChart from './ComparingChart';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
  },
}));

const HoldingPerformance = ({ portfolio }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid>
        <Typography variant="h6" style={{ marginBottom: 10 }}>
          <strong>Holding Performance</strong>
        </Typography>
        <Grid align="center">
          {portfolio.stockData ? (
            <ComparingChart
              chartId="StockComparing"
              data={portfolio.stockData}
              tickers={portfolio.tickers}
            />
          ) : (
            <CircularProgress color="primary" />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HoldingPerformance;
