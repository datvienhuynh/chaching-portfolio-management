import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  pickerContainer: {
    '&:not(:last-child)': {
      marginRight: 20,
    },
  },
}));

const DateRangePicker = ({ min, max, onChangeMin, onChangeMax }) => {
  const styles = useStyles();

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="flex-start">
        <div className={styles.pickerContainer}>
          <KeyboardDatePicker
            format="dd/MM/yyyy"
            margin="normal"
            id="min-date-picker"
            label="Minimum date"
            value={min}
            onChange={onChangeMin}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </div>
        <div className={styles.pickerContainer}>
          <KeyboardDatePicker
            format="dd/MM/yyyy"
            margin="normal"
            id="max-date-picker"
            label="Maximum date"
            value={max}
            onChange={onChangeMax}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </div>
      </Grid>
    </MuiPickersUtilsProvider>
  );
};

export default DateRangePicker;
