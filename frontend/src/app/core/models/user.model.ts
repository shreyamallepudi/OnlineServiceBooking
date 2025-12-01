export interface User {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  role?: 'CUSTOMER' | 'PROVIDER';
}


