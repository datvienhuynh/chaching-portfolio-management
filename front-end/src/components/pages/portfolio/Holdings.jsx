import React from 'react';
import { makeStyles, Grid, Paper, Typography } from '@material-ui/core';
import StockTable from './StockTable';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
  },
}));

const Holdings = ({ portfolio, fetchPortfolio, isOwner }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid>
        <Typography variant="h6" style={{ marginBottom: 10 }}>
          <strong>Stock Holdings</strong>
        </Typography>
        <StockTable portfolio={portfolio} fetchPortfolio={fetchPortfolio} isOwner={isOwner} />
      </Grid>
    </Paper>
  );
};

export default Holdings;
