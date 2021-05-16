import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import ReactLoading from 'react-loading';
import NewPlatformBanner from './NewPlatformBanner';
import SearchBar from '../../common/SearchBar';
import { LOCAL_STORAGE_MAP } from '../../../configuration/constants';
import MarketIndices from './MarketIndices';
import News from '../stock-page/News';
import MarketPerformers from './MarketPerformers';
import { getMarketInfo } from '../../../api/backendRequests';

const LandingPage = () => {
  const [showBanner, setShowBanner] = useState(
    !Boolean(window.localStorage.getItem(LOCAL_STORAGE_MAP.SHOULD_HIDE_BANNER)),
  );

  const dismissBanner = () => {
    setShowBanner(false);
    window.localStorage.setItem(LOCAL_STORAGE_MAP.SHOULD_HIDE_BANNER, 'true');
  };

  const [market, setMarket] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Make request to backend for Yahoo Finance's data
      const data = await getMarketInfo();
      setMarket(data);
    };
    fetchData();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        {showBanner && <NewPlatformBanner onDismiss={dismissBanner} />}
        <SearchBar />
        {market ? (
          <MarketIndices market={market} />
        ) : (
          <Grid container justify="center" style={{ padding: 20 }}>
            <div>
              <ReactLoading type="spin" color="grey" />
            </div>
          </Grid>
        )}
        <MarketPerformers header="Top Day Gainers" performer="gainers" />
        <MarketPerformers header="Top Day Loser" performer="losers" />
      </Grid>
      <Grid item xs={6}>
        {market ? (
          <News stock={market} />
        ) : (
          <Grid align="center" style={{ padding: 20 }}>
            <ReactLoading type="spin" color="grey" />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default LandingPage;
