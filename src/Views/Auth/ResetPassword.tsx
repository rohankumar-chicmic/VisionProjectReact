import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useResetPasswordForm } from './hooks/useAuthForms';
import './Auth.scss';

function ResetPassword() {
  const navigate = useNavigate();
  const {
    register,
    errors,
    isSubmitting,
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    passwordRequirements,
    onSubmit,
  } = useResetPasswordForm();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="icon-circle">
            <Lock size={32} />
          </div>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">
            Create a new secure password for your account
          </p>
        </div>

        <form className="auth-form" noValidate onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <div
              className={`input-wrapper ${errors.password ? 'has-error' : ''}`}
            >
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter new password"
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div
              className={`input-wrapper ${
                errors.confirmPassword ? 'has-error' : ''
              }`}
            >
              <Lock className="input-icon" size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Confirm new password"
                aria-invalid={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={
                  showConfirmPassword ? 'Hide password' : 'Show password'
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="field-error" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="requirements-block">
            <div className="req-title">Password Requirements:</div>
            <div className="req-list">
              {passwordRequirements.map((requirement) => (
                <div
                  key={requirement.label}
                  className={`req-item ${requirement.met ? 'met' : ''}`}
                >
                  <CheckCircle2 size={14} /> {requirement.label}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={isSubmitting}>
            <Check size={18} /> Reset Password
          </button>
        </form>

        <button
          type="button"
          className="back-link"
          onClick={() => navigate('/login')}
        >
          <ArrowLeft size={16} />
          <span>Back to Login</span>
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
