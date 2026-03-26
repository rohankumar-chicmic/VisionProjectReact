import React from 'react';
import { Check, ShieldCheck, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Auth.scss';

const ResetSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card wide">
        <div className="auth-logo">
          <div className="icon-circle with-ring">
            <Check size={32} />
          </div>
        </div>
        
        <div className="auth-header">
          <h1 className="auth-title">Password Reset Successful!</h1>
          <p className="auth-subtitle">Your password has been successfully reset</p>
        </div>

        <div className="alert-box">
          <div className="alert-title">
            <ShieldCheck size={16} /> Secure Password Set
          </div>
          <div className="alert-text">
            Your new password meets all security requirements and has been saved successfully.
          </div>
        </div>

        <div className="whats-next-block">
          <div className="whats-next-title">What's Next?</div>
          
          <div className="next-item">
            <div className="next-icon">
              <LogIn size={16} />
            </div>
            <div className="next-content">
              <div className="next-heading">Sign in with your new password</div>
              <div className="next-desc">Use your updated credentials to access the admin panel</div>
            </div>
          </div>
          
          <div className="next-item">
            <div className="next-icon">
              <ShieldCheck size={16} />
            </div>
            <div className="next-content">
              <div className="next-heading">Keep your password secure</div>
              <div className="next-desc">Don't share your password with anyone</div>
            </div>
          </div>
        </div>

        <button className="auth-button" onClick={() => navigate('/login')}>
          Continue to Login
        </button>
      </div>
    </div>
  );
};

export default ResetSuccess;
