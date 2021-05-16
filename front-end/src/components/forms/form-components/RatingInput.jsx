import React from 'react';
import { useField, useFormikContext } from 'formik';
import { Rating } from '@material-ui/lab';

const RatingInput = ({ name, preChange, postChange, ...otherProps }) => {
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
    ...fieldProps,
    ...otherProps,
    onChange: handleChange,
  };

  if (meta && meta.touched && meta.error) {
    textFieldProps.error = true;
    textFieldProps.helperText = meta.error;
  }

  return <Rating {...textFieldProps} />;
};

export default RatingInput;
