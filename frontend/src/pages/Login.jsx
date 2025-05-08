import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://your-backend-url.com'; // Use environment variable

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Role-to-route mapping
  const roleRoutes = {
    editor: '/', // Goes to Board.jsx
    quality_control: '/quality-control-dashboard',
    project_manager: '/project-manager-dashboard',
    general_manager: '/general-manager-dashboard',
    admin: '/admin-dashboard',
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const { token, role } = await response.json();
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', role); // Store role for future use

      // Redirect based on role
      const redirectPath = roleRoutes[role] || '/'; // Fallback to home if role not found
      navigate(redirectPath);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen px-4">
      <div className="bg-white/95 p-12 rounded-3xl shadow-2xl w-full max-w-xl backdrop-blur-lg border border-white/30 transform transition duration-500 hover:scale-[1.03]">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6 text-center tracking-tight">Welcome Back</h2>
        <p className="text-lg text-gray-500 mb-10 text-center">Log in to manage your Kanban board</p>
        <div className="space-y-8">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-4 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-4 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 rounded-lg font-semibold text-lg transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-purple-400 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 inline-block text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;