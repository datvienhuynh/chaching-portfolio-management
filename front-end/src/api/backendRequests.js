import axios from 'axios';
import { API_KEY } from '../configuration/constants';

const STOCK = 'stocks/';
export const BACKEND_URL = 'http://localhost:8000/api/v1';
export const SEARCH_STOCK_URL = `${BACKEND_URL}/stocks/?search=`;
export const PORTFOLIO_URL = `${BACKEND_URL}/portfolios/`;
export const HOLDING_URL = `${BACKEND_URL}/holdings/`;
export const TRANSACTION_URL = `${BACKEND_URL}/transactions/`;
export const MARKET_URL = `${BACKEND_URL}/market/`;
export const MARKET_INFO_URL = `${BACKEND_URL}/marketinfo/`;
export const YF_OVERVIEW = 'yfoverview';
export const YF_DAILY = 'yfdaily';
export const YF_WEEKLY = 'yfweekly';
export const YF_QUOTE = 'yfquote';
export const YF_NEWS = 'yfnews';
export const PREDICTION = 'prediction';

const handleNonResponseErrors = (err) => {
  if (err.request) {
    console.error(err.request);
    throw new Error('Did not receive response from server');
  } else {
    console.error('Error', err.message);
    throw new Error('Something went wrong');
  }
};

// Authentication
const LOGIN = `${BACKEND_URL}/auth/login/`;
export const login = async (email, password) => {
  try {
    const res = await axios.post(LOGIN, {
      username: email,
      password: password,
    });
    return res.data.key;
  } catch (err) {
    if (err.response) {
      console.error(err.response);
      if (err.response.data.non_field_errors) {
        throw new Error(err.response.data.non_field_errors[0]);
      } else if (err.response.data.detail) {
        throw new Error(err.response.data.detail);
      }
    } else {
      handleNonResponseErrors(err);
    }
  }
};

const SIGNUP = `${BACKEND_URL}/auth/signup`;
export const signup = async (email, password, confirmPassword) => {
  try {
    const res = await axios.post(SIGNUP, {
      username: email,
      password1: password,
      password2: confirmPassword,
    });
    return res.data.key;
  } catch (err) {
    if (err.response) {
      console.error(err.response);
      if (err.response.data.non_field_errors) {
        throw new Error(err.response.data.non_field_errors[0]);
      } else if (err.response.data.detail) {
        throw new Error(err.response.data.detail);
      } else if (err.response.data.username) {
        throw new Error(err.response.data.username);
      }
    } else {
      handleNonResponseErrors(err);
    }
  }
};

// Portfolios
export const MY_PORTFOLIO_URL = `${PORTFOLIO_URL}mine/`;
export const getUserPortfolios = async (token) => {
  try {
    const res = await axios.get(MY_PORTFOLIO_URL, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    handleNonResponseErrors(err);
  }
};

export const getStock = async (setter, id) => {
  try {
    const { data } = await axios.get(`${BACKEND_URL}/${STOCK}${id}/`);
    setter(data);
  } catch (err) {
    console.error('err', err);
  }
};

export const getStockData = async (id, dataType) => {
  try {
    const { data } = await axios.get(`${BACKEND_URL}/${dataType}/${id}`);
    return data;
  } catch (err) {
    console.error('err', err);
  }
};

export const getHoldingData = async (id) => {
  try {
    const { data } = await axios.get(`${BACKEND_URL}/holdingdata/${id}`);
    return data;
  } catch (err) {
    console.error('err', err);
  }
};

export const getAllStockData = async () => {
  try {
    const { data } = await axios.get(`${BACKEND_URL}/${STOCK}?limit=200`);
    return data['results'];
  } catch (err) {
    console.error('err', err);
  }
};

export const getMarketData = async () => {
  try {
    const { data } = await axios.get(MARKET_URL);
    return data;
  } catch (err) {
    console.error('err', err);
  }
};

export const getMarketInfo = async () => {
  try {
    const { data } = await axios.get(MARKET_INFO_URL);
    return data;
  } catch (err) {
    console.error('err', err);
  }
};

export const makePrediction = async (id) => {
  try {
    const { data } = await axios.get(`${BACKEND_URL}/${PREDICTION}/${id}`);
    return data;
  } catch (err) {
    console.error('err', err);
  }
};

export const addStockToPortfolio = async (token, stock_id, portfolio_id, quantity, date) => {
  try {
    // Check if holding already in the target portfolio for the stock
    const resHolding = await axios.get(
      `${HOLDING_URL}?stock=${stock_id}&portfolio=${portfolio_id}`,
    );
    let holding = null;
    if (resHolding.data?.results?.length) {
      holding = resHolding.data.results[0];
    }
    if (!holding) {
      // If holding does not exists create one
      const resHoldingCreate = await axios.post(
        HOLDING_URL,
        {
          stock: stock_id,
          portfolio: portfolio_id,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      holding = resHoldingCreate.data;
    }
    // Add transaction to holding
    const resTransaction = await axios.post(
      TRANSACTION_URL,
      {
        quantity: quantity,
        date: date,
        holding: holding.id,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );
    return { holding: holding, transaction: resTransaction.data };
  } catch (err) {
    if (err.response) {
      console.error(err.response);
    } else {
      handleNonResponseErrors(err);
    }
  }
};

// Goals
const GOALS = `${BACKEND_URL}/goals/`;
export const getGoals = async (token) => {
  try {
    const res = await axios.get(`${GOALS}mine`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    if (err.response) {
      console.error(err.reponse);
    } else {
      handleNonResponseErrors(err);
    }
  }
};

export const goalEdit = async (token, id, payload) => {
  try {
    const res = await axios.put(`${GOALS}${id}/`, payload, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return res.data.results;
  } catch (err) {
    if (err.response) {
      console.error(err.reponse);
    } else {
      handleNonResponseErrors(err);
    }
  }
};

export const goalAdd = async (token, payload) => {
  try {
    const res = await axios.post(GOALS, payload, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return res.data.results;
  } catch (err) {
    if (err.response) {
      console.error(err.reponse);
    } else {
      handleNonResponseErrors(err);
    }
  }
};

export const goalDelete = async (token, id) => {
  try {
    const res = await axios.delete(`${GOALS}${id}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return res.data.results;
  } catch (err) {
    if (err.response) {
      console.error(err.reponse);
    } else {
      handleNonResponseErrors(err);
    }
  }
};

// Colours
const COLORS = `${BACKEND_URL}/colours`;
export const getColors = async () => {
  try {
    const res = await axios.get(COLORS);
    return res.data.results;
  } catch (err) {
    if (err.response) {
      console.error(err.reponse);
    } else {
      handleNonResponseErrors(err);
    }
  }
};

// Fetch searched stock results from backend and update given state
export const getSearchStocks = async (input) => {
  try {
    const res = await axios.get(`${SEARCH_STOCK_URL}${input}`);
    return res.data.results;
  } catch (err) {
    handleNonResponseErrors(err);
  }
};

// Return the url to the first results of Google Image Search
export const getGoogleImage = async (query, noImg = 1, size = 'large') => {
  const cx = '0bb9231f2a3774eb0';
  const num = '&num=' + String(noImg);
  const start = '&start=1';
  const searchType = '&searchType=image';
  const imgSize = '&imgSize=' + size;
  const base_url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${cx}&q=${query}${num}${start}${searchType}${imgSize}`;

  // Get search results
  const { data } = await axios.get(base_url);
  // Get all links from the response
  const paths = [];
  for (let i = 0; i < data.items.length; i++) {
    paths.push(data.items[i].link);
  }
  // Return the list of image paths
  return paths;
};
