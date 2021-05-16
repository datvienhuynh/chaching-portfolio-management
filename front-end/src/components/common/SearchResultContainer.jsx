import React, { useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';

import ModalContext from './../contexts/ModalContext';
import UserContext from '../contexts/UserContext';
import AddStockForm from './../forms/AddStockForm';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    position: 'relative',
  },
}));

// Display a search result in a container
const SearchResultContainer = ({ result, overrideAddClick }) => {
  const classes = useStyles();
  const { showModal } = useContext(ModalContext);
  const { token } = useContext(UserContext);
  const path = `/stock/${result.id}`;

  // Show modal for adding stock when 'ADD TO PORTFOLIO' is clicked
  const handleAddClick = async () => {
    if (overrideAddClick) {
      overrideAddClick(result);
      return;
    }
    showModal(<AddStockForm info={{ stock: result }} />);
  };

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Link component={RouterLink} to={path}>
                <Typography gutterBottom variant="subtitle1">
                  {result.name}
                </Typography>
              </Link>
              <Typography variant="body2" gutterBottom>
                Australian Securities Exchange (ASX)
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Latest Price: ${result.latestPrice}
              </Typography>
            </Grid>
            {token && (
              <Grid item>
                <Button variant="contained" size="large" onClick={handleAddClick}>
                  Add to Portfolio
                </Button>
              </Grid>
            )}
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">{result.ticker}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SearchResultContainer;
