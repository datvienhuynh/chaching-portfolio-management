import { LOGIN_URL, SIGNUP_URL } from '../configuration/constants';
import HttpClient from './HttpClient';
import { handleError } from './backendRequests';

const HTTPClient = HttpClient();

export const login = async (username, password) => {
  try {
    const res = await HTTPClient.simplePost(LOGIN_URL, {
      username: username,
      password: password,
    });
    return res.data.key;
  } catch (err) {
    if (err.response) {
      if (err.response.data.non_field_errors) {
        throw new Error(err.response.data.non_field_errors[0]);
      } else if (err.response.data.detail) {
        throw new Error(err.response.data.detail);
      }
    }
    handleError(err);
  }
};

export const signup = async (username, email, password1, password2) => {
  try {
    const res = await HTTPClient.simplePost(SIGNUP_URL, {
      username: username,
      email: email,
      password1: password1,
      password2: password2,
    });
    return res.data.key;
  } catch (err) {
    if (err.response) {
      if (err.response.data.non_field_errors) {
        throw new Error(err.response.data.non_field_errors[0]);
      } else if (err.response.data.detail) {
        throw new Error(err.response.data.detail);
      } else if (err.response.data.username) {
        throw new Error(err.response.data.username);
      } else if (err.response.data.email) {
        throw new Error(err.response.data.email);
      }
    }
    handleError(err);
  }
};
