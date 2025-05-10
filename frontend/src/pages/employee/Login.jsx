import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axios';

const EmployeeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const res = await API.post('/api/users/login', { email, password });
    const { user, token } = res.data;

    // Store user data in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userRole', user.role);

    // Redirect based on role
    switch (user.role) {
      case 'project_manager':
        // Blank as per request (no action)
        break;
      case 'editor':
        navigate('/');
        break;
      case 'quality_check':
        navigate('/dashboard');
        break;
      case 'general_manager':
        navigate('/employee/dashboard');
        break;
      case 'admin':
        // Blank as per request (no action)
        break;
      default:
        // Optional: Handle unexpected roles
        toast.error('Unknown user role');
        break;
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Login failed');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-br from-purple-600 to-pink-400 px-4">
      <div className="w-full max-w-3xl rounded-3xl border border-white/30 bg-white/95 p-8 shadow-2xl backdrop-blur-lg transition duration-500 hover:scale-[1.03]">
        <header className="mb-5 text-center select-none">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Misty <span className="block text-xs tracking-widest">PRODUCTION</span>
          </h1>
        </header>

        <h2 className="mb-4 text-center text-4xl font-extrabold text-gray-900 select-none">Employee Login</h2>
        <p className="mb-8 text-center text-sm text-gray-500 select-none">Enter your credentials</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700 select-none">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full rounded-lg border border-gray-300 bg-gray-100 p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 select-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700 select-none">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full rounded-lg border border-gray-300 bg-gray-100 p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 p-3 text-sm text-white transition duration-300 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-purple-400 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading && (
              <svg
                className="mr-2 h-4 w-4 animate-spin text-white"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {isLoading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          <span
            className="cursor-pointer font-semibold text-purple-600 hover:underline"
            onClick={() => navigate('/client/login')}
          >
            Go to Client Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default EmployeeLogin;