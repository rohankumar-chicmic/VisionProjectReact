/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/label-has-associated-control, jsx-a11y/no-static-element-interactions, react/jsx-props-no-spreading */
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
    watch,
    setValue,
  } = useLoginForm();

  const selectedRole = watch('role');

  return (
    <div className="auth-container">
      <div className="auth-card wide">
        <div className="auth-logo">
          <img src={Logo} alt="Logo" />
        </div>

        <div className="auth-header">
          <h1 className="auth-title"> Admin Panel</h1>
          <p className="auth-subtitle">Sign in to manage your platform</p>
        </div>

        <div className="role-selection-wrapper">
          <div className="role-button-group">
            <button
              type="button"
              className={`role-btn ${selectedRole === 'organiser' ? 'active' : ''}`}
              onClick={() => setValue('role', 'organiser')}
            >
              Organiser
            </button>
            <button
              type="button"
              className={`role-btn ${selectedRole === 'admin' ? 'active' : ''}`}
              onClick={() => setValue('role', 'admin')}
            >
              Admin
            </button>
            <button
              type="button"
              className={`role-btn ${selectedRole === 'jury' ? 'active' : ''}`}
              onClick={() => setValue('role', 'jury')}
            >
              Jury Member
            </button>
          </div>
        </div>

        <form className="auth-form" noValidate onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className={`input-wrapper ${errors.email ? 'has-error' : ''}`}>
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
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
              Forgot password?
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

        <div className="create-account-footer">
          New here?{' '}
          <span
            className="create-link"
            onClick={() => navigate('/create-organiser')}
          >
            Create your Organiser account
          </span>
        </div>

        <p className="auth-footer">
          © 2024 Vision PME (Gala Management System). All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;
