import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import { Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MarketTable from './MarketTable';

import { getMarketData } from '../../../api/backendRequests';

const useStyles = makeStyles({
  paper: {
    marginTop: 10,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
  },
  loadingContainer: {
    margin: '0 auto',
  },
});

const MarketPerformers = ({ header, performer }) => {
  const classes = useStyles();
  const [stocks, setStocks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      const results = await getMarketData();
      setStocks(results);
      setLoading(false);
    };
    fetchStockData();
  }, []);

  return (
    <Paper className={classes.paper}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="body1" style={{ marginBottom: 10 }}>
            <strong>{header}</strong>
          </Typography>
        </Grid>
        {loading ? (
          <Grid className={classes.loadingContainer}>
            <ReactLoading type="spin" color="grey" />
          </Grid>
        ) : (
          <Grid item xs={12}>
            {stocks && <MarketTable data={stocks[performer]} />}
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default MarketPerformers;
