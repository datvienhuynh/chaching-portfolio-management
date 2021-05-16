import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import UserContext from '../../contexts/UserContext';
import { getStock } from '../../../api/backendRequests';
import ModalContext from './../../contexts/ModalContext';
import AddStockForm from './../../forms/AddStockForm';
import { checkSubscribedForSingleStock, subscribeToStock } from '../../../utils/useStocks';
import { CircularProgress } from '@material-ui/core';

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

const Overview = ({ stock }) => {
  const classes = useStyles();
  const { token } = useContext(UserContext);
  const { showModal } = useContext(ModalContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Variable determines colour of text reflecting trend
  const positive = stock.quote['Price Change'] > 0;

  // Get stock data from backend for adding to portfolio
  // Not Alpha Vantage data
  const [stockInfo, setStockInfo] = useState(null);
  useEffect(() => {
    checkSubscribedForSingleStock(id, setIsSubscribed, setLoading);
    getStock(setStockInfo, id);
  }, [id]);

  // Show modal for adding stock when 'ADD TO PORTFOLIO' is clicked
  const handleAddClick = async () => {
    showModal(<AddStockForm info={{ stock: stockInfo }} />);
  };
  const onSubscribeClick = async () => {
    await subscribeToStock(id, !isSubscribed, token);
    setIsSubscribed(!isSubscribed);
  };

  return (
    <Paper className={classes.paper}>
      <Grid item xs={12} sm container>
        <Grid item xs>
          <Typography variant="h6">
            <strong>
              {stock.overview.longName} ({stock.overview.symbol})
            </strong>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {stock.overview.exchange}. Currency in {stock.overview.currency}
          </Typography>
          <Typography variant="h4">
            <strong>{stock.latestPrice.toFixed(2)}</strong>
          </Typography>
          <Typography
            variant="h6"
            className={positive === true ? classes.positiveTrend : classes.negativeTrend}
          >
            {stock.quote['Price Change'].toFixed(2)} {stock.quote['Change Percent'].toFixed(2)}%
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            At Close: {stock.currentDate}
          </Typography>
          <Grid container justify="space-between" alignItems="center" style={{ marginTop: 20 }}>
            {token && (
              <div>
                <Button variant="contained" size="large" onClick={handleAddClick}>
                  Add to Portfolio
                </Button>
              </div>
            )}
            <div>
              <Button onClick={onSubscribeClick} variant="contained" color="primary">
                {token && loading ? (
                  <CircularProgress size={30} color="primary" />
                ) : isSubscribed ? (
                  'Unsubscribe'
                ) : (
                  'Subscribe'
                )}
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Overview;
