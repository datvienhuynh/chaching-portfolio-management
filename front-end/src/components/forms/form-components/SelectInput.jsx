import React from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { useField, useFormikContext } from 'formik';

const SelectInput = ({ name, options, preChange, postChange, ...otherProps }) => {
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

  const selectConfig = {
    fullWidth: true,
    ...fieldProps,
    ...otherProps,
    select: true,
    onChange: handleChange,
  };

  if (meta && meta.touched && meta.error) {
    selectConfig.error = true;
    selectConfig.helperText = meta.error;
  }

  return (
    <TextField {...selectConfig}>
      {!options && null}
      {options?.map((option, index) => {
        return (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        );
      })}
    </TextField>
  );
};

export default SelectInput;
