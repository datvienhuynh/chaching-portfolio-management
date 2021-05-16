import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import AreaChart from './charts/AreaChart';
import TwoColTable from './tables/TwoColTable';

const useStyles = makeStyles(() => ({
  paper: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
  },
}));

const Summary = ({ stock }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6" style={{ marginBottom: 10 }}>
            <strong>Summary</strong>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <TwoColTable data={stock.summaryTableData1} />
        </Grid>
        <Grid item xs={6}>
          <TwoColTable data={stock.summaryTableData2} />
        </Grid>
      </Grid>
      <Grid style={{ marginTop: 20 }}>
        <AreaChart
          chartId="AreaPriceChart"
          data={stock.dailyPriceData}
          valueAxisTitle={'Share Price (' + stock.overview.currency + ')'}
        />
      </Grid>
    </Paper>
  );
};

export default Summary;
