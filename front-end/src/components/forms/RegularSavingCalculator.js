import React from 'react';
import { Grid } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';

import TextInput from './form-components/TextInput';
import CurrencyInput from './form-components/CurrencyInput';
import DateInput from './form-components/DateInput';
import SubmitButton from './form-components/SubmitButton';

import moment from 'moment';

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

const RegularSavingCalculator = ({ setShowResult }) => {
  const classes = useStyles();

  const initialFormValues = {
    targetFutureAmount: '',
    targetDate: '',
    existingInvestmentAmount: '',
    rateOfReturn: '', // the first colour
  };

  const formValidation = {
    targetFutureAmount: Yup.number().required('Required'),
    targetDate: Yup.string().required('Required'),
    existingInvestmentAmount: Yup.number().required('Required'),
    rateOfReturn: Yup.number().required('Required'), // the first colour
  };

  const handleSubmitForm = async (values) => {
    const P = values.existingInvestmentAmount;
    const D = values.targetDate;
    const T = values.targetFutureAmount;
    const r = values.rateOfReturn;

    const differenceInDays = calculateDateDifference(D) / 365;
    const F = parseFloat(P) * parseFloat(Math.pow(1 + parseFloat(r), parseFloat(differenceInDays)));
    const S = T - F;
    const regularInvestment = S / Math.pow(1 + parseFloat(r), differenceInDays);
    if (regularInvestment > 0) {
      setShowResult(`You need another $${regularInvestment.toFixed(2)}.`);
    } else {
      setShowResult(`You have $${-regularInvestment.toFixed(2)} to spare.`);
    }
  };

  const calculateDateDifference = (targetDate) => {
    var a = moment(new Date(targetDate));
    var b = moment(new Date());
    return a.diff(b, 'days');
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
                name="existingInvestmentAmount"
                label="Existing Investment Amount"
                rows={1}
              />
            </Grid>
            <Grid item xs={12} className={classes.field}>
              <CurrencyInput name="targetFutureAmount" label="Target Future Amount" rows={1} />
            </Grid>

            <Grid item xs={12} className={classes.field}>
              <DateInput label="Target Date" name="targetDate" />
            </Grid>
            <Grid item xs={12} className={classes.field}>
              <TextInput
                name="rateOfReturn"
                label="Average yearly rate of return on the investment"
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

export default RegularSavingCalculator;
