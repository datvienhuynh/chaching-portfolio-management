import React, { useState, useContext } from 'react';
import { Grid, Paper, Typography, Button, Modal, DialogContent } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';

import ModalContext from '../contexts/ModalContext';
import TextInput from './form-components/TextInput';
import TextAreaInput from './form-components/TextAreaInput';
import SelectInput from './form-components/SelectInput';
import CurrencyInput from './form-components/CurrencyInput';
import DateInput from './form-components/DateInput';
import SubmitButton from './form-components/SubmitButton';

import Dialogue from '../common/Dialogue';
import { edit_goal, add_goal, delete_goal } from '../../utils/useGoals';
import { formatDate } from '../common/formatting';
import { useColours } from '../../utils/useColours';
import UserContext from '../contexts/UserContext';

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

const GoalForm = ({ goal }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { token } = useContext(UserContext);
  const { showModal } = useContext(ModalContext);
  const [colors] = useColours([], [token, showModal]);

  const classes = useStyles();

  const onDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteGoal = async () => {
    try {
      await delete_goal(goal.id);
      setSubmitError('');
      showModal(null);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  const initialFormValues = {
    name: goal?.name || '',
    description: goal?.description || '',
    colour: goal?.colour.id || 1, // the first colour
    startValue: goal?.startAmount || 0,
    startDate: goal?.startTime ? new Date(goal.startTime) : new Date(),
    targetValue: goal?.target || 0,
    targetDate: goal?.targetTime ? new Date(goal.targetTime) : new Date(),
  };

  const formValidation = {
    name: Yup.string().required('Required'),
    description: Yup.string(),
    colour: Yup.string().required('Required'),
    startValue: Yup.number().required('Required'),
    startDate: Yup.date().required('Required'),
    targetValue: Yup.number().required('Required'),
    targetDate: Yup.date().required('Required'),
  };

  const handleSubmitForm = async (values) => {
    const payload = {
      name: values.name,
      description: values.description,
      colour: values.colour,
      startAmount: values.startValue,
      startTime: `${formatDate(values.startDate, 'YYYY-MM-DD')} 00:00`,
      target: values.targetValue,
      targetTime: `${formatDate(values.targetDate, 'YYYY-MM-DD')} 00:00`,
    };
    try {
      if (goal) {
        await edit_goal(goal.id, payload);
      } else {
        await add_goal(payload);
      }
      setSubmitError('');
      showModal(null);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <Paper className={classes.editGoalForm}>
      <Formik
        initialValues={initialFormValues}
        formValidation={formValidation}
        onSubmit={(values) => {
          handleSubmitForm(values);
        }}
      >
        <Form>
          <Typography variant="h3" align="center" className={classes.title}>
            {goal ? 'Edit Goal' : 'Add Goal'}
          </Typography>
          <Grid container>
            <Grid
              container
              item
              xs={6}
              style={{ borderRight: '1px solid black', paddingRight: 20 }}
            >
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
            </Grid>
            <Grid container item xs={6} style={{ paddingLeft: 20 }}>
              <Grid item xs={12} className={classes.field}>
                <CurrencyInput name="startValue" label="Starting Value" positive />
              </Grid>
              <Grid item xs={12} className={classes.field}>
                <DateInput name="startDate" label="Starting Date" />
              </Grid>
              <Grid item xs={12} className={classes.field}>
                <CurrencyInput name="targetValue" label="Target Value" />
              </Grid>
              <Grid item xs={12} className={classes.field}>
                <DateInput name="targetDate" label="Target Date" />
              </Grid>
            </Grid>
          </Grid>
          {submitError && (
            <Typography variant="body1" className={classes.submitError}>
              {submitError}
            </Typography>
          )}
          {goal && (
            <Button
              variant="contained"
              onClick={onDeleteClick}
              className={classes.deleteButton}
              color="secondary"
            >
              Delete
            </Button>
          )}
          <SubmitButton className={classes.submitButton}>Submit</SubmitButton>
          {showDeleteModal && (
            <Modal open={true} onClose={() => setShowDeleteModal(false)}>
              <DialogContent>
                <Dialogue
                  prompt="Are you sure you want to delete this goal?"
                  onCancel={() => setShowDeleteModal(false)}
                  onContinue={handleDeleteGoal}
                />
              </DialogContent>
            </Modal>
          )}
        </Form>
      </Formik>
    </Paper>
  );
};

export default GoalForm;
