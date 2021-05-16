import React, { useState, useContext } from 'react';
import { Paper, Typography, Grid } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';

import ModalContext from '../contexts/ModalContext';
import UserContext from '../contexts/UserContext';

import TextInput from './form-components/TextInput';
import TextAreaInput from './form-components/TextAreaInput';
import SelectInput from './form-components/SelectInput';
import CheckboxInput from './form-components/CheckboxInput';
import SubmitButton from './form-components/SubmitButton';
import { add_portfolio } from '../../utils/usePortfolios';
import { useColours } from '../../utils/useColours';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    width: 500,
    minHeight: 600,
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

const NewPortfolioForm = () => {
  const { token } = useContext(UserContext);
  const { showModal } = useContext(ModalContext);
  const [colors] = useColours([], [token, showModal]);
  const [submitError, setSubmitError] = useState();
  const classes = useStyles();

  const initialFormValues = {
    name: '',
    description: '',
    colour: '',
    isPublic: false,
  };

  const formValidation = {
    name: Yup.string().required('Required'),
    description: Yup.string(),
    colour: Yup.string().required('Required'),
    isPublic: Yup.boolean(),
  };

  const submitForm = async (values) => {
    try {
      await add_portfolio(values);
      setSubmitError('');
      showModal(null);
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
                Create New Portfolio
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.field}>
              <TextInput name="name" label="Name" />
            </Grid>
            <Grid item xs={12} className={classes.field}>
              <TextAreaInput name="description" label="Description" rows={1} />
            </Grid>
            {!!colors.length && (
              <Grid item xs={12} className={classes.field}>
                <SelectInput name="colour" label="Colour" options={colors} />
              </Grid>
            )}
            <Grid item xs={12} className={classes.field}>
              <CheckboxInput name="isPublic" label="Public Portfolio" />
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

export default NewPortfolioForm;
