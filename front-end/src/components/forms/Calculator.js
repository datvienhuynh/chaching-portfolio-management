import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Card,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import FinancialCalculatorForm from './FinancialCalculator';
import RegularSavingCalculator from './RegularSavingCalculator';
import SuccessText from '../common/SuccessText';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles((theme) => ({
  editGoalForm: {
    padding: 30,
    height: 750,
    width: 600,
  },
  title: {
    marginBottom: 40,
  },
  field: {
    paddingBottom: theme.spacing(4),
  },
  submitButton: {
    position: 'absolute',
    bottom: 40,
    width: '80%',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: 20,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 100,
    width: '80%',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: 20,
  },
  input: {
    marginBottom: 40,
  },
  underlyingInput: {
    fontSize: 20,
  },
  underlyingSelectInput: {
    fontsize: 20,
  },
  submitError: {
    width: '100%',
    position: 'absolute',
    bottom: 100,
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    color: 'red',
  },
  link: {
    cursor: 'pointer',
  },
}));

const Calculator = () => {
  const [selectedCalculator, setSelectedCalculator] = useState(1);
  const [showResult, setShowResult] = useState(null);

  const classes = useStyles();

  return (
    <Paper className={classes.editGoalForm}>
      <Typography variant="h5">Calculators</Typography>
      <FormControl
        style={{ width: '100%', marginBottom: '2rem', marginTop: '1rem' }}
        variant="outlined"
        className={classes.formControl}
      >
        <InputLabel id="demo-simple-select-outlined-label">Select Calculator</InputLabel>
        <Select
          onChange={(e) => {
            setSelectedCalculator(e.target.value);
            setShowResult(null);
          }}
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={selectedCalculator}
          label="Age"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={1}>Financial Independence Calculator</MenuItem>
          <MenuItem value={2}>Regular Saving Calculator</MenuItem>
        </Select>
      </FormControl>
      <Card style={{ marginTop: '1rem', padding: '1rem' }}>
        <CardContent>
          {selectedCalculator === 1 && <FinancialCalculatorForm setShowResult={setShowResult} />}
          {selectedCalculator === 2 && <RegularSavingCalculator setShowResult={setShowResult} />}
          {showResult && <SuccessText message={showResult} />}
        </CardContent>
      </Card>
    </Paper>
  );
};

export default Calculator;
