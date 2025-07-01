export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  user: User;
  sessionToken: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export interface ChangeEmailRequest {
  newEmail: string;
  callbackURL?: string;
}

export interface DeleteUserRequest {
  password: string;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}
