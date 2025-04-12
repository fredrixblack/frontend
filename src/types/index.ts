export interface User {
    id: number;
    username: string;
    email?: string;
    role: string;
    status?: string;
  }
  
  export interface Tokens {
    access: string;
    refresh: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
    rememberMe: boolean;
  }
  
  export interface Session {
    id: number;
    createdAt: string;
    expiresAt: string;
    ipAddress: string;
    userAgent: string;
    isRememberMe: boolean;
  }
  
  export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string, rememberMe: boolean) => Promise<void>;
    register: (username: string, password: string, email?: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
  }