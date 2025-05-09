import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { FaUser, FaEnvelopeOpenText, FaEllipsisV } from "react-icons/fa";

function ClientDashboard() {
  const navigate = useNavigate();
  const clientId = localStorage.getItem("clientId");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    async function fetchClient() {
      try {
        const res = await API.get(`/client/get/${clientId}`);
        setFormData(res.data.user);
      } catch (err) {
        setError("Failed to load client data.");
      }
    }
    fetchClient();
  }, [clientId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await API.put(`/client/update/${clientId}`, formData);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile.");
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
          <div style={{ ...styles.navItem, backgroundColor: "#ffffff22" }}>
            <FaUser style={styles.icon} />
            <span>Client Profile</span>
          </div>
          <div style={styles.navItem} onClick={() => navigate("/client/request")}>
            <FaEnvelopeOpenText style={styles.icon} />
            <span>Send Request</span>
          </div>
        </div>

        <div style={styles.bottom}>
          <div style={styles.userInfo}>
            <div style={styles.nameColumn}>
              <p style={styles.clientName}>{formData.name}</p>
              <p style={styles.role}>Client</p>
            </div>
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

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.titleBox}>
          <h2 style={styles.title}>Client Profile</h2>
        </div>

        <form onSubmit={handleUpdate} style={styles.form}>
          <input name="name" value={formData.name} onChange={handleChange} required placeholder="Name" style={styles.input} />
          <input name="email" value={formData.email} onChange={handleChange} required placeholder="Email" style={styles.input} />
          <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone" style={styles.input} />
          <input name="city" value={formData.city} onChange={handleChange} required placeholder="City" style={styles.input} />
          <button type="submit" style={styles.button}>Save Changes</button>
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
    marginBottom: "20px"
  },
  logoTop: {
    fontFamily: "'Pacifico', cursive",
    fontSize: "30px",
    marginBottom: "0",
  },
  logoBottom: {
    letterSpacing: "5px",
    fontSize: "12px",
    marginTop: "-6px"
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
    alignItems: "center"
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
    alignItems: "flex-end",
  },
  userInfo: {
    display: "flex",
    flexDirection: "row",
    background: "#ffffff22",
    padding: "10px",
    borderRadius: "10px",
    fontSize: "18px",
    alignItems: "center"
  },
  nameColumn: {
    display: "flex",
    flexDirection: "column"
  },
  clientName: {
    fontSize: "25px",
    fontWeight: "bold",
    margin: 0
  },
  role: {
    fontSize: "14px",
    fontStyle: "italic",
    margin: 0
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
    gap: "12px"
  },
  input: {
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px"
  },
  button: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px"
  },
  success: {
    color: "green",
    marginTop: "10px"
  },
  error: {
    color: "red",
    marginTop: "10px"
  }
};

export default ClientDashboard;
