import React from 'react';
import { Mail, ArrowLeft, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Auth.scss';

const EmailSent: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card wide">
        <div className="auth-logo">
          <div className="icon-circle with-ring">
            <Mail size={32} />
          </div>
        </div>
        
        <div className="auth-header">
          <h1 className="auth-title">Check Your Email</h1>
          <p className="auth-subtitle">We've sent password reset instructions</p>
        </div>

        <div className="email-sent-to">
          <span className="label">Email Sent To:</span>
          <span className="value">
            <Mail size={16} /> admin@example.com
          </span>
        </div>

        <div className="steps-list">
          <div className="step-item">
            <div className="step-number">1</div>
            <span>Check your email inbox for the reset link</span>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <span>Click on the link to reset your password</span>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <span>Create a new secure password</span>
          </div>
        </div>

        <div className="alert-box">
          <div className="alert-title">
            <AlertCircle size={16} /> Link Expires Soon
          </div>
          <div className="alert-text">
            The password reset link will expire in 1 hour for security purposes.
          </div>
        </div>

        <div className="button-group">
          <button className="auth-button" onClick={() => window.location.href = 'mailto:'}>
            <ExternalLink size={18} /> Open Email App
          </button>
          <button className="auth-button outline" onClick={() => navigate('/forgot-password')}>
            <RefreshCw size={18} /> Resend Email
          </button>
        </div>

        <button className="back-link" onClick={() => navigate('/login')}>
          <ArrowLeft size={16} />
          <span>Back to Login</span>
        </button>
        
        <p className="spam-folder-text">
          Didn't receive the email? Check your spam folder
        </p>
      </div>
    </div>
  );
};

export default EmailSent;
