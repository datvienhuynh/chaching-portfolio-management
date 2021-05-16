import HttpClient from './HttpClient';
import { useCallback, useEffect, useState } from 'react';
import { handleError } from './backendRequests';
import { get_URL } from '../configuration/constants';

const HTTPClient = HttpClient();

export const useForums = (initialState, dependencies) => {
  const [forums, setForums] = useState(initialState);

  const fetchForums = useCallback(async () => {
    try {
      const res = await HTTPClient.get(get_URL('forums'));
      setForums(res.data.results);
    } catch (err) {
      handleError(err);
      setForums(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchForums();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchForums, ...dependencies]);

  return [forums, setForums];
};

export const useForum = (initialState, id, dependencies) => {
  const [forum, setForum] = useState(initialState);

  const fetchForum = useCallback(async () => {
    try {
      const res = await HTTPClient.get(get_URL('forums', id));
      setForum(res.data);
    } catch (err) {
      handleError(err);
      setForum(initialState);
    }
  }, [initialState, id]);

  useEffect(() => {
    fetchForum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchForum, ...dependencies]);

  return [forum, setForum, fetchForum];
};
