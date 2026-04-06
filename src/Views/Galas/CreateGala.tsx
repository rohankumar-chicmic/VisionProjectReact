/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState, useRef } from 'react';
import {
  Upload,
  Calendar,
  MapPin,
  Clock,
  Users,
  Trophy,
  Plus,
  Trash2,
  Trash,
  Save,
  Send,
  RefreshCcw,
  Pencil,
  Eye,
  Link2,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  Resolver,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import {
  useCreateGalaMutation,
  useGetGalaByIdQuery,
  useUpdateGalaMutation,
} from '../../Services/Api/module/GalaApi';
import { useUploadFileMutation } from '../../Services/Api/module/CommonApi';
import EveningProgramModal from './Components/EveningProgramModal';
import './CreateGala.scss';

const galaSchema = z.object({
  name: z.string().min(1, { message: 'Event name is required' }),
  about: z.string().min(1, { message: 'About event is required' }),
  coverImageUrl: z.string().min(1, { message: 'Cover image is required' }),
  status: z.number().int(),
  eventDate: z.string().min(1, { message: 'Event date is required' }),
  eventTime: z.string().min(1, { message: 'Event time is required' }),
  venue: z.string().min(1, { message: 'Venue/Location is required' }),
  city: z.string().optional().or(z.literal('')),
  expectedAttendees: z.coerce
    .number()
    .int()
    .min(0, { message: 'Must be 0 or more' }),
  totalPrizePool: z.coerce.number().min(0, { message: 'Must be 0 or more' }),
  eveningItems: z.array(
    z.object({
      time: z.string().min(1, { message: 'Time is required' }),
      title: z.string().min(1, { message: 'Title is required' }),
      description: z.string().optional().or(z.literal('')),
    })
  ),
});

type GalaFormValues = z.infer<typeof galaSchema>;

function CreateGala() {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [createGala, { isLoading: isCreating }] = useCreateGalaMutation();
  const [updateGala, { isLoading: isUpdatingGala }] = useUpdateGalaMutation();
  const { data: galaDetail, isLoading: isLoadingGala } = useGetGalaByIdQuery(
    id!,
    { skip: !id }
  );
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal State
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [editingProgramIndex, setEditingProgramIndex] = useState<number | null>(
    null
  );

  const [defaultValues] = useState<GalaFormValues>(() => ({
    name: '',
    about: '',
    coverImageUrl: '',
    status: 0,
    eventDate: '',
    eventTime: '',
    venue: '',
    city: '',
    expectedAttendees: 0,
    totalPrizePool: 0,
    eveningItems: [],
  }));

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<GalaFormValues>({
    resolver: zodResolver(galaSchema) as Resolver<GalaFormValues>,
    defaultValues,
  });

  const { append, remove, update } = useFieldArray({
    control,
    name: 'eveningItems',
  });

  const eveningItems = watch('eveningItems');
  const currentStatus = watch('status');

  useEffect(() => {
    setTitle(isEditMode ? 'Edit Gala Event' : 'Create New Gala Event');
    setSubtitle(
      isEditMode
        ? 'Update event details, Grants, and evening program'
        : 'Set up event details, Grants, and evening program'
    );
    setBackAction(true, () => navigate('/galas'));

    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader, navigate, isEditMode]);

  // Populate form in edit mode
  useEffect(() => {
    if (isEditMode && galaDetail?.data) {
      const { data } = galaDetail;
      reset({
        name: data.name,
        about: data.about,
        coverImageUrl: data.coverImageUrl,
        status: data.status,
        eventDate: data.eventDate ? data.eventDate.split('T')[0] : '',
        eventTime: data.eventTime,
        venue: data.venue,
        city: data.city || '',
        expectedAttendees: data.expectedAttendees,
        totalPrizePool: data.totalPrizePool,
        eveningItems: data.eveningItems.map((item) => ({
          time: item.time,
          title: item.title,
          description: item.description,
        })),
      });
      setImagePreview(data.coverImageUrl);
    }
  }, [isEditMode, galaDetail, reset]);

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await uploadFile(formData).unwrap();
      if (response.success && response.data) {
        setValue('coverImageUrl', response.data, { shouldValidate: true });
        setImagePreview(response.data);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Upload failed:', err);
    }
  };

  // Mock Grants for UI representation
  const mockGrants = [
    {
      id: '1',
      title: 'Innovation Technology Grant',
      amount: 5000,
      date: 'Mar 31',
    },
    {
      id: '2',
      title: 'Social Entrepreneurship Grant',
      amount: 5000,
      date: 'Mar 31',
    },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleProgramSubmit = (data: {
    time: string;
    title: string;
    description?: string;
  }) => {
    if (editingProgramIndex === null) {
      append(data);
    } else {
      update(editingProgramIndex, data);
    }
    setEditingProgramIndex(null);
    setIsProgramModalOpen(false);
  };

  const openEditProgram = (index: number) => {
    setEditingProgramIndex(index);
    setIsProgramModalOpen(true);
  };

  const onSubmit: SubmitHandler<GalaFormValues> = async (data) => {
    try {
      if (isEditMode && id) {
        await updateGala({ ...data, id }).unwrap();
      } else {
        await createGala(data).unwrap();
      }
      navigate('/galas');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to submit gala:', err);
    }
  };

  const getSubmitButtonLabel = () => {
    if (isCreating || isUpdatingGala) return 'Saving...';
    if (isEditMode) return 'Update Gala';
    return 'Publish';
  };

  return (
    <div className="create-gala-page">
      <form id="create-gala-form" onSubmit={handleSubmit(onSubmit)}>
        <HeaderActions>
          <button
            type="button"
            className="header-btn btn-danger-soft"
            onClick={() => navigate('/galas')}
          >
            <Trash size={18} />
            <span>Trash</span>
          </button>
          <button type="button" className="header-btn btn-outline">
            <Save size={18} />
            <span>Save Draft</span>
          </button>
          <button
            type="submit"
            form="create-gala-form"
            className="header-btn btn-primary"
            disabled={isCreating || isUpdatingGala || isLoadingGala}
          >
            <Send size={18} />
            <span>{getSubmitButtonLabel()}</span>
          </button>
        </HeaderActions>

        <div className="gala-form-centered-wrapper">
          <div className="gala-form-container">
            <section className="form-card">
              <div className="card-header">
                <h3>Event Information</h3>
                <p>Basic details about the gala event</p>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="gala-name-input">
                    <span>Event Name *</span>
                    <input
                      id="gala-name-input"
                      type="text"
                      {...register('name')}
                      placeholder="e.g., Gala Vision Montréal 2026"
                      className={errors.name ? 'error' : ''}
                    />
                  </label>
                  {errors.name && (
                    <span className="error-message">{errors.name.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="gala-about-input">
                    <span>About Event *</span>
                    <textarea
                      id="gala-about-input"
                      {...register('about')}
                      placeholder="The biggest entrepreneurial event of the year..."
                      rows={4}
                      className={errors.about ? 'error' : ''}
                    />
                  </label>
                  {errors.about && (
                    <span className="error-message">
                      {errors.about.message}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="gala-cover-file">
                    <span>Event Cover Image *</span>
                    <input
                      id="gala-cover-file"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                  </label>
                  <button
                    id="gala-cover-dropbox"
                    type="button"
                    className={`dropzone-area ${imagePreview ? 'has-image' : ''} ${isUploading ? 'uploading' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    aria-describedby="upload-instructions"
                  >
                    {isUploading ? (
                      <div className="upload-spinner-container">
                        <RefreshCcw className="animate-spin" size={32} />
                        <p>Uploading image...</p>
                      </div>
                    ) : (
                      <>
                        {!imagePreview && (
                          <div className="upload-placeholder">
                            <Upload size={32} />
                            <p id="upload-instructions">
                              Click to upload or drag and drop
                            </p>
                            <span>PNG, JPG up to 10MB</span>
                          </div>
                        )}
                        {imagePreview && (
                          <div className="image-preview-container">
                            <img src={imagePreview} alt="Preview" />
                            <div className="image-overlay">
                              <Upload size={24} />
                              <span>Change Image</span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </button>
                </div>
                {errors.coverImageUrl && (
                  <span className="error-message">
                    {errors.coverImageUrl.message}
                  </span>
                )}
                <div className="form-group">
                  <span className="label-fake">Event Status *</span>
                  <div className="status-tabs" id="status-selection-box">
                    <button
                      id="status-btn-upcoming"
                      type="button"
                      className={`status-tab ${currentStatus === 0 ? 'active' : ''}`}
                      onClick={() => setValue('status', 0)}
                    >
                      <Clock size={16} />
                      <span>Upcoming</span>
                    </button>
                    <button
                      type="button"
                      className={`status-tab ${currentStatus === 1 ? 'active' : ''}`}
                      onClick={() => setValue('status', 1)}
                    >
                      <RefreshCcw size={16} />
                      <span>Active</span>
                    </button>
                    <button
                      type="button"
                      className={`status-tab ${currentStatus === 2 ? 'active' : ''}`}
                      onClick={() => setValue('status', 2)}
                    >
                      <Trophy size={16} />
                      <span>Completed</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="form-card">
              <div className="card-header">
                <h3>Date, Time & Location</h3>
                <p>When and where the event will take place</p>
              </div>
              <div className="card-body">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="gala-event-date">
                      <span>Event Date *</span>
                      <div className="input-with-icon">
                        <Calendar size={18} />
                        <input
                          id="gala-event-date"
                          type="date"
                          {...register('eventDate')}
                          className={errors.eventDate ? 'error' : ''}
                        />
                      </div>
                    </label>
                    {errors.eventDate && (
                      <span className="error-message">
                        {errors.eventDate.message}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="gala-event-time">
                      <span>Event Time *</span>
                      <div className="input-with-icon">
                        <Clock size={18} />
                        <input
                          id="gala-event-time"
                          type="time"
                          {...register('eventTime')}
                          className={errors.eventTime ? 'error' : ''}
                        />
                      </div>
                    </label>
                    {errors.eventTime && (
                      <span className="error-message">
                        {errors.eventTime.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="gala-venue-input">
                    <span>Venue/Location *</span>
                    <div className="input-with-icon">
                      <MapPin size={18} />
                      <input
                        id="gala-venue-input"
                        type="text"
                        {...register('venue')}
                        placeholder="Palais des congrès, Montréal"
                        className={errors.venue ? 'error' : ''}
                      />
                    </div>
                  </label>
                  {errors.venue && (
                    <span className="error-message">
                      {errors.venue.message}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="gala-city-input">
                    <span>City/Region</span>
                    <input
                      id="gala-city-input"
                      type="text"
                      {...register('city')}
                      placeholder="Montreal, QC"
                    />
                  </label>
                </div>
              </div>
            </section>

            {/* Participants & Prize Pool */}
            <section className="form-card">
              <div className="card-header">
                <h3>Participants & Prize Pool</h3>
                <p>Expected attendees and grant prize pool</p>
              </div>
              <div className="card-body">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expected-attendees-count">
                      <span>Expected Attendees *</span>
                      <div className="input-with-icon">
                        <Users size={18} />
                        <input
                          id="expected-attendees-count"
                          type="number"
                          {...register('expectedAttendees')}
                          placeholder="245"
                          className={errors.expectedAttendees ? 'error' : ''}
                        />
                      </div>
                    </label>
                    {errors.expectedAttendees && (
                      <span className="error-message">
                        {errors.expectedAttendees.message}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="total-prize-pool-amount">
                      <span>Total Prize Pool ($) *</span>
                      <div className="input-with-icon">
                        <Trophy size={18} />
                        <input
                          id="total-prize-pool-amount"
                          type="number"
                          step="0.01"
                          {...register('totalPrizePool')}
                          placeholder="15000"
                          className={errors.totalPrizePool ? 'error' : ''}
                        />
                      </div>
                    </label>
                    {errors.totalPrizePool && (
                      <span className="error-message">
                        {errors.totalPrizePool.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Evening Program */}
            <section className="form-card section-program">
              <div className="card-header flex-header">
                <div className="header-text">
                  <h3>Evening Program</h3>
                  <p>Schedule of activities and sessions</p>
                </div>
                <button
                  type="button"
                  className="btn-add-item-header"
                  onClick={() => {
                    setEditingProgramIndex(null);
                    setIsProgramModalOpen(true);
                  }}
                >
                  <Plus size={16} />
                  <span>Add Item</span>
                </button>
              </div>
              <div className="card-body">
                <div className="program-items-list">
                  {eveningItems.map((item, index) => (
                    <div key={item.title} className="program-item-card-premium">
                      <div className="time-badge">
                        <span>{item.time}</span>
                      </div>
                      <div className="item-content">
                        <h4>{item.title}</h4>
                        <p>{item.description || 'No description provided'}</p>
                      </div>
                      <div className="item-actions">
                        <button
                          type="button"
                          className="action-btn-edit"
                          onClick={() => openEditProgram(index)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className="action-btn-delete"
                          onClick={() => remove(index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {eveningItems.length === 0 && (
                    <div className="empty-state-card">
                      <p>
                        No programs added yet. Click &quot;Add Item&quot; to
                        start.
                      </p>
                    </div>
                  )}
                </div>
                {errors.eveningItems && (
                  <span className="error-message">
                    Please add at least one program item
                  </span>
                )}
              </div>
            </section>

            {/* Associated Grants */}
            <section className="form-card section-grants">
              <div className="card-header flex-header">
                <div className="header-text">
                  <h3>Associated Grants</h3>
                  <p>Grants available for this gala</p>
                </div>
                <button type="button" className="btn-add-item-header">
                  <Plus size={16} />
                  <span>Link Grant</span>
                </button>
              </div>
              <div className="card-body">
                <div className="grants-items-list">
                  {mockGrants.map((grant) => (
                    <div key={grant.id} className="grant-item-card-premium">
                      <div className="grant-icon-badge">
                        <Trophy size={20} />
                      </div>
                      <div className="item-content">
                        <h4>{grant.title}</h4>
                        <div className="grant-meta">
                          <span className="amount">
                            $ {grant.amount.toLocaleString()}
                          </span>
                          <span className="dot">•</span>
                          <span className="date">{grant.date}</span>
                        </div>
                      </div>
                      <div className="item-actions">
                        <button type="button" className="action-btn-view">
                          <Eye size={16} />
                        </button>
                        <button type="button" className="action-btn-link">
                          <Link2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </form>

      <EveningProgramModal
        isOpen={isProgramModalOpen}
        onClose={() => {
          setIsProgramModalOpen(false);
          setEditingProgramIndex(null);
        }}
        onSubmit={handleProgramSubmit}
        initialData={
          editingProgramIndex === null
            ? null
            : eveningItems[editingProgramIndex]
        }
      />
    </div>
  );
}

export default CreateGala;
