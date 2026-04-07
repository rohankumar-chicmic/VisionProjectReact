/* eslint-disable jsx-a11y/label-has-associated-control, react/require-default-props */
import { useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Briefcase, Loader2, User } from 'lucide-react';
import Modal from '../../../Components/Atom/Modal/Modal';
import { editUserSchema, EditUserFormValues } from '../Helpers/UserValidations';
import './UserModals.scss';

interface EditUserModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly userData?: {
    fullName: string;
    email: string;
    companyName?: string;
  };
}

function EditUserModal({
  isOpen,
  onClose,
  onConfirm,
  userData = { fullName: '', email: '', companyName: '' },
}: EditUserModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      fullName: '',
      email: '',
      companyName: '',
    },
  });

  useEffect(() => {
    if (isOpen && userData) {
      reset({
        fullName: userData.fullName,
        email: userData.email,
        companyName: userData.companyName || '',
      });
    }
  }, [isOpen, userData, reset]);

  const onSubmit: SubmitHandler<EditUserFormValues> = async (data) => {
    // Future Ready: Simulate API call
    // eslint-disable-next-line no-console
    console.log('Simulating User Update with data:', data);
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 1500);
    });
    onConfirm();
  };

  const footer = (
    <div className="modal-actions-footer">
      <button
        type="button"
        className="btn-cancel"
        onClick={onClose}
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="btn-confirm-admin"
        form="edit-user-form"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
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
        <div className="form-group mb-4">
          <label htmlFor="fullName">Full Name *</label>
          <div className="input-with-icon">
            <User size={16} />
            <Controller
              name="fullName"
              control={control}
              render={({ field: { name, value, onBlur, onChange, ref } }) => (
                <input
                  id="fullName"
                  name={name}
                  value={value || ''}
                  onBlur={onBlur}
                  onChange={onChange}
                  ref={ref}
                  type="text"
                  placeholder="Enter full name"
                />
              )}
            />
          </div>
          {errors.fullName && (
            <span className="field-error">{errors.fullName.message}</span>
          )}
        </div>

        <div className="form-group mb-4">
          <label htmlFor="email">Email Address *</label>
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
        </div>

        <div className="form-group mb-4">
          <label htmlFor="companyName">Business Name</label>
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
        </div>
      </form>
    </Modal>
  );
}

export default EditUserModal;
