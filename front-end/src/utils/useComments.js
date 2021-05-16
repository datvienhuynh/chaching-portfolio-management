import HttpClient from './HttpClient';
import { useCallback, useEffect, useState } from 'react';
import { handleError } from './backendRequests';
import { get_URL } from '../configuration/constants';

const HTTPClient = HttpClient();

export const useComments = (initialState, postID, sorting, minDate, maxDate, dependencies) => {
  const [comments, setComments] = useState(initialState);
  const fetchComments = useCallback(async () => {
    try {
      const res = await HTTPClient.get(
        get_URL(
          'comments',
          '',
          `post=${postID}&ordering=${sorting}&createdAt__gte=${minDate.toISOString()}&createdAt__lte=${maxDate.toISOString()}`,
        ),
      );
      setComments(res.data.results);
    } catch (err) {
      handleError(err);
      setComments(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting, minDate, maxDate]);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchComments, ...dependencies]);

  return [comments, setComments, fetchComments];
};

export const expressAttitudeOnComment = async (id, attitude) => {
  try {
    const res = await HTTPClient.post(get_URL('comments', `${id}/express`), {
      attitude: attitude,
    });
    return res.data.results;
  } catch (err) {
    handleError(err);
  }
};

export const addComment = async (body) => {
  try {
    const res = await HTTPClient.post(get_URL('comments'), body);
    return res.data.results;
  } catch (err) {
    handleError(err);
  }
};
