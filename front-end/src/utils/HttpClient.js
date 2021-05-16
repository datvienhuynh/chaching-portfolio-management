import { LOCAL_STORAGE_MAP } from '../configuration/constants';
import axios from 'axios';

/** HTTP client with methods to perform various HTTP requests. */
const HttpClient = () => {
  const getToken = () => {
    let token = localStorage.getItem(LOCAL_STORAGE_MAP.AUTHORIZATION_TOKEN);
    if (token && token !== 'null') {
      // include authorization token for every request
      return {
        headers: {
          // localStorage.getItem(AUTHORIZATION_TOKEN) falls back to `null`
          Authorization: `Token ${localStorage.getItem(LOCAL_STORAGE_MAP.AUTHORIZATION_TOKEN)}`,
        },
      };
    }
  };

  // wrap axios with defaultOptions
  // options has precedence over defaultOptions
  return {
    // requests with token
    // requests without body
    get: (url, options = {}) => axios.get(url, { ...getToken(), ...options }),
    delete: (url, options = {}) => axios.delete(url, { ...getToken(), ...options }),
    // requests with body
    post: (url, body, options = {}) => axios.post(url, body, { ...getToken(), ...options }),
    put: (url, body, options = {}) => axios.put(url, body, { ...getToken(), ...options }),
    patch: (url, body, options = {}) => axios.patch(url, body, { ...getToken(), ...options }),

    // requests without token
    simpleGet: axios.get,
    simpleDelete: axios.delete,
    simplePost: axios.post,
    simplePut: axios.put,
    simplePatch: axios.patch,
  };
};

export default HttpClient;
