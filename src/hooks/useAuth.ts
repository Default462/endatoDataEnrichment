import { useState, useEffect } from 'react';
import type { AuthState, User } from '../types/auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        loading: false,
      });
    } else {
      setAuthState({ user: null, loading: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Send the email and password to the backend for validation
      const response = await fetch('https://elbtdjxd5a.execute-api.eu-north-1.amazonaws.com/default/getDataFromSQL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "action":"authenticate", user_email:email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      // Assuming the backend returns a user object if credentials are valid
      const user: User = await response.json();
      
      localStorage.setItem('user', JSON.stringify(user));
      setAuthState({ user, loading: false });

      return true; // Login successful
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState({ user: null, loading: false });
      return false; // Login failed
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({ user: null, loading: false });
  };

  return { ...authState, login, logout };
}
