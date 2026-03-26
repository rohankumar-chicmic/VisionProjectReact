import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, Check, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Auth.scss';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          <p className="auth-subtitle">Create a new secure password for your account</p>
        </div>

        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); navigate('/reset-success'); }}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                placeholder="Enter new password"
                required 
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                id="confirmPassword" 
                placeholder="Confirm new password"
                required 
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="requirements-block">
            <div className="req-title">Password Requirements:</div>
            <div className="req-list">
              <div className="req-item met">
                <CheckCircle2 size={14} /> At least 8 characters
              </div>
              <div className="req-item met">
                <CheckCircle2 size={14} /> One uppercase letter
              </div>
              <div className="req-item met">
                <CheckCircle2 size={14} /> One lowercase letter
              </div>
              <div className="req-item met">
                <CheckCircle2 size={14} /> One number or special character
              </div>
            </div>
          </div>

          <button type="submit" className="auth-button">
            <Check size={18} /> Reset Password
          </button>
        </form>

        <button className="back-link" onClick={() => navigate('/login')}>
          <ArrowLeft size={16} />
          <span>Back to Login</span>
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
