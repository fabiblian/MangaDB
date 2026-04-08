import { api, getApiErrorMessage } from "../api/client";
import { clearAuthStorage, getStoredToken, getStoredUser, storeAuthSession } from "../utils/authUtils";

export async function login(usernameOrEmail, password) {
  try {
    const response = await api.post("/auth/login", {
      usernameOrEmail,
      password,
    });

    const user = {
      id: response.data.id,
      username: response.data.username,
      email: response.data.email,
      role: response.data.role,
    };

    storeAuthSession({
      token: response.data.token,
      user,
    });

    return {
      token: response.data.token,
      user,
      expiresIn: response.data.expiresIn,
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Login fehlgeschlagen"));
  }
}

export async function register(userData) {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Registrierung fehlgeschlagen"));
  }
}

export function logout() {
  clearAuthStorage();
}

export function getCurrentUser() {
  return getStoredUser();
}

export function isAuthenticated() {
  return Boolean(getStoredToken() && getStoredUser());
}
