import React, { useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import { useForums } from '../../../utils/useForums';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import ForumCard from './ForumCard';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(() => ({
  page: {
    paddingTop: 20,
  },
  headingContainer: {
    marginBottom: 40,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 30,
    color: '#888',
    fontStyle: 'italic',
  },
  cardContainer: {
    marginBottom: 20,
  },
}));

const ForumsPage = () => {
  const { token } = useContext(UserContext);
  const styles = useStyles();
  const [forums] = useForums([], [token]);

  return (
    <div className={styles.page}>
      <div className={styles.headingContainer}>
        <Typography variant="h2" className={styles.heading}>
          Forums
        </Typography>
        <Typography variant="h3" className={styles.description}>
          Cha-Ching Community Forums
        </Typography>
      </div>
      <div>
        <Grid container spacing={6}>
          {forums &&
            forums.map((forum) => (
              <Grid item sm={12} lg={6}>
                <div key={forum.id} className={styles.cardContainer}>
                  <ForumCard forum={forum} />
                </div>
              </Grid>
            ))}
        </Grid>
      </div>
    </div>
  );
};

export default ForumsPage;
