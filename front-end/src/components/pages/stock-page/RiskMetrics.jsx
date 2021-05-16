import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import ReactTooltip from 'react-tooltip';

const BETA_MESSAGE =
  "A beta that is greater than 1.0 indicates that the security's price is theoretically more volatile than the market, and vice versa";
const SD_MESSAGE =
  'A statistical measure of market volatility, measuring how widely prices are dispersed from the average price'; // standard deviation

const useStyles = makeStyles(() => ({
  paper: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
  },
}));

const RiskMetrics = ({ stock }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" style={{ marginBottom: 30 }}>
            <strong>Risk Metrics</strong>
          </Typography>
        </Grid>

        <Grid item xs={4} align="center">
          <Typography
            variant="subtitle1"
            data-tip={BETA_MESSAGE}
            data-for="toolTip1"
            data-place="top"
          >
            <strong>Beta value</strong>
          </Typography>
          <ReactTooltip id="toolTip1" />
          <Typography variant="subtitle2" color="textSecondary">
            {stock.beta}
          </Typography>
        </Grid>

        <Grid item xs={4} align="center">
          <Typography
            variant="subtitle1"
            data-tip={SD_MESSAGE}
            data-for="toolTip2"
            data-place="top"
          >
            <strong>Standard Deviation (1 year) </strong>
          </Typography>
          <ReactTooltip id="toolTip2" />
          <Typography variant="subtitle2" color="textSecondary">
            {stock.sd}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RiskMetrics;
