
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { FaUser, FaEnvelopeOpenText, FaEllipsisV } from "react-icons/fa";

function ClientTask() {
  const navigate = useNavigate();
  const clientId = localStorage.getItem("clientId");

  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "" });
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    async function fetchClient() {
      try {
        const res = await API.get(`/client/get/${clientId}`);
        setFormData(res.data.user);
      } catch (err) {
        console.error("Failed to fetch client info");
      }
    }
    fetchClient();
  }, [clientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!clientId) {
      setError("Client ID missing. Please log in again.");
      return;
    }

    const data = new FormData();
    data.append("clientId", clientId);
    data.append("description", description);
    data.append("deadline", deadline);
    if (attachment) data.append("attachment", attachment);

    try {
      await API.post("/task/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Task submitted successfully!");
      setDescription("");
      setDeadline("");
      setAttachment(null);
    } catch (err) {
      setError(err.response?.data?.error || "Task submission failed.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/client/login");
  };

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logoWrapper}>
          <h1 style={styles.logoTop}>Misty</h1>
          <h2 style={styles.logoBottom}>PRODUCTION</h2>
          <hr style={styles.logoDivider} />
        </div>

        <div style={styles.nav}>
          <div style={styles.navItem} onClick={() => navigate("/client/dashboard")}>
            <FaUser style={styles.icon} />
            <span>Client Profile</span>
          </div>
          <div style={{ ...styles.navItem, backgroundColor: "#ffffff22" }}>
            <FaEnvelopeOpenText style={styles.icon} />
            <span>Send Request</span>
          </div>
        </div>

        <div style={styles.bottom}>
          <div style={styles.userInfo}>
            <p style={styles.clientName}>{formData.name}</p>
            <p style={styles.role}>Client</p>
          </div>
          <div style={styles.menuIcon} onClick={() => setShowMenu(!showMenu)}>
            <FaEllipsisV />
            {showMenu && (
              <div style={styles.menuDropdown}>
                <p onClick={handleLogout}>Logout</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={styles.content}>
        <div style={styles.titleBox}>
          <h2 style={styles.title}>Send Request</h2>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={styles.textarea}
          />
          <label style={styles.label}>Deadline:</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setAttachment(e.target.files[0])}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Submit Task</button>
        </form>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
  },
  sidebar: {
    width: "250px",
    background: "linear-gradient(135deg, #7e22ce, #9333ea)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px",
    position: "relative",
  },
  logoWrapper: {
    textAlign: "center",
    marginBottom: "20px",
  },
  logoTop: {
    fontFamily: "'Pacifico', cursive",
    fontSize: "30px",
    marginBottom: "0",
  },
  logoBottom: {
    letterSpacing: "5px",
    fontSize: "12px",
    marginTop: "-6px",
  },
  logoDivider: {
    borderTop: "1px solid white",
    margin: "12px auto",
    width: "60%",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "80px",
    alignItems: "center",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 20px",
    borderRadius: "8px",
    backgroundColor: "#ffffff11",
    color: "#fff",
    cursor: "pointer",
    width: "100%",
    justifyContent: "flex-start",
  },
  icon: {
    fontSize: "16px",
  },
  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    background: "#ffffff22",
    padding: "10px 15px",
    borderRadius: "10px",
    fontSize: "18px",
    justifyContent: "center",
  },
  clientName: {
    fontSize: "25px",
    fontWeight: "bold",
    color: "#fff",
  },
  role: {
    fontSize: "14px",
    fontStyle: "italic",
    color: "#fff",
    marginTop: "-2px",
  },
  menuIcon: {
    cursor: "pointer",
    position: "relative",
  },
  menuDropdown: {
    position: "absolute",
    bottom: "40px",
    right: "10px",
    backgroundColor: "#fff",
    color: "#000",
    padding: "8px 12px",
    borderRadius: "6px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    zIndex: 2,
  },
  content: {
    flex: 1,
    background: "linear-gradient(135deg, #ec4899, #f472b6)",
    padding: "50px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  titleBox: {
    backgroundColor: "#fbcfe8",
    padding: "15px 40px",
    borderRadius: "12px",
    marginBottom: "30px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "700",
    margin: 0,
    color: "#4c1d95",
  },
  form: {
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  label: {
    textAlign: "left",
    color: "#4b5563",
    fontWeight: "bold",
    marginBottom: "-5px",
    fontSize: "14px",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    fontSize: "16px",
    border: "none",
  },
  textarea: {
    padding: "12px",
    borderRadius: "6px",
    fontSize: "16px",
    border: "none",
    minHeight: "100px",
  },
  button: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
  success: {
    color: "green",
    marginTop: "15px",
  },
  error: {
    color: "red",
    marginTop: "15px",
  },
};

export default ClientTask;
