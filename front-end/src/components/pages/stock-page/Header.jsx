import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { getGoogleImage } from '../../../api/backendRequests';

const useStyles = makeStyles(() => ({
  paper: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
  },
  img: {
    margin: 'auto',
    marginBottom: 20,
    display: 'block',
    aspectRatio: '1/1',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

const Header = ({ stock }) => {
  const classes = useStyles();
  const [img, setImg] = useState(null);

  useEffect(() => {
    const fetchAVData = async () => {
      const path = await getGoogleImage(stock.overview.longName);
      setImg(path[0]);
    };
    fetchAVData();
  }, [stock.overview.longName]);

  return (
    <Paper className={classes.paper}>
      <Grid container>
        <Grid item xs={12}>
          {img && <img className={classes.img} alt="complex" src={img} />}
          <Typography variant="h5" style={{ marginBottom: 30 }}>
            <strong>{stock.overview.longName}</strong>
          </Typography>
        </Grid>
        <Grid item xs={4} align="center">
          <Typography variant="subtitle1">
            <strong>Market Cap</strong>
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {stock.overview.currency}${stock.quote['Market Cap']}
          </Typography>
        </Grid>
        <Grid item xs={4} align="center">
          <Typography variant="subtitle1">
            <strong>Last Updated</strong>
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {stock.updatedAt}
          </Typography>
        </Grid>
        <Grid item xs={4} align="center">
          <Typography variant="subtitle1">
            <strong>Data Source</strong>
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Yahoo Finance
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Header;
