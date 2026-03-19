// src/pages/SignUp.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the terms');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      const response = await axios.post(
        'http://localhost:8080/api/auth/signup',
        payload
      );

      const { token } = response.data;
      login(token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-rose-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements (like WhatsApp style) */}
      <div 
        className="absolute inset-0 z-0"   // very low opacity = subtle
        style={{
          backgroundImage: `url(/assets/pattern_overlay.png)`,  // ← your image
          backgroundRepeat: 'repeat',
          backgroundSize: '400px 400px',   // adjust size to make icons smaller/larger
        }}
      />

      {/* Main Card */}
      <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full border border-pink-100 z-10">
        {/* Character Illustration (replace with your image) */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2">
          <img
            src="/assets/signup_guy.png" // ← replace with your image path
            alt="Illustration"
            className="w-48 h-48 object-contain drop-shadow-2xl animate-float"
          />
        </div>

        <h1 className="text-4xl font-bold text-center text-gray-800 mt-16 mb-2">
          Sign Up
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Create your account and start managing tasks
        </p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name */}
          <div className="relative">
            <input
              type="text"
              name="firstName"
              placeholder="Enter First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50/70 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all placeholder-gray-400"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500 text-xl">👤</span>
          </div>

          {/* Last Name */}
          <div className="relative">
            <input
              type="text"
              name="lastName"
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50/70 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all placeholder-gray-400"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500 text-xl">👤</span>
          </div>

          {/* Username */}
          <div className="relative">
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50/70 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all placeholder-gray-400"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500 text-xl">👤</span>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50/70 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all placeholder-gray-400"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500 text-xl">✉️</span>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-12 py-4 bg-gray-50/70 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all placeholder-gray-400"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500 text-xl">🔒</span>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pink-600"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-12 py-4 bg-gray-50/70 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all placeholder-gray-400"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500 text-xl">🔒</span>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pink-600"
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="h-5 w-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
              I agree to all terms
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 mt-6 rounded-xl font-semibold text-white transition-all ${
              loading
                ? 'bg-pink-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-pink-600 font-medium hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>

      {/* Animation Keyframes */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SignUp;