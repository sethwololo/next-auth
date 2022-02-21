import { useRouter } from 'next/router';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { parseCookies, setCookie } from 'nookies'
import { api } from '../services/api';

type User = {
  email: string;
  permissions: string[];
  roles: string[];
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  user: User;
  isAuthenticated: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState({} as User)
  const isAuthenticated = !!user.email;

  const router = useRouter();

  useEffect(() => {
    const {'nextauth.token': token} = parseCookies();

    if (token) {
      api.get('/me').then(response => {
        console.log(response)
      })
    }
  }, []);


  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('/sessions', {
        email, password
      });

      const { token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/'
      });
      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/'
      });

      setUser({
        email,
        permissions,
        roles,
      });

      router.push('/dashboard');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, user }}>
      {children}
    </AuthContext.Provider>
  )
}
