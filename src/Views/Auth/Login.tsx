import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import './Auth.scss';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={Logo} alt="Logo" />
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Admin Panel</h1>
          <p className="auth-subtitle">Sign in to manage your platform</p>
        </div>

        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            navigate('/dashboard');
          }}
        >
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                id="email"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-container">Remember me</label>
            <input type="checkbox" />
            <a
              href="/forgot-password"
              title="Forgot Password Page"
              className="forgot-password-link"
              onClick={(e) => {
                e.preventDefault();
                navigate('/forgot-password');
              }}
            >
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>

        <p className="auth-footer">
          © 2024 Vision PME (Gala Management System). All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;
