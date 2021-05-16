import HttpClient from './HttpClient';
import { useCallback, useEffect, useState } from 'react';
import { get_URL } from '../configuration/constants';
import { handleError } from './backendRequests';

const HTTPClient = HttpClient();

export const useGoals = (initialState, dependencies) => {
  const [goal, setGoals] = useState(initialState);

  const fetchGoals = useCallback(async () => {
    try {
      const res = await HTTPClient.get(get_URL('goals', 'mine'));
      setGoals(res.data.results);
    } catch (err) {
      handleError(err);
      setGoals(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchGoals, ...dependencies]);

  return [goal, setGoals];
};

export const add_goal = async (body) => {
  try {
    const res = await HTTPClient.post(get_URL('goals'), body);
    return res.data.results;
  } catch (err) {
    handleError(err);
  }
};

export const edit_goal = async (id, body) => {
  try {
    const res = await HTTPClient.put(get_URL('goals', id), body);
    return res.data.results;
  } catch (err) {
    handleError(err);
  }
};

export const delete_goal = async (id) => {
  try {
    const res = await HTTPClient.delete(get_URL('goals', id));
    return res.data.results;
  } catch (err) {
    handleError(err);
  }
};
