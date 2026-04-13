import { useEffect, useState } from 'react';
import {
  Mail,
  Phone,
  Building2,
  Edit2,
  User,
  Tags,
  Loader2,
  Save,
  X,
  Calendar,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useHeader } from '../../../Shared/Context/HeaderContext';
import {
  useGetJuryProfileQuery,
  useUpdateJuryProfileMutation,
} from '../../../Services/Api/module/JuryApi';
import './JuryProfile.scss';

function JuryProfile() {
  const { setTitle, setSubtitle, resetHeader } = useHeader();
  const { data: profileResponse, isLoading: isProfileLoading } =
    useGetJuryProfileQuery();
  console.log(profileResponse)
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateJuryProfileMutation();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    company: '',
    expertise: '',
  });

  useEffect(() => {
    setTitle('Jury Profile');
    setSubtitle('Manage your professional identity and expertise');
    return () => resetHeader();
  }, [setTitle, setSubtitle, resetHeader]);

  useEffect(() => {
    // We don't populate formData anymore to allow values to show as placeholders
    // Only used to trigger re-renders if needed or handle initial state
  }, [profileResponse]);

  const handleSave = async () => {
    try {
      await updateProfile({
        fullName: formData.fullName || jury?.fullName || '',
        phoneNumber: formData.phone || jury?.phoneNumber || '',
        companyName: formData.company || jury?.companyName || '',
        domainOfExpertise: formData.expertise || jury?.domainOfExpertise || '',
      }).unwrap();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: '',
      phone: '',
      company: '',
      expertise: '',
    });
    setIsEditing(false);
  };

  if (isProfileLoading) {
    return (
      <div className="jury-profile-loading">
        <Loader2 className="animate-spin" size={48} />
        <p>Loading your profile...</p>
      </div>
    );
  }

  const jury = profileResponse;

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="jury-profile-page">
      <div className="profile-layout">
        <main className="profile-content-area">
          <div className="glass-card content-card">
            <div className="card-sections-header">
              <div className="title-box">
                <h3>Account information</h3>
                <p>Maintain your professional records and contact details</p>
              </div>
              <div className="action-box">
                {isEditing ? (
                  <div className="edit-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={handleCancel}
                      disabled={isUpdating}
                    >
                      <X size={18} />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="button"
                      className="btn-save"
                      onClick={handleSave}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Save size={18} />
                      )}
                      <span>Save Changes</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn-edit-profile"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 size={18} />
                    <span>Edit profile</span>
                  </button>
                )}
              </div>
            </div>

            <div className="profile-header-strip">
              <div className="avatar-box">{getInitials(jury?.fullName || '')}</div>
              <div className="header-info">
                <h2>{jury?.fullName || 'Your full legal name'}</h2>
                <div className="meta-tags">
                  <span className="user-type">Jury member</span>
                  <span className="status-badge active">Active</span>
                </div>
              </div>
            </div>

            <form className="modern-form" onSubmit={(e) => e.preventDefault()}>
              <div className="modern-form-grid">
                <div className="field-wrapper">
                  <label htmlFor="fullName">
                    <span className="icon-bg">
                      <User size={14} />
                    </span>
                    Full Name
                  </label>
                  <div className="input-container">
                    <input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder={jury?.fullName || 'Your full legal name'}
                    />
                  </div>
                </div>

                <div className="field-wrapper">
                  <label htmlFor="email">
                    <span className="icon-bg">
                      <Mail size={14} />
                    </span>
                    Email Address
                  </label>
                  <div className="input-container">
                    <input
                      id="email"
                      type="email"
                      value=""
                      disabled
                      placeholder={jury?.email || 'email@example.com'}
                    />
                  </div>
                </div>

                <div className="field-wrapper">
                  <label htmlFor="phone">
                    <span className="icon-bg">
                      <Phone size={14} />
                    </span>
                    Phone Number
                  </label>
                  <div className="input-container">
                    <input
                      id="phone"
                      type="text"
                      value={formData.phone}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder={jury?.phoneNumber || '+1 234 567 890'}
                    />
                  </div>
                </div>

                <div className="field-wrapper">
                  <label htmlFor="company">
                    <span className="icon-bg">
                      <Building2 size={14} />
                    </span>
                    Organization
                  </label>
                  <div className="input-container">
                    <input
                      id="company"
                      type="text"
                      value={formData.company}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      placeholder={jury?.companyName || 'Current company or institution'}
                    />
                  </div>
                </div>

                <div className="field-wrapper">
                  <label htmlFor="expertise">
                    <span className="icon-bg">
                      <Tags size={14} />
                    </span>
                    Specialisation
                  </label>
                  <div className="input-container">
                    {isEditing ? (
                      <input
                        id="expertise"
                        type="text"
                        value={formData.expertise}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            expertise: e.target.value,
                          })
                        }
                        placeholder={jury?.domainOfExpertise || 'AI, Blockchain, Fintech'}
                      />
                    ) : (
                      <div className="tag-display">
                        {jury?.domainOfExpertise ? (
                          jury.domainOfExpertise
                            .split(',')
                            .map((tag) => (
                              <span key={tag.trim()} className="skill-tag">
                                {tag.trim()}
                              </span>
                            ))
                        ) : (
                          <span className="no-data">No specialisation set</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="field-wrapper">
                  <label htmlFor="createdAt">
                    <span className="icon-bg">
                      <Calendar size={14} />
                    </span>
                    Member Since
                  </label>
                  <div className="input-container">
                    <input
                      id="createdAt"
                      type="text"
                      value=""
                      disabled
                      placeholder={
                        jury?.createdAt
                          ? new Date(jury.createdAt).toLocaleDateString()
                          : 'N/A'
                      }
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default JuryProfile;
