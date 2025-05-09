import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar.jsx';
import Board from './pages/Board.jsx';
import AddCard from './pages/addCard.jsx';
import EditCard from './pages/editCard.jsx';
import ClientLogin from './pages/client/Login.jsx';
import ClientRegister from './pages/client/Register.jsx';
import ClientDashboard from './pages/client/Dashboard.jsx';
import ClientTask from './pages/client/Task.jsx';
import ForgotPassword from './pages/client/ForgotPassword.jsx';
import VerifyCode from './pages/client/VerifyCode.jsx';
import ResetPassword from './pages/client/ResetPassword.jsx';
import EmployeeLogin from './pages/employee/Login.jsx';
import EmployeeDashboard from './pages/employee/Dashboard.jsx';
import AssignTask from './pages/employee/AssignTask.jsx';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const location = useLocation();
  // Define routes where Navbar should NOT be shown
  const noNavbarRoutes = [
    '/login',
    '/client/login',
    '/client/register',
    '/employee/login',
    '/client/forgot-password',
    '/client/verify-code',
    '/client/reset-password',
  ];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <div className="flex">
      {showNavbar && <Navbar />}
      <Routes>
        {/* Existing routes */}
        <Route path="/" element={<Board />} />
        <Route path="/add-card" element={<AddCard />} />
        <Route path="/edit-card" element={<EditCard />} />

        {/* Client routes */}
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/client/register" element={<ClientRegister />} />
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/client/request" element={<ClientTask />} />
        <Route path="/client/forgot-password" element={<ForgotPassword />} />
        <Route path="/client/verify-code" element={<VerifyCode />} />
        <Route path="/client/reset-password" element={<ResetPassword />} />

        {/* Employee routes */}
        <Route path="/employee/login" element={<EmployeeLogin />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/assign-task" element={<AssignTask />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/client/login" />} />
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