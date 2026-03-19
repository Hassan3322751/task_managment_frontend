// src/views/login/index.jsx (or wherever your Login is)
import { useState, useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter your email and password');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      };
      const data = await loginUser(payload);

      login(data.token); 
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* WhatsApp-style subtle icon overlay pattern */}
      <div className="absolute inset-0 z-0" 
        style={{
          backgroundImage: `url(/assets/pattern_overlay.png)`, // ← your overlay PNG path
          backgroundRepeat: 'repeat',
          backgroundSize: '400px 400px', // adjust size of pattern icons
        }}
      />

      {/* Main Login Card */}
      <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-10 w-full max-w-lg border border-pink-100/50 z-10">
        {/* Floating Character Illustration (same as Sign Up) */}
        <div className="absolute -top-28 left-1/2 -translate-x-1/2">
          <img
            src="/assets/signup_guy.png" // ← same image as Sign Up
            alt="Login illustration"
            className="w-52 h-52 md:w-64 md:h-64 object-contain drop-shadow-2xl animate-float"
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mt-20 md:mt-24 mb-2">
          Sign In
        </h1>
        <p className="text-center text-gray-600 mb-8 text-lg">
          Welcome back! Log in to manage your tasks
        </p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-14 pr-5 py-4 bg-white/60 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all placeholder-gray-500 text-gray-800 shadow-sm"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-500 text-2xl">✉️</span>
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
              className="w-full pl-14 pr-14 py-4 bg-white/60 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all placeholder-gray-500 text-gray-800 shadow-sm"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-500 text-2xl">🔒</span>
            <button
              type="button"
              onClick={handleClickShowPassword}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pink-600 text-xl"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 mt-6 rounded-2xl font-bold text-white text-lg transition-all transform hover:scale-[1.02] ${
              loading
                ? 'bg-pink-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-8">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-pink-600 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>

      {/* Float animation for illustration */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        .animate-float {
          animation: float 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;