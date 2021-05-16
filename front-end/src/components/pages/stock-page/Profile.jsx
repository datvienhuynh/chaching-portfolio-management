import React from 'react';
import ShowMoreText from 'react-show-more-text';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
  paper: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
  },
}));

const Profile = ({ stock }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid>
        <Typography variant="h6" style={{ marginBottom: 10 }}>
          <strong>Company Profile</strong>
        </Typography>
        <Typography variant="body2">
          <ShowMoreText lines={3} more="Show more" less="Show less" expanded={false}>
            {stock.overview.longBusinessSummary}
          </ShowMoreText>
        </Typography>
      </Grid>
    </Paper>
  );
};

export default Profile;
