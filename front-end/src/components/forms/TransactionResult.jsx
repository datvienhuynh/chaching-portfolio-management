import React from 'react';

import { Typography, Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';

const useStyles = makeStyles(() => ({
  root: {
    padding: 30,
    width: 400,
    height: 200,
  },
  submitButton: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: 20,
  },
  submitError: {
    width: '100%',
    position: 'absolute',
    bottom: 100,
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    color: 'red',
  },
}));

const TransactionResult = ({ info }) => {
  const classes = useStyles();
  const holding = info.holding;
  const transaction = info.data;
  const isSold = Number(transaction.quantity) < 0;

  return (
    <Paper className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography variant="subtitle1">Transaction Successful!</Typography>
              <Typography gutterBottom variant="subtitle1">
                {holding.stock.name} Shares {isSold === true ? 'Sold' : 'Purchased'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Transaction Price: ${transaction.price}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Quantity:{' '}
                {isSold === true ? -1 * Number(transaction.quantity) : Number(transaction.quantity)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {isSold === true
                  ? `Total Earn: $${-1 * Number(transaction.cost)}`
                  : `Total Pay: $${Number(transaction.cost)}`}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Date: {transaction.date}
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <LibraryAddCheckIcon centre="true" />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TransactionResult;
