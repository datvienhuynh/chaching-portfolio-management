import React from 'react';
import TextInput from './TextInput';

const IntegerInput = ({ preChange, positive, ...otherProps }) => {
  const handlePreChange = (newValue, oldValue) => {
    let processedValue = newValue;
    const regex = positive ? /[^0-9]/ : /[^0-9-]/;
    if (regex.test(newValue)) {
      processedValue = oldValue;
    }
    if (preChange) {
      processedValue = preChange(processedValue, oldValue);
    }
    return processedValue;
  };

  return <TextInput {...otherProps} preChange={handlePreChange} />;
};

export default IntegerInput;
