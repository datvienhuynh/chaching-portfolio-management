import React, { useState, useContext } from 'react';
import { Paper, Typography, Grid } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import ModalContext from '../contexts/ModalContext';
import TextInput from './form-components/TextInput';
import SubmitButton from './form-components/SubmitButton';
import { usePortfolios } from '../../utils/usePortfolios';
import UserContext from '../contexts/UserContext';
import SelectInput from './form-components/SelectInput';
import { addPost } from '../../utils/usePost';

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

const NewPostForm = ({ forumID }) => {
  const { token } = useContext(UserContext);
  const { showModal } = useContext(ModalContext);
  const [portfolios] = usePortfolios([], [token, showModal]);
  const [submitError, setSubmitError] = useState();
  const classes = useStyles();

  const initialFormValues = {
    content: '',
  };

  const formValidation = {
    content: Yup.string().required('Required'),
  };

  const submitForm = async (values) => {
    try {
      await addPost({ forum: forumID, ...values });
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
                Create New Post
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.field}>
              <TextInput name="name" label="Title" />
            </Grid>
            <Grid item xs={12} className={classes.field}>
              <TextInput name="content" label="Content" />
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

export default NewPostForm;
