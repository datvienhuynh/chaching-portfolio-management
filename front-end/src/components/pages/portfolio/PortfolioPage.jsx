import { Box, Grid, Button, makeStyles, Typography, CircularProgress } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useContext, useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { useHistory, useParams } from 'react-router-dom';
import { delete_portfolio, usePortfolio } from '../../../utils/usePortfolios';
import UserContext from '../../contexts/UserContext';
import HoldingPerformance from './HoldingPerformance';
import Holdings from './Holdings';
import { getPortfolioInfo } from './actions';
import Overview from './Overview';
import PortfolioValues from './PortfolioValues';

const useStyles = makeStyles({
  root: {
    paddingTop: 20,
  },
  headingContainer: {
    width: '100%',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 20,
    color: '#888',
    fontStyle: 'italic',
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

const PortfolioPage = () => {
  const history = useHistory();
  const { token } = useContext(UserContext);
  const { id } = useParams();
  const [
    portfolio,
    ,
    fetchPortfolio,
    loading,
    ,
    updatePortfolio,
    diversification,
    isOwner,
    canRead,
  ] = usePortfolio(null, id, [token]);
  const [stocks, setStocks] = useState(null);
  const [stockLoading, setStockLoading] = useState(true);
  const classes = useStyles();

  // Handle deleting portfolio button
  const onDelete = async () => {
    await delete_portfolio(id);
    history.replace('/portfolio');
  };

  // Handle setting public/private button
  const onSetPublicClicked = () => {
    updatePortfolio(id, {
      isPublic: !portfolio.isPublic,
      name: portfolio.name,
    });
  };

  // Get data of holdings for displaying on the UI
  useEffect(() => {
    const fetchData = async (portfolio) => {
      const stockList = await getPortfolioInfo(portfolio);
      setStocks(stockList);
      setStockLoading(false);
    };
    if (portfolio && canRead) fetchData(portfolio);
  }, [portfolio, canRead]);

  return (
    <Box className={classes.root}>
      {token && canRead ? (
        <div>
          <Box
            className={classes.headingContainer}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <div>
              <Typography variant="h2" className={classes.heading}>
                {portfolio && portfolio.name}
              </Typography>
              <Typography variant="h3" className={classes.description}>
                {portfolio && portfolio.description}
              </Typography>
            </div>
            {isOwner && (
              <div>
                <Button variant="contained" color="secondary" onClick={onDelete}>
                  Delete
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: '1rem' }}
                  onClick={onSetPublicClicked}
                >
                  {loading ? (
                    <CircularProgress color="primary" align="center" />
                  ) : portfolio && portfolio.isPublic ? (
                    'Remove as Public'
                  ) : (
                    'Set as Public'
                  )}
                </Button>
              </div>
            )}
          </Box>
          {stockLoading ? (
            <Grid className={classes.loadingContainer} align="center">
              <ReactLoading type="spin" color="grey" />
            </Grid>
          ) : stocks.length > 0 ? (
            <Grid className={classes.root} container>
              <Grid item xs={6} sm={8} md={12}>
                {stocks && <Overview portfolio={portfolio} diversification={diversification} />}
                {stocks && (
                  <Holdings
                    portfolio={portfolio}
                    fetchPortfolio={fetchPortfolio}
                    isOwner={isOwner}
                  />
                )}
                {stocks && <PortfolioValues portfolio={portfolio} />}
                {stocks && <HoldingPerformance portfolio={portfolio} />}
              </Grid>
            </Grid>
          ) : (
            <Typography variant="h6">This portfolio has no stock holdings.</Typography>
          )}
        </div>
      ) : token ? (
        <MuiAlert severity="warning">
          <strong>This is a private portfolio.</strong>
        </MuiAlert>
      ) : (
        <MuiAlert severity="info">
          <strong>Please login to view.</strong>
        </MuiAlert>
      )}
    </Box>
  );
};

export default PortfolioPage;
