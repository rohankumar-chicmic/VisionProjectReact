/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import {
  Save,
  Lock,
  Trash2,
  RefreshCcw,
  Mail,
  Phone,
  Globe,
  Shield,
  Bell,
  AppWindow,
  User,
  Camera,
  Coins,
} from 'lucide-react';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import {
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
  AdminSettings as IAdminSettings,
} from '../../Services/Api/module/Admin/Auth';
import Skeleton from '../../Components/Shared/Skeleton';
import showToast from '../../Shared/Utils/toast';
import './AdminSettings.scss';

function AdminSettings() {
  const { setTitle, setSubtitle, resetHeader } = useHeader();
  const { data: settingsRes, isLoading, refetch } = useGetAdminSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateAdminSettingsMutation();

  const [formData, setFormData] = useState<IAdminSettings | null>(null);

  useEffect(() => {
    setTitle('Settings & Profile');
    setSubtitle(
      'Manage your personal account and platform-wide configurations'
    );
    return () => resetHeader();
  }, [setTitle, setSubtitle, resetHeader]);

  useEffect(() => {
    if (settingsRes?.data) {
      setFormData(settingsRes.data);
    }
  }, [settingsRes]);

  const handleInputChange = <K extends keyof IAdminSettings>(
    field: K,
    value: IAdminSettings[K]
  ) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      await updateSettings(formData).unwrap();
      showToast.success('Settings updated successfully');
      refetch();
    } catch (err) {
      showToast.error('Failed to update settings');
    }
  };

  if (isLoading || !formData) {
    return (
      <div className="admin-settings-page">
        <div className="settings-grid">
          <Skeleton height={400} borderRadius={20} />
          <Skeleton height={600} borderRadius={20} />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-settings-page">
      <HeaderActions>
        <button
          type="button"
          className="header-btn btn-primary"
          onClick={handleSave}
          disabled={isUpdating}
        >
          <Save size={18} />
          <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </HeaderActions>

      <div className="settings-container">
        {/* Profile Header Card */}
        <div className="profile-header-card">
          <div className="avatar-section">
            <div className="avatar-container">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt="Avatar"
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  {formData.fullName?.charAt(0) || 'A'}
                </div>
              )}
              <div className="avatar-edit-badge">
                <Camera size={14} />
              </div>
            </div>
            <div className="name-meta">
              <h2>{formData.fullName || 'Admin User'}</h2>
              <span className="role-label">Platform Administrator</span>
            </div>
          </div>
          <div className="profile-meta-chips">
            <div className="meta-chip">
              <Mail size={14} />
              <span>{formData.email}</span>
            </div>
            {formData.phoneNumber && (
              <div className="meta-chip">
                <Phone size={14} />
                <span>{formData.phoneNumber}</span>
              </div>
            )}
          </div>
        </div>

        <div className="settings-grid">
          {/* Account Information */}
          <section className="settings-card">
            <div className="card-header">
              <div className="title">
                <User size={20} />
                <h3>Account Information</h3>
              </div>
              <p>Manage your personal login and profile details</p>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <User size={16} />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange('fullName', e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper disabled">
                  <Mail size={16} />
                  <input type="email" value={formData.email} disabled />
                </div>
                <span className="hint">
                  Contact system administrator to change email
                </span>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-wrapper">
                  <Phone size={16} />
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange('phoneNumber', e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Avatar URL</label>
                <div className="input-wrapper">
                  <Globe size={16} />
                  <input
                    type="text"
                    placeholder="https://example.com/avatar.png"
                    value={formData.avatarUrl}
                    onChange={(e) =>
                      handleInputChange('avatarUrl', e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Platform Configuration */}
          <section className="settings-card">
            <div className="card-header">
              <div className="title">
                <AppWindow size={20} />
                <h3>Platform Configuration</h3>
              </div>
              <p>Global settings for the application instance</p>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Platform Name</label>
                <div className="input-wrapper">
                  <AppWindow size={16} />
                  <input
                    type="text"
                    value={formData.platformName}
                    onChange={(e) =>
                      handleInputChange('platformName', e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Support Email</label>
                <div className="input-wrapper">
                  <Mail size={16} />
                  <input
                    type="email"
                    value={formData.supportEmail}
                    onChange={(e) =>
                      handleInputChange('supportEmail', e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Timezone</label>
                  <div className="input-wrapper">
                    <Globe size={16} />
                    <select
                      value={formData.timezone}
                      onChange={(e) =>
                        handleInputChange('timezone', e.target.value)
                      }
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">EST (UTC-5)</option>
                      <option value="CET">CET (UTC+1)</option>
                      <option value="AST">AST (UTC+4)</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <div className="input-wrapper">
                    <Coins size={16} />
                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        handleInputChange('currency', e.target.value)
                      }
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="settings-column">
          {/* Security & Authentication */}
          <section className="settings-card">
            <div className="card-header">
              <div className="title">
                <Shield size={20} />
                <h3>Security & Privacy</h3>
              </div>
              <p>Protect your account with extra layers of security</p>
            </div>
            <div className="card-body">
              <div className="tfa-row">
                <div className="tfa-info">
                  <span className="title">Two-Factor Authentication (2FA)</span>
                  <p className="desc">
                    Requires a verification code in addition to your password
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={formData.isTwoFactorEnabled}
                    onChange={(e) =>
                      handleInputChange('isTwoFactorEnabled', e.target.checked)
                    }
                  />
                  <span className="slider round" />
                </label>
              </div>

              <div className="password-instruction">
                <Lock size={16} />
                <span>
                  Password management is handled via the separate Profile
                  Actions menu for security.
                </span>
              </div>
            </div>
          </section>

          {/* Email Notifications */}
          <section className="settings-card">
            <div className="card-header">
              <div className="title">
                <Bell size={20} />
                <h3>Email Notifications</h3>
              </div>
              <p>Control which system events trigger email alerts</p>
            </div>
            <div className="card-body">
              <div className="notification-item">
                <div className="notif-info">
                  <span className="title">New Application Submitted</span>
                  <p className="desc">
                    Get notified when users submit applications
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={formData.notifyNewApplicationSubmitted}
                    onChange={(e) =>
                      handleInputChange(
                        'notifyNewApplicationSubmitted',
                        e.target.checked
                      )
                    }
                  />
                  <span className="slider round" />
                </label>
              </div>
              <div className="notification-item">
                <div className="notif-info">
                  <span className="title">New User Registration</span>
                  <p className="desc">Get notified about new user signups</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={formData.notifyNewUserRegistration}
                    onChange={(e) =>
                      handleInputChange(
                        'notifyNewUserRegistration',
                        e.target.checked
                      )
                    }
                  />
                  <span className="slider round" />
                </label>
              </div>
              <div className="notification-item">
                <div className="notif-info">
                  <span className="title">Payment Received</span>
                  <p className="desc">
                    Get notified about successful transactions
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={formData.notifyPaymentReceived}
                    onChange={(e) =>
                      handleInputChange(
                        'notifyPaymentReceived',
                        e.target.checked
                      )
                    }
                  />
                  <span className="slider round" />
                </label>
              </div>
              <div className="notification-item">
                <div className="notif-info">
                  <span className="title">Gala Deadline Approaching</span>
                  <p className="desc">
                    Get reminders about upcoming program deadlines
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={formData.notifyGalaDeadlineApproaching}
                    onChange={(e) =>
                      handleInputChange(
                        'notifyGalaDeadlineApproaching',
                        e.target.checked
                      )
                    }
                  />
                  <span className="slider round" />
                </label>
              </div>
            </div>
          </section>

          {/* Maintenance Zone */}
          <section className="settings-card maintenance">
            <div className="card-header">
              <h3>Maintenance Zone</h3>
              <p>System-wide administrative actions</p>
            </div>
            <div className="card-body">
              <div className="maintenance-item">
                <div className="info">
                  <span className="title">Clear System Cache</span>
                  <p className="desc">Purge all cached API responses</p>
                </div>
                <button type="button" className="btn-outline-danger">
                  <Trash2 size={16} />
                  <span>Clear</span>
                </button>
              </div>
              <div className="maintenance-item">
                <div className="info">
                  <span className="title">Factory Reset</span>
                  <p className="desc">Revert all configurations to default</p>
                </div>
                <button type="button" className="btn-outline-danger">
                  <RefreshCcw size={16} />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
