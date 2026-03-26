import React from 'react';
import { Mail, ArrowLeft, Key, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Auth.scss';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="icon-circle">
            <Key size={32} />
          </div>
        </div>
        
        <div className="auth-header">
          <h1 className="auth-title">Forgot Password?</h1>
          <p className="auth-subtitle">No worries, we'll send you reset instructions</p>
        </div>

        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); navigate('/email-sent'); }}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email address"
                required 
              />
            </div>
          </div>

          <div className="alert-box">
            <div className="alert-title">
              <AlertCircle size={16} /> Email Recovery
            </div>
            <div className="alert-text">
              Enter the email address associated with your admin account and we'll send you a link to reset your password.
            </div>
          </div>

          <button type="submit" className="auth-button">
            Send Reset Link
          </button>
        </form>

        <button className="back-link" onClick={() => navigate('/login')}>
          <ArrowLeft size={16} />
          <span>Back to Login</span>
        </button>
        
        <p className="auth-footer" style={{marginTop: '32px'}}>
          © 2024 Vision PME (Gala Management System). All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
