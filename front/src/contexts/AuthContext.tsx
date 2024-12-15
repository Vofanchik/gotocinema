import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { setCookie, getCookie, deleteCookie } from '../module/cookies';
import axios from 'axios';


interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(getCookie('token'));

  useEffect(() => {
    if (token) {
      const expirationTime = getExpirationTime(token);
      const currentTime = Date.now();

      if (expirationTime <= currentTime) {
        logout();
      } else {
        const timeoutId = setTimeout(() => {
          logout();
        }, expirationTime - currentTime);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (token) {
        refreshToken();
      }
    }, 15 * 60 * 1000); 

    return () => clearInterval(interval);
  }, [token]);


  const setToken = (newToken: string | null) => {
    if (newToken) {
      setCookie('token', newToken, 7); 
    } else {
      deleteCookie('token');
    }
    setTokenState(newToken);
  };


  const refreshToken = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh-token`, { token });
      setToken(response.data.token);
    } catch (error) {
      console.error('Ошибка при обновлении токена:', error);
      logout();
    }
  };


  const logout = () => {
    deleteCookie('token');
    setTokenState(null);
  };


  const getExpirationTime = (token: string): number => {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    return payload.exp * 1000;
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
