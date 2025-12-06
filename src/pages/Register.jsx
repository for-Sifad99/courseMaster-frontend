import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { registerStudent } from '../utils/api';

const brandPurple = '#5B21D9';
const linkPurple = '#5B21D9';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await registerStudent({ name, email, password });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      
      setSuccess('Account created successfully!');
      
      setTimeout(() => {
        navigate('/dashboard/student');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
        
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Create an Account
          </h2>
          <p className="text-gray-500 text-base">
            Join now to streamline your experience from day one.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{success}</div>
            </div>
          )}
          
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Roger Gerrard"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sellostore@company.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>
          
          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <p className="text-sm text-gray-600">
              Already have an account? 
              <Link to="/login" style={{ color: linkPurple }} className="font-semibold ml-1 hover:text-purple-700 transition duration-150">
                Log In
              </Link>
            </p>
          </div>

          {/* Register Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: brandPurple }} 
              className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white shadow-md hover:bg-opacity-90 transition duration-150 ease-in-out disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;