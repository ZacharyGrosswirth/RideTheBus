import { getOrCreateUser, saveUser } from "./session";
import { setPresence } from "./firebasePresence";

export function joinRoom(socket, { name, roomCode, passcode }) {
  if (typeof name !== "string" || typeof passcode !== "string") {
    return Promise.reject(new Error("Name and passcode must both be strings"));
  }

  const user = getOrCreateUser();
  user.name     = name.trim();
  user.roomCode = roomCode.trim().toUpperCase();
  user.passcode = passcode.trim().toUpperCase();
  saveUser(user);

  return new Promise((resolve, reject) => {
    socket.emit(
      "joinRoom",
      {
        userId:   user.id,
        name:     user.name,
        roomCode: user.roomCode,
        password: user.passcode,    // ← send under `password`
      },
      (res) => {
        if (res.ok || res.status === "ok") {
          setPresence(user.roomCode, socket.id);
          resolve(res);
        } else {
          reject(new Error(res.message || "Join failed"));
        }
      }
    );
  });
}

export function createRoom(socket, { name, maxPlayers, passcode }) {
  // 1) Validate inputs
  if (typeof name !== "string" || typeof passcode !== "string") {
    return Promise.reject(new Error("Name and passcode must both be strings"));
  }

  // 2) Persist to session
  const user = getOrCreateUser();
  user.name     = name.trim();
  user.passcode = passcode.trim().toUpperCase();
  saveUser(user);

  // 3) Speak to the server
  return new Promise((resolve, reject) => {
    socket.emit(
      "createRoom",
      {
        userId:     user.id,
        name:       user.name,
        maxPlayers: Number(maxPlayers),
        password:   user.passcode,   // ← send under `password`
      },
      (res) => {
        if (res.status === "ok") {
          // 4) Store the room code & mark presence
          user.roomCode = res.room;
          saveUser(user);
          setPresence(res.room, socket.id);

          resolve(res);
        } else {
          reject(new Error(res.message || "Create room failed"));
        }
      }
    );
  });
}

