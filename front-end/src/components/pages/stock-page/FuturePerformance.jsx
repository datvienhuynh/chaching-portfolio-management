import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import ChartTabs from './ChartTabs';

const useStyles = makeStyles(() => ({
  paper: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
  },
}));

const FuturePerformance = ({ stock }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid>
        <Typography variant="h6" style={{ marginBottom: 10 }}>
          <strong>Future Performance</strong>
        </Typography>
        <ChartTabs stock={stock} type="projectionchart" />
      </Grid>
    </Paper>
  );
};

export default FuturePerformance;
