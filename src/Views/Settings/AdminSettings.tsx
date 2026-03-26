import React, { useEffect } from 'react';
import { 
  Upload, 
  Save, 
  EyeOff, 
  Lock, 
  Trash2, 
  RefreshCcw,
} from 'lucide-react';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import './AdminSettings.scss';

const AdminSettings: React.FC = () => {
  const { setTitle, setSubtitle } = useHeader();

  useEffect(() => {
    setTitle('Admin Settings');
    setSubtitle('Manage platform configuration and preferences');
  }, [setTitle, setSubtitle]);

  return (
    <div className="admin-settings-page">
      <HeaderActions>
        <button className="header-btn btn-primary">
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </HeaderActions>

      <div className="settings-grid">
        <div className="settings-column">
          {/* Profile Settings */}
          <section className="settings-card">
            <div className="card-header">
              <h3>Profile Settings</h3>
              <p>Update your admin profile information</p>
            </div>
            <div className="card-body">
              <div className="profile-upload">
                <div className="avatar-big">AU</div>
                <div className="upload-info">
                  <button className="btn-upload">
                    <Upload size={14} />
                    <span>Upload Photo</span>
                  </button>
                  <p className="upload-tip">JPG, PNG, max 5MB</p>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" defaultValue="Admin" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" defaultValue="User" />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" defaultValue="admin@gala.com" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" defaultValue="+66 456 7689 478" />
              </div>
            </div>
          </section>

          {/* Security Settings */}
          <section className="settings-card">
            <div className="card-header">
              <h3>Security Settings</h3>
              <p>Manage your password and authentication</p>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Current Password</label>
                <div className="input-with-icon">
                  <Lock size={16} className="prefix-icon" />
                  <input type="password" value="••••••••" readOnly />
                  <EyeOff size={16} className="suffix-icon" />
                </div>
              </div>
              <div className="form-group">
                <label>New Password</label>
                <div className="input-with-icon">
                  <Lock size={16} className="prefix-icon" />
                  <input type="password" placeholder="Enter new password" />
                  <EyeOff size={16} className="suffix-icon" />
                </div>
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="input-with-icon">
                  <Lock size={16} className="prefix-icon" />
                  <input type="password" placeholder="Confirm new password" />
                  <EyeOff size={16} className="suffix-icon" />
                </div>
              </div>
              <button className="btn-update-password">Update Password</button>
              
              <div className="tfa-row">
                <div className="tfa-info">
                  <span className="title">Two-Factor Authentication</span>
                  <p className="desc">Add an extra layer of security to your account</p>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </section>
        </div>

        <div className="settings-column">
          {/* Platform Configuration */}
          <section className="settings-card">
            <div className="card-header">
              <h3>Platform Configuration</h3>
              <p>General settings for the platform</p>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Platform Name</label>
                <input type="text" defaultValue="Vision PME (Gala Management System)" />
              </div>
              <div className="form-group">
                <label>Support Email</label>
                <input type="email" defaultValue="support@gala.com" />
              </div>
              <div className="form-group">
                <label>Timezone</label>
                <select defaultValue="ET">
                  <option value="ET">Eastern Time (ET)</option>
                  <option value="PT">Pacific Time (PT)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select defaultValue="USD">
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Email Notifications */}
          <section className="settings-card">
            <div className="card-header">
              <h3>Email Notifications</h3>
              <p>Configure email notification preferences</p>
            </div>
            <div className="card-body">
              <div className="notification-item">
                <div className="notif-info">
                  <span className="title">New Application Submitted</span>
                  <p className="desc">Get notified when users submit applications</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="notification-item">
                <div className="notif-info">
                  <span className="title">New User Registration</span>
                  <p className="desc">Get notified about new user signups</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="notification-item">
                <div className="notif-info">
                  <span className="title">Payment Received</span>
                  <p className="desc">Get notified about subscription payments</p>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="notification-item">
                <div className="notif-info">
                  <span className="title">Gala Deadline Approaching</span>
                  <p className="desc">Get reminders about upcoming gala deadlines</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="settings-card danger-zone">
            <div className="card-header">
              <h3>Danger Zone</h3>
              <p>Irreversible actions - proceed with caution</p>
            </div>
            <div className="card-body">
              <div className="danger-item">
                <div className="danger-info">
                  <span className="title">Clear System Cache</span>
                  <p className="desc">Remove all cached data</p>
                </div>
                <button className="btn-danger-outline">
                  <Trash2 size={16} />
                  <span>Clear</span>
                </button>
              </div>
              <div className="danger-item">
                <div className="danger-info">
                  <span className="title">Reset to Default Settings</span>
                  <p className="desc">Restore all settings to default</p>
                </div>
                <button className="btn-danger-outline">
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
};

export default AdminSettings;
