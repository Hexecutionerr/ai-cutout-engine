import { createContext, useContext, type ReactNode } from "react";

// AUTH TEMPORARILY DISABLED — returns a mock authenticated user
const MOCK_USER = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "guest@cutly.ai",
  user_metadata: { full_name: "Guest User" },
  app_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString(),
} as any;

interface AuthCtx {
  user: any;
  session: any;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const noop = async () => ({ error: null });

const value: AuthCtx = {
  user: MOCK_USER,
  session: { user: MOCK_USER, access_token: "mock", refresh_token: "mock", expires_in: 3600, token_type: "bearer" },
  loading: false,
  isAdmin: true,
  signIn: noop,
  signUp: noop,
  signInWithGoogle: async () => {},
  resetPassword: noop,
  updatePassword: noop,
  signOut: async () => {},
};

const AuthContext = createContext<AuthCtx>(value);

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
