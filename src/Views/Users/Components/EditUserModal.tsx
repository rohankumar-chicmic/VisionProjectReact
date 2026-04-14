import { useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Briefcase, Loader2, User, Phone } from 'lucide-react';
import Modal from '../../../Components/Atom/Modal/Modal';
import { editUserSchema, EditUserFormValues } from '../Helpers/UserValidations';
import { useUpdateAdminUserMutation } from '../../../Services/Api/module/Admin/User';
import showToast from '../../../Shared/Utils/toast';
import './UserModals.scss';

interface EditUserModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly userId: string;
  readonly userData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    companyName?: string;
  };
}

function EditUserModal({
  isOpen,
  onClose,
  onConfirm,
  userId,
  userData,
}: EditUserModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      email: userData?.email || '',
      companyName: userData?.companyName || '',
      phoneNumber: userData?.phoneNumber || '',
    },
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateAdminUserMutation();

  useEffect(() => {
    if (isOpen) {
      reset({
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        email: userData?.email || '',
        companyName: userData?.companyName || '',
        phoneNumber: userData?.phoneNumber || '',
      });
    }
  }, [isOpen, userData, reset]);

  const onSubmit: SubmitHandler<EditUserFormValues> = async (data) => {
    try {
      await updateUser({
        id: userId,
        ...data,
      }).unwrap();

      showToast.success('User profile updated successfully');
      onConfirm();
    } catch (error) {
      showToast.error(
        error instanceof Error ? error.message : 'Failed to update user profile'
      );
    }
  };

  const footer = (
    <div className="modal-actions-footer">
      <button
        type="button"
        className="btn-cancel"
        onClick={onClose}
        disabled={isUpdating}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="btn-confirm-admin"
        form="edit-user-form"
        disabled={isUpdating}
      >
        {isUpdating ? (
          <Loader2 className="spinner" size={18} />
        ) : (
          <span>Update Profile</span>
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User Profile"
      subtitle="Modify account details and business information"
      width="600px"
      footer={footer}
    >
      <form
        id="edit-user-form"
        className="create-admin-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div
          className="form-row"
          style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}
        >
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="firstName">
              <span className="label-text">First Name *</span>
              <div className="input-with-icon">
                <User size={16} />
                <Controller
                  name="firstName"
                  control={control}
                  render={({
                    field: { name, value, onBlur, onChange, ref },
                  }) => (
                    <input
                      id="firstName"
                      name={name}
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      ref={ref}
                      type="text"
                      placeholder="First name"
                    />
                  )}
                />
              </div>
              {errors.firstName && (
                <span className="field-error">{errors.firstName.message}</span>
              )}
            </label>
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="lastName">
              <span className="label-text">Last Name *</span>
              <div className="input-with-icon">
                <User size={16} />
                <Controller
                  name="lastName"
                  control={control}
                  render={({
                    field: { name, value, onBlur, onChange, ref },
                  }) => (
                    <input
                      id="lastName"
                      name={name}
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      ref={ref}
                      type="text"
                      placeholder="Last name"
                    />
                  )}
                />
              </div>
              {errors.lastName && (
                <span className="field-error">{errors.lastName.message}</span>
              )}
            </label>
          </div>
        </div>

        <div className="form-group mb-4">
          <label htmlFor="email">
            <span className="label-text">Email Address *</span>
            <div className="input-with-icon">
              <Mail size={16} />
              <Controller
                name="email"
                control={control}
                render={({ field: { name, value, onBlur, onChange, ref } }) => (
                  <input
                    id="email"
                    name={name}
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={onChange}
                    ref={ref}
                    type="email"
                    placeholder="user@example.com"
                  />
                )}
              />
            </div>
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </label>
        </div>

        <div className="form-group mb-4">
          <label htmlFor="phoneNumber">
            <span className="label-text">Phone Number</span>
            <div className="input-with-icon">
              <Phone size={16} />
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field: { name, value, onBlur, onChange, ref } }) => (
                  <input
                    id="phoneNumber"
                    name={name}
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={onChange}
                    ref={ref}
                    type="text"
                    placeholder="+1 (555) 000-0000"
                  />
                )}
              />
            </div>
            {errors.phoneNumber && (
              <span className="field-error">{errors.phoneNumber.message}</span>
            )}
          </label>
        </div>

        <div className="form-group mb-4">
          <label htmlFor="companyName">
            <span className="label-text">Business Name</span>
            <div className="input-with-icon">
              <Briefcase size={16} />
              <Controller
                name="companyName"
                control={control}
                render={({ field: { name, value, onBlur, onChange, ref } }) => (
                  <input
                    id="companyName"
                    name={name}
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={onChange}
                    ref={ref}
                    type="text"
                    placeholder="Enter business name"
                  />
                )}
              />
            </div>
            {errors.companyName && (
              <span className="field-error">{errors.companyName.message}</span>
            )}
          </label>
        </div>
      </form>
    </Modal>
  );
}

export default EditUserModal;
