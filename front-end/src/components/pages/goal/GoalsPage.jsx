import React, { useContext, useEffect, useState } from 'react';
import { Grid, Box, Typography, Fab, Button } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import ModalContext from '../../contexts/ModalContext';
import UserContext from '../../contexts/UserContext';

import GoalCard from './GoalCard';
import GoalForm from '../../forms/GoalForm';
import Calculator from '../../forms/Calculator';

import { useGoals } from '../../../utils/useGoals';
import { get_wealth, get_growth } from '../../../utils/usePortfolios';

const useStyles = makeStyles({
  page: {
    paddingTop: 20,
  },
  headingContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});

const GoalsPage = () => {
  const { showModal } = useContext(ModalContext);
  const { token } = useContext(UserContext);
  const [wealth, setWealth] = useState(0);
  const [growth, setGrowth] = useState(0);
  const [goals] = useGoals([], [token, showModal]);
  const styles = useStyles();

  useEffect(() => {
    const getWealthInfo = async () => {
      const wealth = await get_wealth();
      if (wealth) {
        setWealth(wealth);
        const growth = await get_growth(wealth);
        growth && setGrowth(growth);
      }
    };
    getWealthInfo();
  }, []);

  const handleClickAdd = () => {
    showModal(<GoalForm />);
  };

  return (
    <Box className={styles.page}>
      <div className={styles.headingContainer}>
        <div>
          <Typography variant="h1" className={styles.heading}>
            Goals
          </Typography>
        </div>
        <div>
          <Button variant="contained" color="primary" onClick={() => showModal(<Calculator />)}>
            Calculator
          </Button>
        </div>
        <div>
          <Fab color="primary" onClick={handleClickAdd}>
            <AddIcon />
          </Fab>
        </div>
      </div>
      <div>
        <Grid container spacing={2}>
          {goals.map((goal) => {
            return (
              <Grid key={goal.id} item xs={12} md={6}>
                <GoalCard data={goal} wealth={wealth} growth={growth} />
              </Grid>
            );
          })}
        </Grid>
      </div>
    </Box>
  );
};

export default GoalsPage;
