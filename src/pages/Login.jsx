import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye,  FaEyeSlash } from "react-icons/fa";
import { loginUser, loginAdmin } from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const brandPurple = '#5B21D9';
  const linkPurple = '#5B21D9';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = isAdmin
        ? await loginAdmin({ email, password })
        : await loginUser({ email, password });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

      if (response.data.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/student');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-2xl">

        <div className="mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-500 text-base">
            Enter to get unlimited access to data & information.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your mail address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? < FaEyeSlash size={20} /> : < FaEye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
                    <div className="flex items-center justify-end">
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Admin Login
            </label>
          </div>

              <div className="flex justify-center pt-2">
            <p className="text-sm text-gray-600">
              Don't have an account?
              <Link to="/register" style={{ color: linkPurple }} className="font-semibold ml-1 hover:text-purple-700 transition duration-150">
                Register
              </Link>
            </p>
          </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: brandPurple }}
            className="w-full flex justify-center py-3 px-4 text-lg font-semibold rounded-lg text-white shadow-md hover:bg-opacity-90 disabled:opacity-50"
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
