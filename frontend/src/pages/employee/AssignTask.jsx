import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { FaTasks, FaUserPlus, FaEllipsisV } from "react-icons/fa";

function AssignTask() {
  const [tasks, setTasks] = useState([]);
  const [pms, setPMs] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedPM, setSelectedPM] = useState("");
  const [instructions, setInstructions] = useState("");
  const [message, setMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const gmId = localStorage.getItem("employeeId");
  const name = localStorage.getItem("employeeName");
  const role = localStorage.getItem("employeeRole");

  useEffect(() => {
    async function fetchData() {
      const taskRes = await API.get("/task/all");
      const pmRes = await API.get("/auth/employee/all-pms");
      setTasks(taskRes.data);
      setPMs(pmRes.data);
    }
    fetchData();
  }, []);

  const handleAssign = async () => {
    try {
      await API.post("/api/gmtopmtask/assign", {
        originalTaskId: selectedTask,
        assignedBy: gmId,
        assignedTo: selectedPM,
        instructions,
      });

      setMessage("Task assigned!");
      setSelectedTask("");
      setSelectedPM("");
      setInstructions("");
    } catch (err) {
      console.error("Assignment error:", err);
      setMessage("Failed to assign: " + (err.response?.data?.error || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/employee/login";
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.sidebar}>
        <div style={styles.logoWrapper}>
          <h1 style={styles.logoTop}>Misty</h1>
          <h2 style={styles.logoBottom}>PRODUCTION</h2>
          <hr style={styles.logoDivider} />
        </div>

        <div style={styles.nav}>
          <div style={styles.navItem} onClick={() => window.location.href = "/employee/dashboard"}>
            <FaTasks style={styles.icon} />
            <span>Tasks</span>
          </div>
          <div style={{ ...styles.navItem, backgroundColor: "#ffffff22" }}>
            <FaUserPlus style={styles.icon} />
            <span>Assign Task</span>
          </div>
        </div>

        <div style={styles.bottom}>
          <div style={styles.userInfo}>
            <div>
              <p style={styles.clientName}>{name}</p>
              <p style={styles.role}>{role?.replace("_", " ")}</p>
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

      <div style={styles.content}>
        <div style={styles.titleBox}>
          <h2 style={styles.title}>Assign Task</h2>
        </div>

        <div style={styles.form}>
          <label>Choose Task:</label>
          <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)} style={styles.input}>
            <option value="">-- Select Task --</option>
            {tasks.map((task) => (
              <option key={task._id} value={task._id}>
                Task #{task.taskId}
              </option>
            ))}
          </select>

          <label>Select Project Manager:</label>
          <select value={selectedPM} onChange={(e) => setSelectedPM(e.target.value)} style={styles.input}>
            <option value="">-- Select PM --</option>
            {pms.map((pm) => (
              <option key={pm._id} value={pm._id}>
                {pm.name} ({pm.email})
              </option>
            ))}
          </select>

          <label>Instructions (optional):</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows="3"
            style={styles.textarea}
          />

          <button onClick={handleAssign} style={styles.button}>Assign Task</button>
          {message && <p>{message}</p>}
        </div>
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
    color: "#fff"
  },
  role: {
    fontSize: "14px",
    fontStyle: "italic",
    color: "#fff",
    marginTop: "-2px"
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
    borderRadius: "6px",
    fontSize: "16px",
    border: "none"
  },
  textarea: {
    padding: "12px",
    borderRadius: "6px",
    fontSize: "16px",
    border: "none",
    minHeight: "80px"
  },
  button: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer"
  }
};

export default AssignTask;
