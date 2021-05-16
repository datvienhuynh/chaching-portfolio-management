import React from 'react';
import { Button } from '@material-ui/core';
import { useFormikContext } from 'formik';

const SubmitButton = ({ children, ...otherProps }) => {
  const { submitForm, isValid } = useFormikContext();

  const handleSubmit = () => {
    submitForm();
  };

  const submitButtonProps = {
    variant: 'contained',
    color: 'primary',
    fullWidth: true,
    disabled: !isValid,
    onClick: handleSubmit,
    ...otherProps,
  };

  return <Button {...submitButtonProps}>{children}</Button>;
};

export default SubmitButton;
