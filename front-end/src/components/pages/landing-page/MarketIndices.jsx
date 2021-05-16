import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles((theme) => ({
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

const MarketIndices = ({ market }) => {
  const classes = useStyles();
  // Variable determines colour of text reflecting trend
  const positive = market.quote['Price Change'] > 0;

  return (
    <Paper className={classes.paper}>
      <Grid item xs={12} sm container>
        <Grid item xs>
          <Typography variant="body1">
            <strong>ASX 200</strong>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {market.overview.exchange}. Currency in AUD
          </Typography>
          <Typography variant="h6">
            <strong>{market.latestPrice.toFixed(2)}</strong>
          </Typography>
          <Typography
            variant="h6"
            className={positive === true ? classes.positiveTrend : classes.negativeTrend}
          >
            {market.quote['Price Change'].toFixed(2)} {market.quote['Change Percent'].toFixed(2)}%
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Day Range: {market.quote["Day's Range"]}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MarketIndices;
