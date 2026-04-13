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
  const { data: profileResponse, isLoading: isProfileLoading } = useGetJuryProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateJuryProfileMutation();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    company: '',
    position: '',
    expertise: '',
    bio: '',
    linkedin: '',
  });

  useEffect(() => {
    setTitle('Jury Profile');
    setSubtitle('Manage your professional identity and expertise');
    return () => resetHeader();
  }, [setTitle, setSubtitle, resetHeader]);

  useEffect(() => {
    if (profileResponse?.data) {
      const p = profileResponse.data;
      setFormData({
        fullName: p.fullName || '',
        phone: p.phoneNumber || '',
        company: p.companyName || '',
        position: p.position || '',
        expertise: p.domainOfExpertise || '',
        bio: p.bio || '',
        linkedin: p.linkedin || '',
      });
    }
  }, [profileResponse]);

  const handleSave = async () => {
    try {
      await updateProfile({
        fullName: formData.fullName,
        phoneNumber: formData.phone,
        companyName: formData.company,
        position: formData.position,
        domainOfExpertise: formData.expertise,
        bio: formData.bio,
        linkedin: formData.linkedin,
      }).unwrap();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    if (profileResponse?.data) {
      const p = profileResponse.data;
      setFormData({
        fullName: p.fullName || '',
        phone: p.phoneNumber || '',
        company: p.companyName || '',
        position: p.position || '',
        expertise: p.domainOfExpertise || '',
        bio: p.bio || '',
        linkedin: p.linkedin || '',
      });
    }
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

  const jury = profileResponse?.data;

  return (
    <div className="jury-profile-page">
      <div className="profile-layout">
        <main className="profile-content-area">
          <div className="glass-card content-card">
            <div className="card-sections-header">
              <div className="title-box">
                <h3>Account Information</h3>
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
                      {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
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
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            <form className="modern-form" onSubmit={(e) => e.preventDefault()}>
              <div className="modern-form-grid">
                <div className="field-wrapper span-2">
                  <label htmlFor="fullName">
                    <div className="icon-bg">
                      <User size={14} />
                    </div>
                    Full Name
                  </label>
                  <div className="input-container">
                    <input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      disabled={!isEditing}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Your full legal name"
                    />
                  </div>
                </div>

                <div className="field-wrapper">
                  <label htmlFor="email">
                    <div className="icon-bg">
                      <Mail size={14} />
                    </div>
                    Email Address
                  </label>
                  <div className="input-container">
                    <input
                      id="email"
                      type="email"
                      value={jury?.email || ''}
                      disabled
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="field-wrapper">
                  <label htmlFor="phone">
                    <div className="icon-bg">
                      <Phone size={14} />
                    </div>
                    Phone Number
                  </label>
                  <div className="input-container">
                    <input
                      id="phone"
                      type="text"
                      value={formData.phone}
                      disabled={!isEditing}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>

                <div className="field-wrapper">
                  <label htmlFor="company">
                    <div className="icon-bg">
                      <Building2 size={14} />
                    </div>
                    Organization
                  </label>
                  <div className="input-container">
                    <input
                      id="company"
                      type="text"
                      value={formData.company}
                      disabled={!isEditing}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Current company or institution"
                    />
                  </div>
                </div>

                <div className="field-wrapper">
                  <label htmlFor="expertise">
                    <div className="icon-bg">
                      <Tags size={14} />
                    </div>
                    Specialisation
                  </label>
                  <div className="input-container">
                    <input
                      id="expertise"
                      type="text"
                      value={formData.expertise}
                      disabled={!isEditing}
                      onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                      placeholder="AI, Blockchain, Fintech"
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
