// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles
import Board from './pages/Board.jsx';
import AddCard from './pages/addCard.jsx';
import EditCard from './pages/editCard.jsx';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Board />} />
        <Route path="/add-card" element={<AddCard />} />
        <Route path="/edit-card" element={<EditCard />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;