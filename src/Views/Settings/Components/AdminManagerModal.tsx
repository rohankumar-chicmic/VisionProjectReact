/* eslint-disable jsx-a11y/label-has-associated-control, react/require-default-props */
import { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Check, RefreshCw, Loader2, Shield, Users } from 'lucide-react';
import Modal from '../../../Components/Atom/Modal/Modal';
import {
  useCreateAdminManagerMutation,
  useUpdateAdminManagerMutation,
  useGetAdminByIdQuery,
} from '../../../Services/Api/module/AdminApi';
import {
  createAdminSchema,
  updateAdminSchema,
  AdminFormValues,
} from '../Helpers/AdminValidations';
import './CreateAdminModal.scss';

interface AdminManagerModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly adminId?: string;
}

function AdminManagerModal({
  isOpen,
  onClose,
  onConfirm,
  adminId,
}: AdminManagerModalProps) {
  const isEdit = !!adminId;
  const [createAdmin, { isLoading: isCreating }] =
    useCreateAdminManagerMutation();
  const [updateAdmin, { isLoading: isUpdating }] =
    useUpdateAdminManagerMutation();

  const { data: adminDetail, isLoading: isFetching } = useGetAdminByIdQuery(
    adminId ?? '',
    { skip: !adminId || !isOpen }
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AdminFormValues>({
    resolver: zodResolver(isEdit ? updateAdminSchema : createAdminSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'Sub Admin',
      sendWelcomeEmail: true,
    },
  });

  const role = watch('role');
  const sendWelcomeEmail = watch('sendWelcomeEmail');

  const [permissions, setPermissions] = useState({
    manageUsers: true,
    manageGalas: true,
    reviewApps: true,
    manageAdmins: false,
  });

  useEffect(() => {
    if (isEdit && adminDetail?.data) {
      const {
        fullName,
        email,
        role: rId,
        permissions: pStr,
      } = adminDetail.data;

      const nameParts = fullName.split(' ');
      const fName = nameParts[0] || '';
      const lName = nameParts.slice(1).join(' ') || '';

      reset({
        firstName: fName,
        lastName: lName,
        email,
        role: rId === 1 ? 'Super Admin' : 'Sub Admin',
        password: '',
        sendWelcomeEmail: false,
      });

      if (pStr) {
        try {
          setPermissions(JSON.parse(pStr));
        } catch {
          // Fallback if parsing fails
        }
      }
    } else if (!isOpen) {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'Sub Admin',
        sendWelcomeEmail: true,
      });
    }
  }, [isEdit, adminDetail, reset, isOpen]);

  const generatePassword = () => {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let newPwd = '';
    for (let i = 0; i < 12; i += 1) {
      newPwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setValue('password', newPwd, { shouldValidate: true });
  };

  const togglePermission = (key: keyof typeof permissions) => {
    if (key === 'manageAdmins' && role === 'Sub Admin') return;
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (role === 'Sub Admin' && permissions.manageAdmins) {
      setPermissions((prev) => ({ ...prev, manageAdmins: false }));
    }
  }, [role, permissions.manageAdmins]);

  const onSubmit: SubmitHandler<AdminFormValues> = async (data) => {
    try {
      if (isEdit && adminId) {
        await updateAdmin({
          id: adminId,
          fullName: `${data.firstName} ${data.lastName}`,
          role: data.role === 'Super Admin' ? 1 : 2,
          permissions: JSON.stringify(permissions),
        }).unwrap();
      } else {
        await createAdmin({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password || '',
          role: data.role === 'Super Admin' ? 1 : 2,
          permissions: JSON.stringify(permissions),
          sendWelcomeEmail: data.sendWelcomeEmail ?? false,
          createdByUserId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        }).unwrap();
      }
      onConfirm();
    } catch {
      // Error handling
    }
  };

  const isLoading = isCreating || isUpdating;

  const footer = (
    <div className="modal-actions-footer">
      <button
        type="button"
        className="btn-cancel"
        onClick={onClose}
        disabled={isLoading}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="btn-confirm-admin"
        form="admin-manager-form"
        disabled={isLoading || (isEdit && isFetching)}
      >
        {isLoading ? (
          <Loader2 className="spinner" size={18} />
        ) : (
          <span>{isEdit ? 'Update Admin' : 'Create Admin'}</span>
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Admin Account' : 'Create New Admin Account'}
      subtitle={
        isEdit
          ? 'Modify administrator permissions and details'
          : 'Add a new administrator to manage the platform'
      }
      width="600px"
      footer={footer}
    >
      {isEdit && isFetching ? (
        <div
          className="modal-loading-state"
          style={{ padding: '40px', textAlign: 'center' }}
        >
          <Loader2 className="spinner" size={32} style={{ margin: '0 auto' }} />
          <p style={{ marginTop: '12px', color: '#64748b' }}>
            Fetching admin details...
          </p>
        </div>
      ) : (
        <form
          id="admin-manager-form"
          className="create-admin-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="form-row half-grid">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <Controller
                name="firstName"
                control={control}
                render={({ field: { name, value, onBlur, onChange } }) => (
                  <input
                    id="firstName"
                    type="text"
                    name={name}
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder="Enter first name"
                  />
                )}
              />
              {errors.firstName && (
                <span className="field-error">{errors.firstName.message}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <Controller
                name="lastName"
                control={control}
                render={({ field: { name, value, onBlur, onChange } }) => (
                  <input
                    id="lastName"
                    type="text"
                    name={name}
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder="Enter last name"
                  />
                )}
              />
              {errors.lastName && (
                <span className="field-error">{errors.lastName.message}</span>
              )}
            </div>
          </div>

          <div className="form-group mb-4">
            <label htmlFor="email">Email Address *</label>
            <div className="input-with-icon">
              <Mail size={16} />
              <Controller
                name="email"
                control={control}
                render={({ field: { name, value, onBlur, onChange } }) => (
                  <input
                    id="email"
                    name={name}
                    value={value || ''}
                    onBlur={onBlur}
                    onChange={onChange}
                    type="email"
                    placeholder="admin@example.com"
                    disabled={isEdit}
                  />
                )}
              />
            </div>
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group mb-4">
            <span className="label-style">Admin Role *</span>
            <div className="role-toggles" role="group" aria-label="Admin Role">
              <button
                type="button"
                className={`role-btn ${role === 'Sub Admin' ? 'active-sub' : ''}`}
                onClick={() => setValue('role', 'Sub Admin')}
              >
                <Users size={16} />
                <span>Sub Admin</span>
              </button>
              <button
                type="button"
                className={`role-btn ${
                  role === 'Super Admin' ? 'active-super' : ''
                }`}
                onClick={() => setValue('role', 'Super Admin')}
              >
                <Shield size={16} />
                <span>Super Admin</span>
              </button>
            </div>
            {errors.role && (
              <span className="field-error">{errors.role.message}</span>
            )}
          </div>

          {!isEdit && (
            <div className="form-group mb-4">
              <label htmlFor="password">Password *</label>
              <div className="password-generate-wrap">
                <Controller
                  name="password"
                  control={control}
                  render={({ field: { name, value, onBlur, onChange } }) => (
                    <input
                      id="password"
                      name={name}
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      type="text"
                      placeholder="Auto-generate secure password"
                    />
                  )}
                />
                <button
                  type="button"
                  className="btn-generate"
                  onClick={generatePassword}
                >
                  <RefreshCw size={14} />
                  <span>Generate</span>
                </button>
              </div>
              {errors.password && (
                <span className="field-error">{errors.password.message}</span>
              )}
            </div>
          )}

          <div className="form-group permissions-group mb-4">
            <span className="label-style">Permissions</span>
            <div className="permission-items">
              <button
                type="button"
                className="perm-row"
                onClick={() => togglePermission('manageUsers')}
              >
                <div
                  className={`checkbox ${permissions.manageUsers ? 'checked' : ''}`}
                >
                  <Check
                    size={14}
                    className={permissions.manageUsers ? 'block' : 'hidden'}
                    strokeWidth={3}
                  />
                </div>
                <span>Manage Users</span>
              </button>
              <button
                type="button"
                className="perm-row"
                onClick={() => togglePermission('manageGalas')}
              >
                <div
                  className={`checkbox ${permissions.manageGalas ? 'checked' : ''}`}
                >
                  <Check
                    size={14}
                    className={permissions.manageGalas ? 'block' : 'hidden'}
                    strokeWidth={3}
                  />
                </div>
                <span>Manage Galas & Grants</span>
              </button>
              <button
                type="button"
                className="perm-row"
                onClick={() => togglePermission('reviewApps')}
              >
                <div
                  className={`checkbox ${permissions.reviewApps ? 'checked' : ''}`}
                >
                  <Check
                    size={14}
                    className={permissions.reviewApps ? 'block' : 'hidden'}
                    strokeWidth={3}
                  />
                </div>
                <span>Review Applications</span>
              </button>
              <button
                type="button"
                className={`perm-row ${role === 'Sub Admin' ? 'disabled' : ''}`}
                disabled={role === 'Sub Admin'}
                onClick={() => togglePermission('manageAdmins')}
              >
                <div
                  className={`checkbox ${
                    permissions.manageAdmins ? 'checked disabled' : ''
                  } ${role === 'Sub Admin' ? 'disabled' : ''}`}
                >
                  <Check
                    size={14}
                    className={permissions.manageAdmins ? 'block' : 'hidden'}
                    strokeWidth={3}
                  />
                </div>
                <span>
                  Manage Admins <small>(Super Admin only)</small>
                </span>
              </button>
            </div>
          </div>

          {!isEdit && (
            <div className="form-group mt-2">
              <button
                type="button"
                className="perm-row styled"
                onClick={() =>
                  setValue('sendWelcomeEmail', !sendWelcomeEmail, {
                    shouldValidate: true,
                  })
                }
              >
                <div
                  className={`checkbox styled-check ${
                    sendWelcomeEmail ? 'checked' : ''
                  }`}
                >
                  <Check
                    size={14}
                    className={sendWelcomeEmail ? 'block' : 'hidden'}
                    strokeWidth={3}
                  />
                </div>
                <span className="bold-sp">
                  Send welcome email with login credentials
                </span>
              </button>
            </div>
          )}
        </form>
      )}
    </Modal>
  );
}

export default AdminManagerModal;
