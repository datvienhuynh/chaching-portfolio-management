import React, { useState, useEffect, createContext } from 'react';
import { LOCAL_STORAGE_MAP } from '../../configuration/constants';

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const token = window.localStorage.getItem(LOCAL_STORAGE_MAP.AUTHORIZATION_TOKEN);
    if (token !== 'undefined') {
      return token;
    } else {
      return undefined;
    }
  });
  const [user, setUser] = useState(() => {
    const user = window.localStorage.getItem(LOCAL_STORAGE_MAP.AUTHORIZATION_USER);
    try {
      return JSON.parse(user);
    } catch {
      return undefined;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_MAP.AUTHORIZATION_TOKEN, String(token));
    window.localStorage.setItem(LOCAL_STORAGE_MAP.AUTHORIZATION_USER, JSON.stringify(user));
  }, [token, user]);

  return (
    <UserContext.Provider
      value={{
        token: token,
        user: user,
        setToken: (newToken) => setToken(newToken),
        setUser: (user) => setUser(user),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
