import React, { useContext, useState, useEffect } from 'react';
import { Typography, ButtonGroup, Button, CircularProgress } from '@material-ui/core';

import ModalContext from '../../contexts/ModalContext';
import LoginForm from '../../forms/LoginForm';
import Banner from '../../common/Banner';
import { unSubscribeFromAllStock, getSubscribedStock } from '../../../utils/useStocks';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  title: {
    fontWeight: 'bold',
    marginRight: 20,
    marginLeft: 8,
  },
  subtitle: {
    color: '#666',
    marginBottom: 10,
    marginLeft: 8,
  },
  description: {
    marginBottom: 10,
    marginLeft: 8,
  },
});

const NewPlatformBanner = ({ onDismiss }) => {
  const { showModal } = useContext(ModalContext);
  const [loading, setLoading] = useState(true);
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const classes = useStyles();

  const onUnsubscribeClicked = async () => {
    await unSubscribeFromAllStock();
    setSubscriptionCount(0);
  };

  useEffect(() => {
    getSubscribedStock(setLoading, setSubscriptionCount);
  }, []);
  const onSignupClick = () => {
    showModal(<LoginForm isSignup />);
  };

  return (
    <Banner onDismiss={onDismiss}>
      <Typography className={classes.title} variant="h4">
        Brand New Stock Portfolio Platform!
      </Typography>
      <Typography className={classes.subtitle} variant="h6">
        Boost your confidence in your portfolio through tracking, predicting and community feedback.
      </Typography>
      <ButtonGroup variant="text" color="primary">
        <Button onClick={onSignupClick}>Sign Up</Button>
        <Button
          disabled={subscriptionCount === 0}
          onClick={onUnsubscribeClicked}
          variant="contained"
        >
          {loading ? (
            <CircularProgress color="primary" size={30} />
          ) : (
            '  Unsubscribe Email Notifications'
          )}
        </Button>
      </ButtonGroup>
    </Banner>
  );
};

export default NewPlatformBanner;
