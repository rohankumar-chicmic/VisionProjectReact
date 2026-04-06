/* eslint-disable react/jsx-props-no-spreading */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Clock, Type, AlignLeft } from 'lucide-react';
import Modal from '../../../Components/Atom/Modal/Modal';

const programItemSchema = z.object({
  time: z.string().min(1, { message: 'Time is required' }),
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
      subtitle="Enter details for the evening schedule"
      footer={footer}
    >
      <form id="program-item-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="form-group mb-4">
          <label htmlFor="item-time">
            Time *
            <div className="input-with-icon">
              <Clock size={18} />
              <input
                id="item-time"
                type="text"
                {...register('time')}
                placeholder="e.g. 18:00 or 16h00"
                className={errors.time ? 'error' : ''}
              />
            </div>
          </label>
          {errors.time && (
            <span className="error-message">{errors.time.message}</span>
          )}
        </div>

        <div className="form-group mb-4">
          <label htmlFor="item-title">
            Title *
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
            <span className="error-message">{errors.title.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="item-description">
            Description
            <div className="input-with-icon align-top">
              <AlignLeft size={18} className="mt-2" />
              <textarea
                id="item-description"
                {...register('description')}
                placeholder="Describe this activity..."
                rows={3}
              />
            </div>
          </label>
        </div>
      </form>
    </Modal>
  );
}

export default EveningProgramModal;
