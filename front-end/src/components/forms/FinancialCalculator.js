import React from 'react';
import { Grid } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';

import TextInput from './form-components/TextInput';
import CurrencyInput from './form-components/CurrencyInput';
import SubmitButton from './form-components/SubmitButton';

const useStyles = makeStyles((theme) => ({
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
  input: {
    marginBottom: 40,
  },
  underlyingInput: {
    fontSize: 20,
  },
  underlyingSelectInput: {
    fontsize: 20,
  },
  link: {
    cursor: 'pointer',
  },
}));

const FinancialCalculatorForm = ({ setShowResult }) => {
  const classes = useStyles();

  const initialFormValues = {
    amountOfIncome: '',
    livingExpense: '',
    rateOfInflation: '',
    expectedRateOfInflation: '',
    expectedPercentageOfReturns: '',
  };

  const formValidation = {
    amountOfIncome: Yup.number().required(),
    livingExpense: Yup.number().required(),

    expectedRateOfInflation: Yup.number().required(),
    expectedPercentageOfReturns: Yup.number().required(),
  };

  const handleSubmitForm = async (values) => {
    const value =
      parseFloat(values.amountOfIncome) /
      (parseFloat(values.expectedPercentageOfReturns) -
        parseFloat(values.expectedRateOfInflation) -
        parseFloat(values.livingExpense));
    if (value > 0) {
      setShowResult(`You need another $${value.toFixed(2)}.`);
    } else {
      setShowResult(`You have $${-value.toFixed(2)} to spare.`);
    }
  };

  return (
    <Formik
      initialValues={initialFormValues}
      formValidation={formValidation}
      onSubmit={(values) => {
        handleSubmitForm(values);
      }}
    >
      <Form>
        <Grid container>
          <Grid container item xs={12}>
            <Grid item xs={12} className={classes.field}>
              <CurrencyInput
                name="amountOfIncome"
                label="Amount of income you would like to recieve"
                rows={1}
              />
            </Grid>

            <Grid item xs={12} className={classes.field}>
              <TextInput
                type="number"
                name="livingExpense"
                label="Living Expenses Increase"
                rows={1}
              />
            </Grid>

            <Grid item xs={12} className={classes.field}>
              <TextInput
                type="number"
                name="expectedRateOfInflation"
                label="Expected Rate of Inflation"
                rows={1}
              />
            </Grid>
            <Grid item xs={12} className={classes.field}>
              <TextInput
                type="number"
                name="expectedPercentageOfReturns"
                label="Expected Percentage of Returns"
                rows={1}
              />
            </Grid>
          </Grid>
        </Grid>
        <SubmitButton className={classes.submitButton}>Submit</SubmitButton>
      </Form>
    </Formik>
  );
};

export default FinancialCalculatorForm;
