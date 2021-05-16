import React from 'react';
import TextInput from './TextInput';
import { InputAdornment } from '@material-ui/core';
import { AttachMoney as DollarIcon } from '@material-ui/icons';

const CurrencyInput = ({ preChange, InputProps, positive, ...otherProps }) => {
  const handlePreChange = (newValue, oldValue) => {
    let processedValue = newValue;
    const regex = positive ? /[^0-9.]/ : /[^0-9.-]/;
    if (regex.test(newValue)) {
      processedValue = oldValue;
    }
    if (preChange) {
      processedValue = preChange(processedValue, oldValue);
    }
    return processedValue;
  };

  const currencyInputProps = {
    startAdornment: (
      <InputAdornment position="start">
        <DollarIcon fontSize="small" style={{ marginBottom: 5 }} />
      </InputAdornment>
    ),
    ...InputProps,
  };

  return <TextInput {...otherProps} preChange={handlePreChange} InputProps={currencyInputProps} />;
};

export default CurrencyInput;
