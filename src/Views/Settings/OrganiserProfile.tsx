import { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  Globe2,
  ShieldCheck,
  AlertCircle,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  MessageSquare,
  UploadCloud,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useHeader } from '../../Shared/Context/HeaderContext';
import {
  useGetOrganiserProfileQuery,
  useUpdateOrganiserProfileMutation,
  useResubmitVerificationMutation,
  useDeleteOrganiserAccountMutation,
} from '../../Services/Api/module/Organiser/Profile';
import { useUploadFileMutation } from '../../Services/Api/module/Common';
import { clearAuthTokenRedux } from '../../Store/Common';
import showToast from '../../Shared/Utils/toast';
import Skeleton from '../../Components/Shared/Skeleton';
import Modal from '../../Components/Atom/Modal/Modal';
import './OrganiserProfile.scss';

function OrganiserProfile() {
  const { setTitle, setSubtitle, resetHeader } = useHeader();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data: profileRes,
    isLoading,
    refetch,
    error: profileError,
  } = useGetOrganiserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateOrganiserProfileMutation();
  const [resubmitVerification, { isLoading: isResubmitting }] =
    useResubmitVerificationMutation();
  const [deleteAccount, { isLoading: isDeleting }] =
    useDeleteOrganiserAccountMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const profile = profileRes?.data;

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    companyName: '',
    industryDomain: '',
  });

  const [resubmitData, setResubmitData] = useState({
    governmentId: '',
    additionalComments: '',
  });
  const [fileName, setFileName] = useState('');
  const [showResubmitForm, setShowResubmitForm] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    setTitle('My Profile');
    setSubtitle('Manage your personal and professional information');
    return () => resetHeader();
  }, [setTitle, setSubtitle, resetHeader]);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        phoneNumber: profile.phoneNumber || '',
        companyName: profile.companyName || '',
        industryDomain: profile.industryDomain || '',
      });
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      showToast.success('Profile updated successfully');
    } catch (err) {
      showToast.error('Failed to update profile');
    }
  };

  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resubmitData.governmentId) {
      showToast.error('Please upload a government ID document');
      return;
    }
    try {
      await resubmitVerification(resubmitData).unwrap();
      showToast.success('Verification resubmitted successfully');
      setShowResubmitForm(false);
      setFileName('');
      refetch();
    } catch (err) {
      showToast.error('Failed to resubmit verification');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast.error('File size should not exceed 5MB');
      return;
    }

    const fileFormData = new FormData();
    fileFormData.append('file', file);

    try {
      setFileName(file.name);
      const res = await uploadFile(fileFormData).unwrap();
      if (res.success) {
        setResubmitData({ ...resubmitData, governmentId: res.data });
        showToast.success('Document uploaded successfully');
      }
    } catch (err) {
      showToast.error('Failed to upload document');
      setFileName('');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount().unwrap();
      showToast.success('Account deactivated successfully');
      dispatch(clearAuthTokenRedux());
      navigate('/login');
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'data' in err &&
        typeof (err as { data: { message?: string } }).data.message === 'string'
      ) {
        showToast.error((err as { data: { message: string } }).data.message);
      } else if (err instanceof Error) {
        showToast.error(err.message);
      } else {
        showToast.error('Failed to deactivate account');
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle2 className="icon verified" size={20} />;
      case 'Rejected':
        return <XCircle className="icon rejected" size={20} />;
      case 'Pending':
        return <Clock className="icon pending" size={20} />;
      default:
        return <AlertCircle className="icon unknown" size={20} />;
    }
  };

  if (isLoading) {
    return (
      <div className="organiser-profile-view">
        <div className="profile-container">
          <Skeleton height={400} borderRadius={20} />
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="organiser-profile-view">
        <div className="profile-container error-state">
          <AlertCircle size={48} />
          <h3>Failed to load profile</h3>
          <p>Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="organiser-profile-view">
      <div className="profile-grid">
        {/* Verification Status Card */}
        <div className="status-card-container">
          <div
            className={`status-card ${profile?.verificationStatus.toLowerCase()}`}
          >
            <div className="status-header">
              <div className="status-title">
                {getStatusIcon(profile?.verificationStatus || '')}
                <span>Account Verification Status</span>
              </div>
              <span
                className={`status-badge ${profile?.verificationStatus.toLowerCase()}`}
              >
                {profile?.verificationStatus}
              </span>
            </div>

            <div className="status-content">
              {profile?.verificationStatus === 'Verified' && (
                <p>
                  Your account is fully verified. You have complete access to
                  all platform features.
                </p>
              )}
              {profile?.verificationStatus === 'Pending' && (
                <p>
                  Your verification request is being reviewed by our
                  administration team. This usually takes 1-2 business days.
                </p>
              )}
              {profile?.verificationStatus === 'Rejected' && (
                <div className="rejection-info">
                  <p>Your verification request was declined.</p>
                  {profile.adminRejectionReason && (
                    <div className="reason-box">
                      <strong>Reason:</strong> {profile.adminRejectionReason}
                    </div>
                  )}
                  <button
                    type="button"
                    className="resubmit-trigger"
                    onClick={() => setShowResubmitForm(!showResubmitForm)}
                  >
                    <RotateCcw size={16} />
                    <span>
                      {showResubmitForm
                        ? 'Cancel Resubmission'
                        : 'Resubmit Verification'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {showResubmitForm && (
            <div className="resubmit-form-container">
              <form onSubmit={handleResubmit} className="resubmit-form">
                <h3>Resubmit Verification</h3>
                <div className="form-group">
                  <label htmlFor="file-upload">
                    Government ID / Proof Address
                    <div
                      className={`upload-zone ${isUploading ? 'uploading' : ''} ${resubmitData.governmentId ? 'completed' : ''}`}
                    >
                      <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                        disabled={isUploading}
                        hidden
                      />
                      <div className="upload-label">
                        {(() => {
                          if (isUploading) {
                            return (
                              <div className="upload-progress">
                                <div className="spinner-small" />
                                <span>Uploading...</span>
                              </div>
                            );
                          }
                          if (resubmitData.governmentId) {
                            return (
                              <div className="upload-success">
                                <CheckCircle2 size={32} />
                                <div className="file-info">
                                  <span className="file-name">{fileName}</span>
                                  <span className="status">
                                    Replacement Selected
                                  </span>
                                </div>
                                <span className="change-btn">Change</span>
                              </div>
                            );
                          }
                          return (
                            <div className="upload-placeholder">
                              <UploadCloud size={32} />
                              <div className="text">
                                <strong>Click to upload document</strong>
                                <span>Images or PDF (max 5MB)</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="comments">
                    Additional Comments
                    <div className="input-wrapper textarea-wrapper">
                      <MessageSquare size={18} />
                      <textarea
                        id="comments"
                        placeholder="Provide any additional context for the reviewer..."
                        value={resubmitData.additionalComments}
                        onChange={(e) =>
                          setResubmitData({
                            ...resubmitData,
                            additionalComments: e.target.value,
                          })
                        }
                      />
                    </div>
                  </label>
                </div>
                <button
                  type="submit"
                  className="submit-resubmit"
                  disabled={isResubmitting || isUploading}
                >
                  {isResubmitting ? 'Submitting...' : 'Submit to Admin'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Profile Information Form */}
        <div className="info-card">
          <div className="card-header">
            <div className="title">
              <User size={20} />
              <span>Personal Information</span>
            </div>
          </div>
          <form onSubmit={handleUpdateProfile} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">
                  Full Name
                  <div className="input-wrapper">
                    <User size={18} />
                    <input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      required
                    />
                  </div>
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="email">
                  Email Address
                  <div className="input-wrapper disabled">
                    <Mail size={18} />
                    <input
                      id="email"
                      type="email"
                      value={profile?.email}
                      disabled
                    />
                  </div>
                </label>
                <span className="hint">Contact support to change email</span>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number
                  <div className="input-wrapper">
                    <Phone size={18} />
                    <input
                      id="phone"
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="industry">
                  Industry Domain
                  <div className="input-wrapper">
                    <Globe2 size={18} />
                    <input
                      id="industry"
                      type="text"
                      value={formData.industryDomain}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          industryDomain: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </label>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="company">
                Company Name
                <div className="input-wrapper">
                  <Building2 size={18} />
                  <input
                    id="company"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    required
                  />
                </div>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={isUpdating}>
                <ShieldCheck size={18} />
                <span>{isUpdating ? 'Saving...' : 'Update Profile'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="danger-card">
          <div className="card-header">
            <div className="title">
              <Trash2 size={20} />
              <span>Danger Zone</span>
            </div>
          </div>
          <div className="card-content">
            <div className="danger-info">
              <h4>Deactivate Account</h4>
              <p>
                Once you deactivate your account, you will no longer be able to
                log in or manage your galas. This action is permanent.
              </p>
            </div>
            <button
              type="button"
              className="delete-btn"
              onClick={() => setIsDeleteConfirmOpen(true)}
              disabled={isDeleting}
            >
              <Trash2 size={18} />
              <span>
                {isDeleting ? 'Deactivating...' : 'Deactivate Account'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Deactivate Account"
        subtitle="This action is permanent and cannot be undone."
        width="450px"
        footer={
          <div className="modal-actions-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setIsDeleteConfirmOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-danger"
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontWeight: 600,
              }}
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deactivating...' : 'Deactivate Permanently'}
            </button>
          </div>
        }
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <AlertCircle
            size={48}
            color="#ef4444"
            style={{ marginBottom: '16px' }}
          />
          <p style={{ color: '#4b5563', lineHeight: '1.5' }}>
            Are you absolutely sure you want to deactivate your account? All
            your data, including galas and personal info, will be permanently
            removed from our active servers.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default OrganiserProfile;
