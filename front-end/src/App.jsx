import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Paper } from '@material-ui/core';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { NotificationContainer } from 'react-notifications';

import Header from './components/header/Header';
import LandingPage from './components/pages/landing-page/LandingPage';
import PortfoliosPage from './components/pages/portfolio/PortfoliosPage';
import GoalsPage from './components/pages/goal/GoalsPage.jsx';
import PortfolioPage from './components/pages/portfolio/PortfolioPage';
import { ModalProvider } from './components/contexts/ModalContext';
import { UserProvider } from './components/contexts/UserContext';
import theme from './configuration/theme';

import './App.css';
import 'react-notifications/lib/notifications.css';
import MarketPage from './components/pages/market-page/MarketPage';
import PublicProfile from './components/pages/public-profile/PublicProfile';
import PublicPortfolio from './components/pages/portfolio/PublicPortfolio';
import ForumsPage from './components/pages/forum/ForumsPage';
import ForumPage from './components/pages/forum/ForumPage';
import PostPage from './components/pages/forum/PostPage';
import StockPage from './components/pages/stock-page/StockPage';
import CompetitionsPage from './components/pages/competition/CompetitionsPage';
import CompetitionPage from './components/pages/competition/CompetitionPage';

const useStyles = makeStyles({
  app: {
    minHeight: '100vh',
  },
  page: {
    minHeight: 'calc(100vh - 64px)',
    maxWidth: '1280px',
    margin: '0 auto',
    padding: 10,
  },
});

// entry point of the root component, which contains configurations for theming, contexts and routing
const App = () => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Router>
          <UserProvider>
            <ModalProvider>
              <Paper className={classes.app}>
                <Header />
                <div className={classes.page}>
                  <Switch>
                    <Route path="/" exact>
                      <LandingPage />
                    </Route>
                    <Route path="/portfolio" exact>
                      <PortfoliosPage />
                    </Route>
                    <Route path="/goals">
                      <GoalsPage />
                    </Route>
                    <Route path="/market">
                      <MarketPage />
                    </Route>
                    <Route path="/portfolio/:id">
                      <PortfolioPage />
                    </Route>
                    <Route path="/stock/:id">
                      <StockPage />
                    </Route>
                    <Route path="/public-profile/:id">
                      <PublicProfile />
                    </Route>
                    <Route path="/public-portfolio">
                      <PublicPortfolio />
                    </Route>
                    <Route path="/posts/:id">
                      <PostPage />
                    </Route>
                    <Route path="/forums/:id">
                      <ForumPage />
                    </Route>
                    <Route path="/forums/">
                      <ForumsPage />
                    </Route>
                    <Route path="/competitions/">
                      <CompetitionsPage />
                    </Route>
                    <Route path="/competition/:id">
                      <CompetitionPage />
                    </Route>
                  </Switch>
                </div>
              </Paper>
              <NotificationContainer />
            </ModalProvider>
          </UserProvider>
        </Router>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

export default App;
