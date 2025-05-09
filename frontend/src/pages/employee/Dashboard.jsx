import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { FaTasks, FaPlus, FaEllipsisV, FaSearch, FaTrash } from "react-icons/fa";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const name = localStorage.getItem("employeeName");
  const role = localStorage.getItem("employeeRole");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/task/all");
      setTasks(res.data);
    } catch (err) {
      setError("Failed to load tasks.");
    }
  };

  const handleDelete = async (taskId, clientId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await API.delete(`/task/delete/${taskId}`, { data: { clientId } });
        setTasks((prev) => prev.filter((task) => task._id !== taskId));
      } catch (err) {
        alert("Failed to delete task.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/employee/login");
  };

  const filteredTasks = tasks.filter((task) =>
    task.taskId?.toString().includes(search.toLowerCase()) ||
    task.clientId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    task.clientId?.email?.toLowerCase().includes(search.toLowerCase()) ||
    task.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.wrapper}>
      <div style={styles.sidebar}>
        <div style={styles.logoWrapper}>
          <h1 style={styles.logoTop}>Misty</h1>
          <h2 style={styles.logoBottom}>PRODUCTION</h2>
          <hr style={styles.logoDivider} />
        </div>

        <div style={styles.nav}>
          <div style={{ ...styles.navItem, backgroundColor: "#ffffff22" }}>
            <FaTasks style={styles.icon} />
            <span>Dashboard</span>
          </div>

          {role === "general_manager" && (
            <div
              style={styles.navItem}
              onClick={() => navigate("/employee/assign-task")}
            >
              <FaPlus style={styles.icon} />
              <span>Assign Task</span>
            </div>
          )}
        </div>

        <div style={styles.bottom}>
          <div style={styles.userInfo}>
            <div>
              <p style={styles.name}>{name}</p>
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
          <h2 style={styles.title}>Submitted Tasks</h2>
        </div>

        <div style={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search by task id, client name, email or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <FaSearch style={styles.searchIcon} />
        </div>

        {error && <p style={styles.error}>{error}</p>}
        {filteredTasks.length === 0 && <p>No matching tasks found.</p>}

        <div style={styles.taskList}>
          {filteredTasks.map((task) => (
            <div key={task._id} style={styles.taskCard}>
              <h4 style={styles.taskId}>Task #{task.taskId}</h4>
              <p><strong>Client:</strong> {task.clientId?.name} ({task.clientId?.email})</p>
              <p><strong>Description:</strong> {task.description}</p>

              {task.summary && (
                <p>
                  <strong>Summary:</strong><br />
                  <span style={{ whiteSpace: "pre-wrap" }}>{task.summary}</span>
                </p>
              )}

              <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>

              {task.attachment && (
                <p>
                  <strong>Attachment:</strong>{" "}
                  <a
                    href={`http://localhost:5021/${task.attachment}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View File
                  </a>
                </p>
              )}

              {role === "general_manager" && (
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(task._id, task.clientId?._id)}
                >
                  <FaTrash style={{ marginRight: "6px" }} /> Delete
                </button>
              )}
            </div>
          ))}
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
  name: {
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
  searchWrapper: {
    position: "relative",
    width: "100%",
    maxWidth: "600px",
    marginBottom: "30px",
  },
  searchInput: {
    padding: "12px 40px 12px 16px",
    fontSize: "16px",
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  searchIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "18px",
    color: "#888",
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
    maxWidth: "800px",
  },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    position: "relative",
  },
  taskId: {
    color: "#7c3aed",
    marginBottom: "10px",
  },
  deleteButton: {
    marginTop: "15px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
  },
  error: {
    color: "red",
    marginTop: "15px",
  },
};

export default EmployeeDashboard;
