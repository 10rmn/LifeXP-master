import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/auth';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(formData.username, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="auth-container">
        <div className="auth-card">
          {/* Logo/Header */}
          <div className="text-center mb-10">
            <div className="text-7xl mb-6 glow">🚀</div>
            <h1 className="text-4xl font-bold text-gradient mb-3">
              Join LifeXP
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-4"></div>
            <p className="text-black text-lg">
              Transform your life, one habit at a time
            </p>
          </div>
          
          {error && (
            <div className="error-message mb-6">
              ⚠️ {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="form-group">
              <label className="form-label">
                👤 Username
              </label>
              <input
                type="text"
                name="username"
                className="form-input"
                placeholder="Choose your unique username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                📧 Email Address
              </label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                🔒 Password
              </label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full shadow-soft-hover"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="spinner"></div>
                  Creating Your Account...
                </span>
              ) : (
                '🎉 Start Your Journey'
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-black">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-gradient font-semibold hover:underline transition-colors"
              >
                Sign In Here
              </Link>
            </p>
          </div>

          {/* Features */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="space-y-3 group">
                <div className="text-3xl group-hover:scale-110 transition-transform">🎯</div>
                <p className="text-sm text-black font-medium">Track Habits</p>
                <p className="text-xs text-gray-600">Build consistent routines</p>
              </div>
              <div className="space-y-3 group">
                <div className="text-3xl group-hover:scale-110 transition-transform">⭐</div>
                <p className="text-sm text-black font-medium">Earn XP</p>
                <p className="text-xs text-gray-600">Level up your life</p>
              </div>
              <div className="space-y-3 group">
                <div className="text-3xl group-hover:scale-110 transition-transform">🔥</div>
                <p className="text-sm text-black font-medium">Build Streaks</p>
                <p className="text-xs text-gray-600">Stay motivated daily</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
