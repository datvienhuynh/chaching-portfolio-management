import React from 'react';
import { Box, CircularProgress, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import ReactTooltip from 'react-tooltip';
import PieChart from './PieChart';

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

const BETA_DEFINITION =
  'A weighted sum of beta values of each stock in the portfolio. A beta that is greater than 1.0 indicates that the portfolio price is theoretically more volatile than the market, and vice versa';

const DIVERSIFICATION_DEFINITION =
  'Diversification includes owning stocks from several different industries, countries, and risk profiles. The best value is 1. A normal value can be negative. The higher the value, the better the diversification.';

const Overview = ({ portfolio, diversification }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6">
            <strong>Overview</strong>
          </Typography>
        </Grid>
        <Grid item xs={8} align="center">
          {portfolio.pieChartData ? (
            <PieChart chartId="HoldingPieChart" data={portfolio.pieChartData} />
          ) : (
            <CircularProgress color="primary" />
          )}
        </Grid>
        <Grid item xs={4} align="center">
          <Grid item align="center" style={{ marginBottom: 40 }}>
            <Typography variant="subtitle1" color="textSecondary">
              Value Change Today
            </Typography>
            <Typography
              variant="h4"
              className={portfolio.change > 0 ? classes.positiveTrend : classes.negativeTrend}
            >
              {portfolio.change ? (
                <strong>{portfolio.change.toFixed(2)}</strong>
              ) : (
                <CircularProgress color="primary" />
              )}
            </Typography>
          </Grid>
          <Grid item align="center" style={{ marginBottom: 40 }}>
            <Typography variant="subtitle1" color="textSecondary">
              Change Percent Today
            </Typography>
            <Typography
              variant="h4"
              className={
                portfolio.changePercent > 0 ? classes.positiveTrend : classes.negativeTrend
              }
            >
              {portfolio.changePercent ? (
                <strong>{portfolio.changePercent.toFixed(2)}%</strong>
              ) : (
                <CircularProgress color="primary" />
              )}
            </Typography>
          </Grid>
          <Grid item align="center" style={{ marginBottom: 40 }}>
            <Typography variant="subtitle1" color="textSecondary">
              Next Day Value
            </Typography>
            <Typography variant="h4">
              {portfolio.nextDay ? (
                <strong>AUD${portfolio.nextDay.toFixed(2)}</strong>
              ) : (
                <CircularProgress color="primary" />
              )}
            </Typography>
          </Grid>

          <Grid item align="center" style={{ marginBottom: 40 }}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              data-tip={BETA_DEFINITION}
              data-for="toolTip1"
              data-place="top"
            >
              Beta value
            </Typography>
            <ReactTooltip id="toolTip1" />
            <Typography variant="h4">
              {portfolio.beta ? (
                <strong>{portfolio.beta.toFixed(2)}</strong>
              ) : (
                <CircularProgress color="primary" />
              )}
            </Typography>
          </Grid>

          <Grid item align="center" style={{ marginBottom: 40 }}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              data-tip={DIVERSIFICATION_DEFINITION}
              data-for="toolTip2"
              data-place="top"
            >
              Diversification
            </Typography>
            <ReactTooltip id="toolTip2" />
            {diversification !== null ? (
              <Grid>
                <Typography variant="subtitle1">
                  <strong>{diversification}</strong>
                </Typography>
                <Box
                  align="center"
                  style={{
                    flex: 1,
                    background:
                      diversification < 0.33 ? 'red' : diversification < 0.66 ? 'yellow' : 'green',
                    height: '10px',
                    maxWidth: '200px',
                    marginRight: '1rem',
                    borderRadius: '22px',
                    alignItems: 'center',
                  }}
                />
              </Grid>
            ) : (
              <CircularProgress color="primary" />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Overview;
