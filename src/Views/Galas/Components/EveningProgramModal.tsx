/* eslint-disable react/jsx-props-no-spreading */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Clock, Type, AlignLeft, AlertCircle } from 'lucide-react';
import Modal from '../../../Components/Atom/Modal/Modal';
import './EveningProgramModal.scss';

const programItemSchema = z.object({
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Enter a valid time in HH:MM format',
  }),
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional().or(z.literal('')),
});

type ProgramItemValues = z.infer<typeof programItemSchema>;

interface EveningProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProgramItemValues) => void;
  initialData?: ProgramItemValues | null;
}

function EveningProgramModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}: Readonly<EveningProgramModalProps>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProgramItemValues>({
    resolver: zodResolver(programItemSchema),
    defaultValues: {
      time: '',
      title: '',
      description: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ time: '', title: '', description: '' });
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = (data: ProgramItemValues) => {
    onSubmit(data);
    onClose();
  };

  const footer = (
    <div className="modal-footer-actions">
      <button type="button" className="modal-btn secondary" onClick={onClose}>
        Cancel
      </button>
      <button
        type="submit"
        form="program-item-form"
        className="modal-btn primary"
      >
        {initialData ? 'Save Changes' : 'Add Item'}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Program Item' : 'Add Program Item'}
      subtitle="Schedule an activity for the evening program"
      footer={footer}
      className="evening-program-modal"
    >
      <form id="program-item-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="form-content">
          <div className="form-group">
            <label htmlFor="item-time">
              <span className="label-text">
                Time <span className="required-indicator">*</span>
              </span>
              <div className="input-with-icon">
                <Clock size={18} />
                <input
                  id="item-time"
                  type="time"
                  step="60"
                  {...register('time')}
                  placeholder="HH:MM"
                  className={errors.time ? 'error' : ''}
                />
              </div>
            </label>
            {errors.time && (
              <div className="error-message">
                <AlertCircle size={12} />
                {errors.time.message}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="item-title">
              <span className="label-text">
                Activity Title <span className="required-indicator">*</span>
              </span>
              <div className="input-with-icon">
                <Type size={18} />
                <input
                  id="item-title"
                  type="text"
                  {...register('title')}
                  placeholder="e.g. Welcome Cocktail"
                  className={errors.title ? 'error' : ''}
                />
              </div>
            </label>
            {errors.title && (
              <div className="error-message">
                <AlertCircle size={12} />
                {errors.title.message}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="item-description">
              <span className="label-text">Activity Details</span>
              <div className="input-with-icon align-top">
                <AlignLeft size={18} />
                <textarea
                  id="item-description"
                  {...register('description')}
                  placeholder="Describe this activity..."
                  rows={3}
                />
              </div>
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default EveningProgramModal;
