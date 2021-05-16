import HttpClient from './HttpClient';
import { useCallback, useEffect, useState } from 'react';
import { handleError } from './backendRequests';
import { get_URL } from '../configuration/constants';

const HTTPClient = HttpClient();

export const useUsers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await HTTPClient.get(get_URL('users', 'search'));
      setUsers(res.data);
      setError(false);
      setLoading(false);
    } catch (err) {
      setError(true);
      handleError(err);
    }
    //  setLoading(false)
  }, []);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { users, loading, error };
};
