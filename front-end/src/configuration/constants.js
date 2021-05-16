export const LOCAL_STORAGE_MAP = {
  AUTHORIZATION_TOKEN: 'cc_token',
  AUTHORIZATION_USER: 'cc_user',
  SHOULD_HIDE_BANNER: 'cc_should_hide_banner',
};

const BACKEND_URL = 'http://localhost:8000/api/v1';
export const LOGIN_URL = `${BACKEND_URL}/auth/login/`;
export const SIGNUP_URL = `${BACKEND_URL}/auth/signup`; // note: no trailing slash here

export const get_URL = (endpoint, modifier, parameters) => {
  let url = `${BACKEND_URL}/${endpoint}/`;
  if (!!modifier) {
    url += `${modifier + '/'}`;
  }

  // for our simple use case, parameters will be a string defined by the caller
  if (!!parameters) {
    url += `${'?' + parameters}`;
  }
  return url;
};

export const get_URL_with_QUERY_STRING = (endpoint, modifier) => {
  if (!!modifier) {
    return `${BACKEND_URL}/${endpoint}/?${modifier}`;
  }
  return `${BACKEND_URL}/${endpoint}/`;
};

// API key for Google Custom Search
// const GOOGLE_API_KEY = 'AIzaSyBlhsjmcDLGYbn3tteZzPYyHdEsdJToEL4';
// const GOOGLE_API_KEY = 'AIzaSyAcKr4BT97uFT3vBFnO3nySlNe-2zYCNpw'; // key - royce
// const GOOGLE_API_KEY = 'AIzaSyCh4EYnjNry7li_4xoMg00F3x90jZY9YH0';
const GOOGLE_API_KEY = 'AIzaSyCXwk3TIvu4yY9pACKFtKvDW_IEJk1god4'; // new key
export const API_KEY = GOOGLE_API_KEY;
