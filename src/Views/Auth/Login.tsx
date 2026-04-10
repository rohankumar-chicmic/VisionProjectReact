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
          <h1 className="auth-title">
            {selectedRole === 'admin' && 'Admin Panel'}
            {selectedRole === 'organiser' && 'Organiser Panel'}
            {selectedRole === 'jury' && 'Jury Panel'}
          </h1>
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
            <label htmlFor="email">
              <span className="label-text">Email Address</span>
              <div
                className={`input-wrapper ${errors.email ? 'has-error' : ''}`}
              >
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  aria-invalid={!!errors.email}
                  name={register('email').name}
                  onChange={register('email').onChange}
                  onBlur={register('email').onBlur}
                  ref={register('email').ref}
                />
              </div>
            </label>
            {errors.email && (
              <p className="field-error" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <span className="label-text">Password</span>
              <div
                className={`input-wrapper ${errors.password ? 'has-error' : ''}`}
              >
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  name={register('password').name}
                  onChange={register('password').onChange}
                  onBlur={register('password').onBlur}
                  ref={register('password').ref}
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
            </label>
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
                name={register('rememberMe').name}
                onChange={register('rememberMe').onChange}
                onBlur={register('rememberMe').onBlur}
                ref={register('rememberMe').ref}
              />
              Remember me
            </label>
            <button
              type="button"
              className="forgot-password-link"
              onClick={() =>
                navigate('/forgot-password', { state: { role: selectedRole } })
              }
            >
              Forgot password?
            </button>
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
        {selectedRole === 'organiser' && (
          <div className="create-account-footer">
            New here?{' '}
            <button
              type="button"
              className="create-link-btn"
              onClick={() => navigate('/create-organiser')}
            >
              Create your Organiser account
            </button>
            </button>
          </div>
        )}

        <p className="auth-footer">
          © 2024 Vision PME (Gala Management System). All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;
