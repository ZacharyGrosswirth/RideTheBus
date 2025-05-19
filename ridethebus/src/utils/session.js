import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "rtc_user";

export function getOrCreateUser() {
  let user = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!user) {
    user = { id: uuidv4(), name: "", roomCode: "", passcode: "" };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
  return user;
}

export function saveUser({ id, name, roomCode, passcode }) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ id, name, roomCode, passcode })
  );
}

export function clearUser() {
  localStorage.removeItem(STORAGE_KEY);
}
