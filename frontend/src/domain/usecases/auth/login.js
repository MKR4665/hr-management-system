import { authApi } from '../../../data/api/authApi';
import { storageKeys } from '../../../shared/constants/storage';

export async function login({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const result = await authApi.login({ email, password });
  if (result?.accessToken) {
    localStorage.setItem(storageKeys.accessToken, result.accessToken);
  }
  if (result?.refreshToken) {
    localStorage.setItem(storageKeys.refreshToken, result.refreshToken);
  }
  return result;
}
