import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import ChartTabs from './ChartTabs';

const useStyles = makeStyles(() => ({
  paper: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
  },
}));

const SharePrices = ({ stock }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid>
        <Typography variant="h6" style={{ marginBottom: 10 }}>
          <strong>Share Prices</strong>
        </Typography>
        <ChartTabs stock={stock} type="linechart" />
      </Grid>
    </Paper>
  );
};

export default SharePrices;
