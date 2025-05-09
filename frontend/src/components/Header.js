import React from "react";

const Header = () => {
  return (
    <div style={styles.header}>
      <h1 style={styles.title}>Misty <span style={styles.sub}>PRODUCTION</span></h1>
    </div>
  );
};

const styles = {
  header: {
    background: "linear-gradient(90deg, #6a0dad, #9b30ff)", 
    padding: "20px",
    textAlign: "center",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
  },
  title: {
    fontFamily: "'Pacifico', cursive",
    fontSize: "36px",
    margin: 0,
    color: "#fff",
    letterSpacing: "2px",
  },
  sub: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "14px",
    display: "block",
    letterSpacing: "6px",
    marginTop: "5px",
  },
};

export default Header;
