import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import { useLoginForm } from './hooks/useAuthForms';
import './Auth.scss';

function Login() {
  const navigate = useNavigate();
  const {
    register,
    errors,
    isSubmitting,
    showPassword,
    togglePasswordVisibility,
    submitError,
    onSubmit,
  } = useLoginForm();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={Logo} alt="Logo" />
        </div>

        <div className="auth-header">
          <h1 className="auth-title"> Admin Panel</h1>
          <p className="auth-subtitle">Sign in to manage your platform</p>
        </div>

        <form className="auth-form" noValidate onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className={`input-wrapper ${errors.email ? 'has-error' : ''}`}>
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                id="email"
                placeholder="admin@example.com"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="field-error" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div
              className={`input-wrapper ${errors.password ? 'has-error' : ''}`}
            >
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                {...register('password')}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="field-error" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-container" htmlFor="rememberMe">
              <input
                type="checkbox"
                id="rememberMe"
                {...register('rememberMe')}
              />
              Remember me
            </label>
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

          {submitError && (
            <div className="auth-submit-error" role="alert">
              {submitError}
            </div>
          )}

          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? 'Signing In...' : 'Sign In'}
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
