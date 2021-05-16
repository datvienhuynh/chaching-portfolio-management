import React, { useContext } from 'react';
import { Box, AppBar, Toolbar, Button, ButtonGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import UserContext from '../contexts/UserContext';
import ModalContext from '../contexts/ModalContext';
import LoginForm from '../forms/LoginForm';
import Logo from './logo/Logo';
import { LOCAL_STORAGE_MAP } from '../../configuration/constants';

const useStyles = makeStyles({
  navLinks: {
    marginLeft: 20,
  },
  navLink: {
    color: 'white',
  },
});

const Header = () => {
  const { showModal } = useContext(ModalContext);
  const { token, setToken, setUser } = useContext(UserContext);
  const history = useHistory();

  const classes = useStyles();

  const handleLoginClick = () => {
    showModal(<LoginForm />);
  };

  const handleLogoutClick = () => {
    setToken('');
    setUser(null);
    localStorage.setItem(LOCAL_STORAGE_MAP.AUTHORIZATION_TOKEN, null);
    history.push('/');
  };

  return (
    <AppBar position="static" styles={{ flexGrow: 1 }}>
      <Toolbar>
        <Box flexGrow={1} display="flex">
          <Logo />
          <ButtonGroup variant="text" size="large" className={classes.navLinks}>
            <Button className={classes.navLink} onClick={() => history.push('/')}>
              Home
            </Button>
            <Button className={classes.navLink} onClick={() => history.push('/market')}>
              Market
            </Button>
            <Button className={classes.navLink} onClick={() => history.push('/competitions')}>
              Competitions
            </Button>
            <Button className={classes.navLink} onClick={() => history.push('/forums')}>
              Forums
            </Button>
          </ButtonGroup>
        </Box>
        <ButtonGroup variant="text" size="large" className={classes.navLinks}>
          {token && [
            <Button className={classes.navLink} onClick={() => history.push('/portfolio')}>
              My Portfolios
            </Button>,
            <Button className={classes.navLink} onClick={() => history.push('/goals')}>
              My Goals
            </Button>,
          ]}
        </ButtonGroup>
        <Button
          variant="contained"
          size="large"
          onClick={token ? handleLogoutClick : handleLoginClick}
        >
          {token && token !== 'null' ? 'Log Out' : 'Login'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
