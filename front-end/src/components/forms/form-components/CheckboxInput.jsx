import React from 'react';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from '@material-ui/core';
import { useField, useFormikContext } from 'formik';

const CheckboxInput = ({ name, label, legend, preChange, postChange, ...otherProps }) => {
  const [fieldProps, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  const handleChange = (event) => {
    const oldValue = fieldProps.value;
    let processedValue = event.target.checked;
    if (preChange) {
      processedValue = preChange(event.target.checked, oldValue);
    }
    setFieldValue(name, processedValue);
    postChange?.(processedValue, oldValue);
  };

  const checkboxProps = {
    color: 'primary',
    ...fieldProps,
    ...otherProps,
    onChange: handleChange,
  };

  const formControlProps = {};
  if (meta && meta.touched && meta.error) {
    formControlProps.error = true;
  }

  return (
    <FormControl {...formControlProps}>
      <FormLabel component="legend">{legend}</FormLabel>
      <FormGroup>
        <FormControlLabel control={<Checkbox {...checkboxProps} />} label={label} />
      </FormGroup>
    </FormControl>
  );
};

export default CheckboxInput;
