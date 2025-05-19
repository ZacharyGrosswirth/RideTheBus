import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../utils/socketContext";
import { joinRoom, createRoom } from "../utils/helpFunctions"
import { getOrCreateUser, clearUser } from "../utils/session";;

const Lobby = () => {
  const navigate = useNavigate();
  const socket = useSocket();

  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const [name, setName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [passcode, setPasscode] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [password, setPassword] = useState("");

  const openCreate = () => setShowCreate(true);
  const closeCreate = () => setShowCreate(false);
  const openJoin = () => setShowJoin(true);
  const closeJoin = () => setShowJoin(false);

  useEffect(() => {
    const user = getOrCreateUser();
    if (user.roomCode && user.name && user.passcode) {
      joinRoom(socket, {
        name:     user.name,
        roomCode: user.roomCode,
        passcode: user.passcode,
      })
        .then((res) => {
          if (res.roomState?.gameStarted) {
            navigate(`/game/${user.roomCode}`);
          } else {
            navigate(`/waiting/${user.roomCode}`);
          }
        })
        .catch(() => {
          clearUser();
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [socket, navigate]);

  if (loading) {
    return <div>Checking for existing game…</div>;
  }

  const handleCreate = async () => {
    if (!name.trim()) return alert("Enter your name!");

    try {
      const { room } = await createRoom(socket, { name, maxPlayers, passcode });
      navigate(`/waiting/${room}`);
    } catch (err) {
      alert(err.message);
    }
    closeCreate();
  };

  const handleJoin = async () => {
    if (!name.trim()) return alert("Enter your name!");

    try {
      const { room } = await joinRoom(socket, { name, roomCode, passcode });
      navigate(`/waiting/${room}`, { state: { name, passcode } });
    } catch (err) {
      alert(err.message);
    }

    console.log({ name, roomCode, password });
    closeJoin();
  };

  return (
    <div style={styles.lobbyContainer}>
      <h1>Ride The Bus</h1>
      <div style={styles.field}>
        <label>Enter Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={openCreate}>
          Create Game
        </button>
        <button style={styles.button} onClick={openJoin}>
          Join Game
        </button>
      </div>

      {showCreate && (
        <div style={styles.modalOverlay} onClick={closeCreate}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Create Game</h2>
            <div style={styles.field}>
              <label>Max Players:</label>
              <input
                type="number"
                min={2}
                max={12}
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
              />
            </div>
            <div style={styles.field}>
              <label>Passcode:</label>
              <input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
            </div>
            <div style={styles.modalActions}>
              <button style={styles.button} onClick={handleCreate}>
                Submit
              </button>
              <button style={styles.button} onClick={closeCreate}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showJoin && (
        <div style={styles.modalOverlay} onClick={closeJoin}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Join Game</h2>
            <div style={styles.field}>
              <label>Room Code:</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
              />
            </div>
            <div style={styles.field}>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div style={styles.modalActions}>
              <button style={styles.button} onClick={handleJoin}>
                Submit
              </button>
              <button style={styles.button} onClick={closeJoin}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h3
        style={{
          position: "fixed",
          bottom: "1rem",
        }}
      >
        Created By: Zachary Grosswirth
      </h3>
    </div>
  );
};

export default Lobby;

const styles = {
  lobbyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  button: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    border: "none",
    borderRadius: "0.5rem",
    backgroundColor: "#007bff",
    color: "#fff",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    minWidth: "300px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "1rem",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.5rem",
  },
};
