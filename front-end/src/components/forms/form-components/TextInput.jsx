import React from 'react';
import { TextField } from '@material-ui/core';
import { useField, useFormikContext } from 'formik';

const TextInput = ({ name, preChange, postChange, ...otherProps }) => {
  const [fieldProps, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  const handleChange = (event) => {
    const oldValue = fieldProps.value;
    let processedValue = event.target.value;
    if (preChange) {
      processedValue = preChange(event.target.value, oldValue);
    }
    setFieldValue(name, processedValue);
    postChange?.(processedValue, oldValue);
  };

  const textFieldProps = {
    fullWidth: true,
    ...fieldProps,
    ...otherProps,
    onChange: handleChange,
  };

  if (meta && meta.touched && meta.error) {
    textFieldProps.error = true;
    textFieldProps.helperText = meta.error;
  }

  return <TextField {...textFieldProps} />;
};

export default TextInput;
