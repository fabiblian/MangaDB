import { api, getApiErrorMessage } from "../api/client";
import { clearAuthStorage, getStoredToken, getStoredUser, storeAuthSession } from "../utils/authUtils";

/**
 * Login Funktion
 * Verarbeitet id, username, email und role vom Server
 */
export async function login(usernameOrEmail, password) {
  try {
    const response = await api.post("http://localhost:8081/auth/login", {
      usernameOrEmail,
      password, // Das Passwort wird nur zum Senden benötigt
    });

    // Wir extrahieren die Props des Users aus der Antwort (Response)
    const { id, username, email, role, token, expiresIn } = response.data;

    const user = {
      id: id,
      username: username,
      email: email,
      password: password,
      role:role
    };

    // Speichern der Session (Token und User-Objekt) in den Utils/LocalStorage
    storeAuthSession({
      token: token,
      user: user,
    });

    return {
      token: token,
      user: user,
      expiresIn: expiresIn,
    };
  } catch (error) {
    // Spezielle Behandlung für 404 oder andere API-Fehler via getApiErrorMessage
    const message = error.response?.status === 404 
      ? "Login-Endpunkt wurde nicht gefunden (404)" 
      : getApiErrorMessage(error, "Login fehlgeschlagen");
    throw new Error(message);
  }
}

/**
 * Registrierungs Funktion
 */
export async function register(userData) {
  try {
    // userData enthält hier: username, email, password
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    const message = error.response?.status === 404 
      ? "Registrierungs-Endpunkt wurde nicht gefunden (404)" 
      : getApiErrorMessage(error, "Registrierung fehlgeschlagen");
    throw new Error(message);
  }
}

/**
 * Logout
 */
export function logout() {
  clearAuthStorage();
}

/**
 * Holt den aktuell gespeicherten User (id, username, email, role)
 */
export function getCurrentUser() {
  return getStoredUser();
}

/**
 * Prüft ob Token und User vorhanden sind
 */
export function isAuthenticated() {
  const token = getStoredToken();
  const user = getStoredUser();
  return Boolean(token && user);
}