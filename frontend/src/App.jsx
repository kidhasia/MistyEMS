import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar.jsx';
import Board from './pages/Board.jsx';
import AddCard from './pages/addCard.jsx';
import EditCard from './pages/editCard.jsx';
import Login from './pages/Login.jsx';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="flex">
      {!isLoginPage && <Navbar />}
        <Routes>
          <Route path="/" element={<Board />} />
          <Route path="/add-card" element={<AddCard />} />
          <Route path="/edit-card" element={<EditCard />} />
          <Route path="/login" element={<Login />} />
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