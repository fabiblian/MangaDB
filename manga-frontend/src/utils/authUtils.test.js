import test from "node:test";
import assert from "node:assert/strict";
import {
  AUTH_TOKEN_KEY,
  USER_DATA_KEY,
  clearAuthStorage,
  getApiErrorMessage,
  getStoredToken,
  getStoredUser,
  storeAuthSession,
} from "./authUtils.js";

function createStorage() {
  const storage = new Map();
  return {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      storage.set(key, String(value));
    },
    removeItem(key) {
      storage.delete(key);
    },
  };
}

test("storeAuthSession saves token and user data", () => {
  global.localStorage = createStorage();

  storeAuthSession({
    token: "abc123",
    user: { id: 1, username: "admin", role: "ADMIN" },
  });

  assert.equal(getStoredToken(), "abc123");
  assert.deepEqual(getStoredUser(), { id: 1, username: "admin", role: "ADMIN" });
  assert.equal(global.localStorage.getItem(AUTH_TOKEN_KEY), "abc123");
  assert.ok(global.localStorage.getItem(USER_DATA_KEY));
});

test("clearAuthStorage removes stored auth data", () => {
  global.localStorage = createStorage();
  storeAuthSession({
    token: "to-delete",
    user: { id: 2, username: "user", role: "USER" },
  });

  clearAuthStorage();

  assert.equal(getStoredToken(), null);
  assert.equal(getStoredUser(), null);
});

test("getApiErrorMessage prefers backend error fields over fallback", () => {
  assert.equal(
    getApiErrorMessage({ response: { data: { error: "Nicht authentifiziert" } } }, "Fallback"),
    "Nicht authentifiziert"
  );
  assert.equal(
    getApiErrorMessage({ response: { data: { message: "Ungueltige Daten" } } }, "Fallback"),
    "Ungueltige Daten"
  );
  assert.equal(getApiErrorMessage({}, "Fallback"), "Fallback");
});
