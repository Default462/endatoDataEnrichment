export interface User {
  id: string;
  email: string;
  password: string; // Note: In production, never store plain passwords
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}