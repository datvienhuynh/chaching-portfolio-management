import React, { useState, useContext } from 'react';
import { Paper, Typography, Grid } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import ModalContext from '../contexts/ModalContext';
import TextInput from './form-components/TextInput';
import SubmitButton from './form-components/SubmitButton';
import { addComment } from '../../utils/useComments';
import RatingInput from './form-components/RatingInput';

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

const NewCommentForm = ({ postID, hasPortfolio }) => {
  const { showModal } = useContext(ModalContext);
  const [submitError, setSubmitError] = useState();
  const classes = useStyles();

  const initialFormValues = {
    content: '',
    rating: 0,
  };

  const formValidation = {
    content: Yup.string().required('Required'),
    rating: Yup.number().required('Required'),
  };

  const submitForm = async (values) => {
    try {
      await addComment({ post: postID, ...values });
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
                Create New Comment
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.field}>
              <TextInput name="content" label="Content" />
            </Grid>
            {hasPortfolio && (
              <Grid item xs={12} className={classes.field}>
                <div>
                  <span>Rating for the portfolio:</span>
                </div>
                <RatingInput name="rating" label="Rating" />
              </Grid>
            )}
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

export default NewCommentForm;
