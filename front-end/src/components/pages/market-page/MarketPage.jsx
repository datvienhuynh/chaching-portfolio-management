import { Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { getAllStockData, getMarketData } from '../../../api/backendRequests';
import AllStockTable from './AllStockTable';
import MarketTable from './MarketTable';

const useStyles = makeStyles({
  root: {
    paddingTop: 20,
  },
  headingContainer: {
    marginBottom: 40,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 30,
    color: '#888',
    fontStyle: 'italic',
  },
  paper: {
    width: '100%',
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
  },
  loadingContainer: {
    margin: '0 auto',
  },
});

const MarketPage = () => {
  const classes = useStyles();
  const [stocks, setStocks] = useState(null);
  const [loading, setLoading] = useState(true);
  var [allStocks, setAllStocks] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      const results = await getMarketData();
      const market = await getAllStockData();
      setStocks(results);
      setAllStocks(market);
      setLoading(false);
    };
    fetchStockData();
  }, []);

  if (allStocks != null) {
    for (let i = 0; i < allStocks.length; i++) {
      allStocks[i]['latestPrice'] = parseFloat(allStocks[i]['latestPrice']);
      allStocks[i]['predictedNextDayPrice'] = parseFloat(allStocks[i]['predictedNextDayPrice']);
      allStocks[i]['predictedPercentChange'] =
        (allStocks[i]['predictedNextDayPrice'] / allStocks[i]['latestPrice'] - 1) * 100;
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.headingContainer}>
        <Typography variant="h2" className={classes.heading}>
          Market
        </Typography>
        <Typography variant="h3" className={classes.description}>
          Cha-Ching Market Information
        </Typography>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <Paper className={classes.paper}>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h6" style={{ marginBottom: 10 }}>
                  <strong>Top Day Gainers</strong>
                </Typography>
              </Grid>
              {loading ? (
                <div className={classes.loadingContainer}>
                  <ReactLoading type="spin" color="grey" />
                </div>
              ) : (
                <Grid item xs={12}>
                  {stocks && <MarketTable data={stocks['gainers']} />}
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h6" style={{ marginBottom: 10 }}>
                  <strong>Top Day Losers</strong>
                </Typography>
              </Grid>
              {loading ? (
                <div className={classes.loadingContainer}>
                  <ReactLoading type="spin" color="grey" />
                </div>
              ) : (
                <Grid item xs={12}>
                  {stocks && <MarketTable data={stocks['losers']} />}
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        <Paper className={classes.paper}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h6" style={{ marginBottom: 10 }}>
                <strong>ASX 200 Stocks</strong>
              </Typography>
            </Grid>
            {loading ? (
              <div className={classes.loadingContainer}>
                <ReactLoading type="spin" color="grey" />
              </div>
            ) : (
              <Grid item xs={12}>
                {allStocks && <AllStockTable data={allStocks} />}
              </Grid>
            )}
          </Grid>
        </Paper>
      </Grid>
    </div>
  );
};

export default MarketPage;
