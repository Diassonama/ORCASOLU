export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  email: string;
  fullName: string;
}

export interface UserSession {
  token: string;
  email: string;
  fullName: string;
}
