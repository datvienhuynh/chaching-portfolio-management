import React, { useState, useContext } from 'react';
import { Paper, Typography, Link } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';

import ModalContext from '../contexts/ModalContext';
import UserContext from '../contexts/UserContext';
import TextInput from './form-components/TextInput.jsx';
import PasswordInput, { passwordValidation } from './form-components/PasswordInput';
import SubmitButton from './form-components/SubmitButton';
import { login, signup } from '../../utils/authenticationRequests';

const useStyles = makeStyles({
  loginForm: {
    padding: 30,
    width: 450,
    height: 750,
  },
  title: {
    marginBottom: 40,
  },
  submitButton: {
    width: '80%',
    position: 'absolute',
    bottom: 40,
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
});

const LoginForm = ({ isSignup }) => {
  const { showModal } = useContext(ModalContext);
  const { setToken, setUser } = useContext(UserContext);
  const [showSignUpForm, setShowSignUpForm] = useState(isSignup);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const classes = useStyles();

  const initialFormValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const formValidation = {
    username: Yup.string().required('Required'),
    password: passwordValidation.required('Required'),
  };

  if (showSignUpForm) {
    formValidation.email = Yup.string().email('Invalid email').required('Required');
    formValidation.confirmPassword = Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Required');
  }

  const submitForm = async (values) => {
    setLoading(true);
    try {
      let token;
      if (showSignUpForm) {
        token = await signup(
          values.username,
          values.email,
          values.password,
          values.confirmPassword,
        );
      } else {
        token = await login(values.username, values.password);
      }
      setToken(token);
      setUser({ username: values.username });
      setSubmitError('');
      showModal(null);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper className={classes.loginForm}>
      <Formik
        initialValues={initialFormValues}
        validationSchema={Yup.object().shape(formValidation)}
        onSubmit={(values) => {
          submitForm(values);
        }}
      >
        <Form>
          <Typography variant="h3" align="center" className={classes.title}>
            {showSignUpForm ? 'Sign Up' : 'Log In'}
          </Typography>
          <TextInput
            name="username"
            label="Username"
            className={classes.input}
            InputProps={{
              className: classes.underlyingInput,
            }}
            autoComplete="username"
          />
          {showSignUpForm && (
            <TextInput
              name="email"
              label="Email"
              className={classes.input}
              InputProps={{
                className: classes.underlyingInput,
              }}
              autoComplete="email"
            />
          )}
          <PasswordInput
            name="password"
            label="Password"
            className={classes.input}
            InputProps={{
              className: classes.underlyingInput,
            }}
            autoComplete="current-password"
          />
          {showSignUpForm && (
            <PasswordInput
              name="confirmPassword"
              label="Confirm Password"
              className={classes.input}
              InputProps={{
                className: classes.underlyingInput,
              }}
              autoComplete="current-password"
            />
          )}
          <Link
            onClick={() => {
              showSignUpForm ? setShowSignUpForm(false) : setShowSignUpForm(true);
              setSubmitError('');
            }}
            className={classes.link}
          >
            {showSignUpForm
              ? 'Already have an account? Click here to login.'
              : 'New here? Click here to sign up.'}
          </Link>
          {!loading && submitError && (
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

export default LoginForm;
