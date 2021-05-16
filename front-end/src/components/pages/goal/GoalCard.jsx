import React, { useContext } from 'react';
import { Box, Paper, Grid, Typography, LinearProgress, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Edit as EditIcon } from '@material-ui/icons';
import moment from 'moment';

import ModalContext from '../../contexts/ModalContext';
import GoalForm from '../../forms/GoalForm';
import { formatCurrency } from '../../common/formatting';

const useStyles = makeStyles({
  paper: {
    position: 'relative',
    marginBottom: 30,
    overflow: 'hidden',
  },
  editIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  grid: {
    padding: 20,
  },
  centerTextVertical: {
    display: 'flex',
    alignItems: 'center',
  },
});

const GoalCard = ({ data, wealth, growth }) => {
  const { showModal } = useContext(ModalContext);
  const classes = useStyles();

  const today = new Date();
  const targetDate = new Date(data.targetTime);
  const startDate = new Date(data.startTime);
  const startAmount = parseFloat(data.startAmount);
  const targetAmount = parseFloat(data.target);
  const createdDate = new Date(data.createAt);
  const updatedDate = new Date(data.updatedAt);
  const updated =
    Math.round(createdDate.getTime() / 1000) !== Math.round(updatedDate.getTime() / 1000);

  const progressToGoal = Math.min(startAmount + wealth || startAmount, targetAmount);
  const percentGoalComplete = Math.round((progressToGoal / targetAmount) * 100) || 0;
  // the fallback is for divide by targetAmount === 0
  const percentTimeLeft =
    Math.round(((targetDate - today) / (targetDate - startDate)) * 100) || 100;
  // the fallback is for divide by targetDate - startDate === 100
  //
  const daysToGoal =
    progressToGoal === targetAmount
      ? 0
      : Math.round((Math.log(targetAmount / wealth) / Math.log(growth)) * 365);

  const editGoal = () => {
    showModal(<GoalForm goal={data} />);
  };

  let etaString = growth > 0 ? moment.duration(daysToGoal, 'days').humanize() : '∞';
  if (daysToGoal === 0) etaString = 'Done';

  return (
    <Paper elevation={3} className={classes.paper}>
      <Grid container direction="column">
        <Grid
          item
          container
          direction="row"
          className={classes.grid}
          style={{ backgroundColor: data.colour.hex_for_display }}
        >
          <Grid item xs={8} className={classes.centerTextVertical}>
            <Typography variant="h5">{data.name}</Typography>
          </Grid>
          <Grid item xs={4} className={classes.centerTextVertical}>
            <Typography variant="h5" align="right">
              {`${formatCurrency(targetAmount)}`}
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="column" spacing={2} className={classes.grid}>
          <Grid item container direction="row">
            <Grid item xs={12}>
              <Typography>{data.description}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" value={percentGoalComplete} />
              </Box>
              <Box minWidth="max-content">
                <Typography variant="body2" color="textSecondary">
                  {`${Math.round(percentGoalComplete)}%`}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" color="secondary" value={percentTimeLeft} />
              </Box>
              <Box minWidth="max-content">
                <Typography variant="body2" color="textSecondary">
                  {`${moment(targetDate).fromNow(true)} left`}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item container direction="row">
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary" align="left">
                {`ETA: ${etaString}`}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary" align="right">
                {`${updated ? 'updated' : 'created'} ${moment(updatedDate).fromNow()}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <IconButton className={classes.editIcon} onClick={() => editGoal()}>
        <EditIcon />
      </IconButton>
    </Paper>
  );
};

export default GoalCard;
