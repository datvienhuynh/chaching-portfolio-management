import { Box, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { useParams } from 'react-router-dom';
import {
  getStockData,
  makePrediction,
  YF_DAILY,
  YF_NEWS,
  YF_OVERVIEW,
  YF_QUOTE,
  YF_WEEKLY,
} from '../../../api/backendRequests';
import { processStockData } from './actions';
import FuturePerformance from './FuturePerformance';
import Header from './Header';
import News from './News';
import Overview from './Overview';
import Profile from './Profile';
import RiskMetrics from './RiskMetrics';
import SharePrices from './SharePrices';
import Summary from './Summary';

const useStyles = makeStyles({
  root: {
    paddingTop: 20,
  },
  title: {
    marginBottom: 30,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  loadingContainer: {
    margin: '0 auto',
  },
});

const StockPage = () => {
  const { id } = useParams();
  const classes = useStyles();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAVData = async () => {
      // Make 4 API calls to get Yahoo Finance data
      const overview = await getStockData(id, YF_OVERVIEW);
      const dailyData = await getStockData(id, YF_DAILY);
      const weeklyData = await getStockData(id, YF_WEEKLY);
      const quote = await getStockData(id, YF_QUOTE);
      const news = await getStockData(id, YF_NEWS);
      // Process responses and update state
      const prediction = await makePrediction(id);
      setStock(processStockData(overview, dailyData, weeklyData, quote, news, prediction));
      setLoading(false);
    };
    fetchAVData();
  }, [id]);

  return (
    <Box>
      <Grid className={classes.root} container>
        {loading ? (
          <Grid className={classes.loadingContainer}>
            <ReactLoading type="spin" color="grey" />
          </Grid>
        ) : (
          <Grid item xs={12}>
            {stock && <Overview stock={stock} />}
            {stock && <Header stock={stock} />}
            {stock && <Profile stock={stock} />}
            {stock && <Summary stock={stock} />}
            {stock && <SharePrices stock={stock} />}
            {stock && <FuturePerformance stock={stock} />}
            {stock && <RiskMetrics stock={stock} />}
            {stock && <News stock={stock} />}
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default StockPage;
