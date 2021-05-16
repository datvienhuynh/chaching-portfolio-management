import React from 'react';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useField, useFormikContext } from 'formik';

const DateInput = ({ name, preChange, postChange, ...otherProps }) => {
  const [fieldProps, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  const handleDateChange = (newDate) => {
    const oldValue = fieldProps.value;
    let processedValue = newDate;
    if (preChange) {
      processedValue = preChange(newDate, oldValue);
    }
    setFieldValue(name, processedValue);
    postChange?.(processedValue, oldValue);
  };

  const dateFieldProps = {
    fullWidth: true,
    variant: 'inline',
    format: 'dd/MM/yyyy',
    autoOk: true,

    ...fieldProps,
    ...otherProps,
    onChange: handleDateChange,
  };

  if (meta && meta.touched && meta.error) {
    dateFieldProps.error = true;
    dateFieldProps.helperText = meta.error;
  }

  return <KeyboardDatePicker {...dateFieldProps} />;
};

export default DateInput;
