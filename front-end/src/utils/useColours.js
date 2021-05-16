import HttpClient from './HttpClient';
import { useCallback, useEffect, useState } from 'react';
import { get_URL } from '../configuration/constants';
import { handleError } from './backendRequests';

const HTTPClient = HttpClient();

/** Get available colours for selection */
export const useColours = (initialState, dependencies) => {
  const [colour, setColours] = useState(initialState);

  const fetchColours = useCallback(async () => {
    try {
      const res = await HTTPClient.get(get_URL('colours'));
      if (res.data.results.length > 0) {
        setColours(
          res.data.results.map((color) => {
            // populate data for the select element
            return {
              value: color.id,
              label: color.name,
            };
          }),
        );
      }
    } catch (err) {
      handleError(err);
      setColours(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchColours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchColours, ...dependencies]);

  return [colour, setColours];
};
