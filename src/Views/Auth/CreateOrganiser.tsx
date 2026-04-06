/* eslint-disable @typescript-eslint/no-explicit-any, jsx-a11y/click-events-have-key-events, jsx-a11y/label-has-associated-control, jsx-a11y/no-static-element-interactions */
import { useState, useRef } from 'react';
import {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  Cpu,
  ShoppingBag,
  HardHat,
  Heart,
  GraduationCap,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  FileText,
  EyeOff,
  Eye,
  UploadCloud,
  X,
} from 'lucide-react';
import { useCreateOrganiserForm } from './hooks/useAuthForms';
import './Auth.scss';

const INDUSTRIES = [
  { id: 'Technology', label: 'Technology', icon: Cpu },
  { id: 'Services', label: 'Services', icon: Briefcase },
  { id: 'Retail', label: 'Retail', icon: ShoppingBag },
  { id: 'Construction', label: 'Construction', icon: HardHat },
  { id: 'Health', label: 'Health', icon: Heart },
  { id: 'Education', label: 'Education', icon: GraduationCap },
  { id: 'Other', label: 'Other', icon: MoreHorizontal },
];

function CreateOrganiser() {
  const {
    register,
    errors,
    isSubmitting,
    step,
    nextStep,
    prevStep,
    watch,
    setValue,
    submitError,
  } = useCreateOrganiserForm();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const selectedIndustry = watch('industryType');

  const renderStep1 = () => (
    <div className="auth-form-step">
      <div className="auth-header text-left">
        <h2 className="auth-subtitle-bold">Personal information</h2>
        <p className="auth-subtitle">
          Tell us about yourself as the Gala Organiser.
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="fullname">FULL NAME *</label>
        <div className={`input-wrapper ${errors.fullname ? 'has-error' : ''}`}>
          <User className="input-icon" size={20} />
          <input
            type="text"
            id="fullname"
            placeholder="Priya Sharma"
            name={register('fullname').name}
            onBlur={register('fullname').onBlur}
            onChange={register('fullname').onChange}
            ref={register('fullname').ref}
          />
        </div>
        {errors.fullname && (
          <p className="field-error">{errors.fullname.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">EMAIL ADDRESS *</label>
        <div className={`input-wrapper ${errors.email ? 'has-error' : ''}`}>
          <Mail className="input-icon" size={20} />
          <input
            type="email"
            id="email"
            placeholder="priya@galavision.com"
            name={register('email').name}
            onBlur={register('email').onBlur}
            onChange={register('email').onChange}
            ref={register('email').ref}
          />
        </div>
        {errors.email && <p className="field-error">{errors.email.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="phone">PHONE NUMBER *</label>
        <div className={`input-wrapper ${errors.phone ? 'has-error' : ''}`}>
          <Phone className="input-icon" size={20} />
          <input
            type="tel"
            id="phone"
            placeholder="+91 98765 43210"
            name={register('phone').name}
            onBlur={register('phone').onBlur}
            onChange={register('phone').onChange}
            ref={register('phone').ref}
          />
        </div>
        {errors.phone && <p className="field-error">{errors.phone.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="password">PASSWORD *</label>
        <div className={`input-wrapper ${errors.password ? 'has-error' : ''}`}>
          <Lock className="input-icon" size={20} />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="••••••••"
            name={register('password').name}
            onBlur={register('password').onBlur}
            onChange={register('password').onChange}
            ref={register('password').ref}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="field-error">{errors.password.message}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="auth-form-step">
      <div className="auth-header text-left">
        <h2 className="auth-subtitle-bold">Business details</h2>
        <p className="auth-subtitle">
          Help us understand your company and industry.
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="companyName">COMPANY NAME *</label>
        <div
          className={`input-wrapper ${errors.companyName ? 'has-error' : ''}`}
        >
          <Building2 className="input-icon" size={20} />
          <input
            type="text"
            id="companyName"
            placeholder="Vision PME Inc."
            name={register('companyName').name}
            onBlur={register('companyName').onBlur}
            onChange={register('companyName').onChange}
            ref={register('companyName').ref}
          />
        </div>
        {errors.companyName && (
          <p className="field-error">{errors.companyName.message}</p>
        )}
      </div>

      <div className="form-group">
        <label>INDUSTRY TYPE *</label>
        <div className="industry-grid">
          {INDUSTRIES.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`industry-card ${selectedIndustry === item.id ? 'active' : ''}`}
                onClick={() => setValue('industryType', item.id as any)}
              >
                <div className="industry-icon">
                  <Icon size={24} />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
        {errors.industryType && (
          <p className="field-error">{errors.industryType.message}</p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="auth-form-step">
      <div className="auth-header text-left">
        <h2 className="auth-subtitle-bold">Identity Verification</h2>
        <p className="auth-subtitle">
          Please provide your government issued ID for verification.
        </p>
      </div>

      <div className="form-group">
        <label>GOVT ID / DOCUMENT *</label>
        <div
          className={`upload-dropzone ${dragActive ? 'drag-active' : ''} ${errors.govtId ? 'has-error' : ''}`}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              setValue('govtId', e.dataTransfer.files[0], {
                shouldValidate: true,
              });
            }
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden-file-input"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setValue('govtId', e.target.files[0], { shouldValidate: true });
              }
            }}
          />

          {!watch('govtId') ? (
            <div className="upload-placeholder">
              <div className="upload-icon-circle">
                <UploadCloud size={24} />
              </div>
              <div className="upload-text">
                <p className="primary-text">Click to upload or drag and drop</p>
                <p className="secondary-text">PNG, JPG or PDF (max. 10MB)</p>
              </div>
            </div>
          ) : (
            <div className="upload-preview">
              <div className="file-info">
                <FileText className="file-icon" size={24} />
                <div className="file-details">
                  <p className="file-name">
                    {(watch('govtId') as File).name || 'Document Uploaded'}
                  </p>
                  <p className="file-size">
                    {watch('govtId') instanceof File
                      ? `${Math.round((watch('govtId') as File).size / 1024)} KB`
                      : 'File selected'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="remove-file-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setValue('govtId', null as any, { shouldValidate: true });
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>
        {errors.govtId && (
          <p className="field-error">
            {typeof errors.govtId.message === 'string'
              ? errors.govtId.message
              : 'Government ID is required'}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="auth-container">
      <div className="auth-card extra-wide">
        <div className="auth-header-centered">
          <h1 className="auth-title-large">Create Organiser Account</h1>
          <p className="auth-subtitle">Join VisionPME as an Organiser</p>
        </div>

        <div className="registration-stepper">
          <div
            className={`step-dot ${step >= 1 ? 'active' : ''} ${step === 1 ? 'current' : ''}`}
          >
            1
          </div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`} />
          <div
            className={`step-dot ${step >= 2 ? 'active' : ''} ${step === 2 ? 'current' : ''}`}
          >
            2
          </div>
          <div className={`step-line ${step >= 3 ? 'active' : ''}`} />
          <div
            className={`step-dot ${step >= 3 ? 'active' : ''} ${step === 3 ? 'current' : ''}`}
          >
            3
          </div>
        </div>

        <div className="stepper-labels">
          <span className={step === 1 ? 'active' : ''}>Personal info</span>
          <span className={step === 2 ? 'active' : ''}>Security</span>
          <span className={step === 3 ? 'active' : ''}>Identity</span>
        </div>

        <form className="auth-form mt-4" noValidate>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {submitError && (
            <div className="auth-submit-error" role="alert">
              {submitError}
            </div>
          )}

          <div className="stepper-actions">
            <button
              type="button"
              className="back-btn"
              onClick={prevStep}
              disabled={isSubmitting}
            >
              <ChevronLeft size={20} />
              <span>{step === 1 ? 'Back to Login' : 'Back'}</span>
            </button>
            <button
              type="button"
              className="continue-btn"
              onClick={nextStep}
              disabled={isSubmitting}
            >
              <span>{step === 3 ? 'Create Account' : 'Continue'}</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </form>

        <div className="create-account-footer">
          Already have an account?{' '}
          <span className="create-link" onClick={() => prevStep()}>
            Sign in
          </span>
        </div>

        <p className="auth-footer">
          © 2024 Vision PME (Gala Management System). All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default CreateOrganiser;
