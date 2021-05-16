import React, { useState } from 'react';
import { InputAdornment, IconButton } from '@material-ui/core';
import VisibilityOnIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import * as Yup from 'yup';

import TextInput from './TextInput';

export const passwordValidation = Yup.string()
  .min(8, 'Password must be at least 8 characters')
  .matches(/^[A-Za-z\d!#$%&*+?@_~-]+$/, 'Password can only contain a-zA-Z0-9!#$%&*+-?@_~')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    'Password must contain at least one lowercase letter, one uppercase letter and one number',
  );

const PasswordInput = ({ InputProps, ...otherProps }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShow = () => {
    setShowPassword(!showPassword);
  };

  const inputProps = {
    ...InputProps,
    type: showPassword ? 'text' : 'password',
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={toggleShow} onMouseDown={(event) => event.preventDefault()}>
          {showPassword ? <VisibilityOnIcon /> : <VisibilityOffIcon />}
        </IconButton>
      </InputAdornment>
    ),
  };

  return <TextInput {...otherProps} InputProps={inputProps} />;
};

export default PasswordInput;
