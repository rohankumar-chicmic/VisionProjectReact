import { useEffect, useState } from 'react';
import {
  Mail,
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForgotPasswordMutation } from '../../Services/Api/module/Auth';
import './Auth.scss';

function EmailSent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [resendEmail, { isLoading, isSuccess, isError }] =
    useForgotPasswordMutation();
  const [feedback, setFeedback] = useState<string | null>(null);

  const email = (location.state as { email?: string })?.email;

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleResend = async () => {
    if (!email) return;
    setFeedback(null);
    try {
      await resendEmail({ email }).unwrap();
      setFeedback('A new reset link has been sent to your email.');
    } catch (error) {
      setFeedback('Failed to resend email. Please try again later.');
    }
  };

  if (!email) return null;

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
          <p className="auth-subtitle">
            We&apos;ve sent password reset instructions
          </p>
        </div>

        <div className="email-sent-to">
          <span className="label">Email Sent To:</span>
          <span className="value">
            <Mail size={16} /> {email}
          </span>
        </div>

        {feedback && (
          <div
            className={`alert-box ${isSuccess ? 'success' : ''} ${isError ? 'error' : ''}`}
            style={{ marginBottom: '24px' }}
          >
            <div className="alert-title">
              {isSuccess ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {isSuccess ? ' Success' : ' Error'}
            </div>
            <div className="alert-text">{feedback}</div>
          </div>
        )}

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
          <button
            type="button"
            className="auth-button"
            onClick={() => {
              globalThis.location.href = `mailto:${email}`;
            }}
          >
            <ExternalLink size={18} /> Open Email App
          </button>
          <button
            type="button"
            className="auth-button outline"
            onClick={handleResend}
            disabled={isLoading}
          >
            <RefreshCw className={isLoading ? 'spin' : ''} size={18} />
            {isLoading ? 'Sending...' : 'Resend Email'}
          </button>
        </div>

        <button
          type="button"
          className="back-link"
          onClick={() => navigate('/login')}
        >
          <ArrowLeft size={16} />
          <span>Back to Login</span>
        </button>

        <p className="spam-folder-text">
          Didn&apos;t receive the email? Check your spam folder
        </p>
      </div>
    </div>
  );
}

export default EmailSent;
