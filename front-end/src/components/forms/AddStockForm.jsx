import React, { useState, useContext } from 'react';

import { Paper, Typography, Grid } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';

import ModalContext from '../contexts/ModalContext';
import UserContext from '../contexts/UserContext';
import { addStockToPortfolio } from '../../utils/transactionRequests';
import SelectInput from './form-components/SelectInput';
import IntegerInput from './form-components/IntegerInput';
import DateInput from './form-components/DateInput';
import SubmitButton from './form-components/SubmitButton';
import TransactionResult from './TransactionResult';
import { formatDate } from '../common/formatting';
import { usePortfolios } from '../../utils/usePortfolios';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    width: 500,
    minHeight: 500,
  },
  field: {
    padding: theme.spacing(2),
  },
  submitButton: {
    width: '80%',
    position: 'absolute',
    bottom: 40,
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: 20,
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
}));

// Show form for adding a selected stock to a portfolio
const AddStockForm = ({ info }) => {
  const classes = useStyles();
  // Get authorization token for post request
  const { token } = useContext(UserContext);
  const { showModal } = useContext(ModalContext);
  const [portfolios] = usePortfolios([], [token, showModal]);
  const [submitError, setSubmitError] = useState('');

  const initialFormValues = {
    portfolio: '',
    quantity: 1,
    date: new Date(),
  };

  const formValidation = {
    portfolio: Yup.string().required('Required'),
    quantity: Yup.number()
      .integer()
      .typeError('Quantity must be an integer')
      .test('is-not-zero', 'Cannot be 0', (value) => {
        return parseInt(value) !== 0;
      })
      .required('Required'),
    date: Yup.date().required('required'),
  };

  const submitForm = async (values) => {
    try {
      const { holding, transaction } = await addStockToPortfolio(
        token,
        info.stock.id,
        values.portfolio,
        values.quantity,
        formatDate(values.date, 'YYYY-MM-DD'),
      );
      showModal(<TransactionResult info={{ holding: holding, data: transaction }} />);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <Paper className={classes.root}>
      <Formik
        initialValues={initialFormValues}
        validationSchema={Yup.object().shape(formValidation)}
        onSubmit={(values) => {
          submitForm(values);
        }}
      >
        <Form>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h4" align="center">
                Add {info.stock.ticker} to Your Portfolio
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.field}>
              <SelectInput
                name="portfolio"
                label="Portfolio"
                options={portfolios.map((portfolio) => {
                  return {
                    value: portfolio.id,
                    label: portfolio.name,
                  };
                })}
              />
            </Grid>
            <Grid item xs={12} className={classes.field}>
              <Grid container justify="flex-end">
                <div>
                  <Link component={RouterLink} to="/portfolio">
                    Add a portfolio
                  </Link>
                </div>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} className={classes.field}>
              <IntegerInput name="quantity" label="Quantity" positive />
            </Grid>
            <Grid item xs={12} md={6} className={classes.field}>
              <DateInput name="date" label="Date" />
            </Grid>
          </Grid>
          {submitError && (
            <Typography variant="body1" className={classes.submitError}>
              {submitError}
            </Typography>
          )}
          <SubmitButton className={classes.submitButton} fullWidth={false}>
            Submit
          </SubmitButton>
        </Form>
      </Formik>
    </Paper>
  );
};

export default AddStockForm;
