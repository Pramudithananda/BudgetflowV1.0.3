import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from AsyncStorage
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      // For local authentication, we'll use a simple validation
      // In production, you might want to store hashed passwords in SQLite
      
      // For demo purposes, accept any email/password combination
      // You can implement proper authentication logic here
      const userData = {
        email,
        uid: Date.now().toString(), // Generate a unique ID
        displayName: email.split('@')[0]
      };
      
      // Store user in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      throw new Error('Sign in failed');
    }
  };

  const signUp = async (email, password) => {
    try {
      // For local signup, create a new user
      const userData = {
        email,
        uid: Date.now().toString(),
        displayName: email.split('@')[0]
      };
      
      // Store user in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      throw new Error('Sign up failed');
    }
  };

  const logOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      throw new Error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);