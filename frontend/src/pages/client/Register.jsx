import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axios';

const ClientRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const hasNumber = (str) => /\d/.test(str);
  const isValidPhone = (str) => /^\d{10,}$/.test(str);
  const isValidPassword = (str) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(str);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (hasNumber(formData.name)) {
      toast.error('Name cannot contain numbers.');
      setIsLoading(false);
      return;
    }
    if (!isValidPhone(formData.phone)) {
      toast.error('Phone must be 10+ digits and numbers only.');
      setIsLoading(false);
      return;
    }
    if (!isValidPassword(formData.password)) {
      toast.error('Password must be 6+ chars with a letter and number.');
      setIsLoading(false);
      return;
    }

    try {
      await API.post('/auth/client/register', formData);
      toast.success('Registered! Redirecting to login...');
      setTimeout(() => navigate('/client/login'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputs = [
    { id: 'name', type: 'text', label: 'Full Name', placeholder: 'Full name' },
    { id: 'email', type: 'email', label: 'Email', placeholder: 'Email' },
    { id: 'phone', type: 'text', label: 'Phone', placeholder: 'Phone number' },
    { id: 'city', type: 'text', label: 'City', placeholder: 'City' },
    { id: 'password', type: 'password', label: 'Password', placeholder: 'Password' },
  ];

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-br from-purple-600 to-pink-400">
      <div className="w-full max-w-3xl rounded-3xl border border-white/30 bg-white/95 p-8 shadow-2xl backdrop-blur-lg transition duration-500 hover:scale-[1.03]">
        <header className="mb-5 text-center select-none">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Misty <span className="block text-xs tracking-widest">PRODUCTION</span>
          </h1>
        </header>

        <h2 className="mb-4 text-center text-4xl font-extrabold text-gray-90 select-none">Sign Up</h2>
        <p className="mb-8 text-center text-sm text-gray-500 select-none">Create your account</p>

        <form onSubmit={handleRegister} className="space-y-5">
          {inputs.map(({ id, type, label, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                id={id}
                type={type}
                name={id}
                value={formData[id]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                className="w-full rounded-lg border border-gray-300 bg-gray-100 p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ))}
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
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <span
            className="cursor-pointer font-semibold text-purple-600 hover:underline"
            onClick={() => navigate('/client/login')}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default ClientRegister;