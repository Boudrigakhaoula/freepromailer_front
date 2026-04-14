export interface AuthResponse {
  token: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserProfileResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}