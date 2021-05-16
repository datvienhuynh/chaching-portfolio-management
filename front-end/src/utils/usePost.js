import HttpClient from './HttpClient';
import { useCallback, useEffect, useState } from 'react';
import { handleError } from './backendRequests';
import { get_URL } from '../configuration/constants';

const HTTPClient = HttpClient();

export const usePosts = (initialState, forumID, query, sorting, minDate, maxDate, dependencies) => {
  const [posts, setPosts] = useState(initialState);
  const fetchPosts = useCallback(async () => {
    try {
      const res = await HTTPClient.get(
        get_URL(
          'posts',
          '',
          `forum=${forumID}&search=${query}&ordering=${sorting}&createdAt__gte=${minDate.toISOString()}&createdAt__lte=${maxDate.toISOString()}`,
        ),
      );
      setPosts(res.data.results);
    } catch (err) {
      handleError(err);
      setPosts(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sorting, minDate, maxDate]);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPosts, ...dependencies]);

  return [posts, setPosts];
};

export const usePost = (initialState, id, dependencies) => {
  const [post, setPost] = useState(initialState);

  const fetchPost = useCallback(async () => {
    try {
      const res = await HTTPClient.get(get_URL('posts', id));
      setPost(res.data);
    } catch (err) {
      handleError(err);
      setPost(initialState);
    }
  }, [initialState, id]);

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPost, ...dependencies]);

  return [post, setPost, fetchPost];
};

export const expressAttitudeOnPost = async (id, attitude) => {
  try {
    const res = await HTTPClient.post(get_URL('posts', `${id}/express`), {
      attitude: attitude,
    });
    return res.data.results;
  } catch (err) {
    handleError(err);
  }
};

export const addPost = async (body) => {
  try {
    const res = await HTTPClient.post(get_URL('posts'), body);
    return res.data.results;
  } catch (err) {
    handleError(err);
  }
};
