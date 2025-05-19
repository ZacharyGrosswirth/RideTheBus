import { ref, set, onDisconnect } from "firebase/database";
import { db }                      from "./firebase";
import { getOrCreateUser }         from "./session";

export function setPresence(roomCode, socketId) {
  const { id, name } = getOrCreateUser();
  const userRef      = ref(db, `rooms/${roomCode}/users/${id}`);

  // Mark online
  set(userRef, {
    name,
    socketId,
    connected: true,
    lastActive: Date.now(),
  });

  // When this tab/window unloads, mark offline
  onDisconnect(userRef).update({
    connected: false,
    lastActive: Date.now(),
  });
}
