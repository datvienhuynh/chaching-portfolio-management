import HttpClient from './HttpClient';
import { handleError } from './backendRequests';
import { BACKEND_URL } from '../api/backendRequests';

const HTTPClient = HttpClient();

export const subscribeToStock = async (id, isSubscribed, token) => {
  try {
    const res = await HTTPClient.post(`${BACKEND_URL}/subscribeToEmail`, {
      stockId: id,
      isSubscribed,
    });

    return res.data.results;
  } catch (err) {
    handleError(err);
  }
};

export const checkSubscribedForSingleStock = async (id, setIsSubscribed, setLoading) => {
  try {
    const res = await HTTPClient.post(`${BACKEND_URL}/checkSubscribedForSingleStock`, {
      stockId: id,
    });
    setIsSubscribed(res.data);
  } catch (err) {
    handleError(err);
  }
  setLoading(false);
};

export const unSubscribeFromAllStock = async () => {
  try {
    const res = await HTTPClient.post(`${BACKEND_URL}/unSubscribeFromAllStock`);
  } catch (err) {
    handleError(err);
  }
};

export const getSubscribedStock = async (setLoading, setSubscriptionCount) => {
  try {
    const res = await HTTPClient.get(`${BACKEND_URL}/getSubscribedStock`);

    setSubscriptionCount(res.data);
  } catch (err) {
    console.error('Error', err);
    handleError(err);
  }
  setLoading(false);
};
