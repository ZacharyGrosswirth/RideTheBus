import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.lobbyContainer}>
      <h1>Ride The Bus</h1>
      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={() => navigate("/create")}>
          Create Game
        </button>
        <button style={styles.button} onClick={() => navigate("/join")}>
          Join Game
        </button>
      </div>
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
};
