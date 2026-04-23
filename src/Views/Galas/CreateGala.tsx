/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useMemo, useRef, useState } from 'react';
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
  Gift,
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Resolver, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import GalaActionOverlay from './Components/GalaActionOverlay';
import { HeaderActions, useHeader } from '../../Shared/Context/HeaderContext';
import {
  useCreateOrganiserGalaWithGrantsMutation,
  useGetOrganiserGalaByIdQuery,
  usePublishOrganiserGalaMutation,
  useUpdateOrganiserGalaMutation,
} from '../../Services/Api/module/Organiser/Gala';
import { useGetOrganiserProfileQuery } from '../../Services/Api/module/Organiser/Profile';
import { useUploadFileMutation } from '../../Services/Api/module/Common';
import { createGrantPlatformTransaction } from '../../Services/WalletConnect';
import EveningProgramModal from './Components/EveningProgramModal';
import { getAssetUrl } from '../../Shared/Utils/url';
import { formatDateTimeShort } from '../../Shared/Utils/dateUtils';
import { toDateInputValue } from '../Grants/CreateGrant/utils';
import showToast from '../../Shared/Utils/toast';
import './CreateGala.scss';

const questionSchema = z.object({
  questionText: z.string().min(1),
  questionType: z.string().min(1),
  order: z.number().int().min(0).optional(),
});

const requirementSchema = z.object({
  text: z.string().min(1),
  order: z.number().int().min(0).optional(),
});

const grantSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, { message: 'Grant name is required' }),
  description: z.string().min(1, { message: 'Grant description is required' }),
  category: z.string().min(1, { message: 'Grant category is required' }),
  prizeAmount: z.coerce
    .number()
    .min(0, { message: 'Prize amount must be 0 or more' }),
  numberOfPrizes: z.coerce
    .number()
    .int()
    .min(1, { message: 'At least one prize is required' })
    .max(5, { message: 'Maximum 5 prizes allowed' }),
  juryPanelSize: z.coerce.number().int().min(1).optional(),
  applicationDeadline: z
    .string()
    .min(1, { message: 'Application deadline is required' }),
  status: z.number().int(),
  requireInterview: z.boolean(),
  requireCompanyName: z.boolean(),
  requireIndustrySelection: z.boolean(),
  requireMotivationStatement: z.boolean(),
  requireBusinessPlanDocument: z.boolean(),
  juryCriteria: z.array(z.number().int()),
  questions: z.array(questionSchema).optional(),
  additionalRequirements: z.array(requirementSchema).optional(),
  prizeWinners: z
    .array(z.object({ rank: z.number(), amount: z.number() }))
    .optional(),
  juryIds: z.array(z.string()).optional(),
});

const galaSchema = z.object({
  name: z.string().min(1, { message: 'Event name is required' }),
  about: z.string().min(1, { message: 'About event is required' }),
  coverImageUrl: z.string().min(1, { message: 'Cover image is required' }),
  status: z.number().int(),
  eventDate: z.string().min(1, { message: 'Event date is required' }),
  eventTime: z.string().min(1, { message: 'Event time is required' }),
  venue: z.string().min(1, { message: 'Venue / location is required' }),
  city: z.string().min(1, { message: 'City / region is required' }),
  expectedAttendees: z.coerce
    .number()
    .int()
    .min(0, { message: 'Must be 0 or more' }),
  eveningItems: z.array(
    z.object({
      time: z.string().min(1, { message: 'Time is required' }),
      title: z.string().min(1, { message: 'Title is required' }),
      description: z.string().optional().or(z.literal('')),
    })
  ),
  grants: z.array(grantSchema),
});

type GalaFormValues = z.infer<typeof galaSchema>;
type SubmitIntent = 'draft' | 'publish';

const CREATE_GALA_FORM_SESSION_KEY = 'create_gala_form_state';
const CREATE_GRANT_FORM_SESSION_KEY = 'create_grant_form_state';

const toUtcIsoString = (localDateStr: string) => {
  if (!localDateStr) return '';
  const d = new Date(localDateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString();
};

function CreateGala() {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [createOrganiserGalaWithGrants, { isLoading: isCreating }] =
    useCreateOrganiserGalaWithGrantsMutation();
  const [updateGala, { isLoading: isUpdatingGala }] =
    useUpdateOrganiserGalaMutation();
  const [publishGala, { isLoading: isPublishingGala }] =
    usePublishOrganiserGalaMutation();
  const { data: galaDetail, isLoading: isLoadingGala } =
    useGetOrganiserGalaByIdQuery(id!, { skip: !id });
  const { data: profileRes } = useGetOrganiserProfileQuery();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const isVerified = profileRes?.data?.verificationStatus === 'Verified';

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tempImagePreview, setTempImagePreview] = useState<string | null>(null);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [editingProgramIndex, setEditingProgramIndex] = useState<number | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRestored, setIsRestored] = useState(false);
  const [isLocalPublishing, setIsLocalPublishing] = useState(false);
  const isAbortedRef = useRef(false);
  const publishPromiseRef = useRef<{
    abort: () => void;
    unwrap: () => Promise<unknown>;
  } | null>(null);

  const handleCancelPublishing = () => {
    isAbortedRef.current = true;
    setIsLocalPublishing(false);
    if (publishPromiseRef.current) {
      publishPromiseRef.current.abort();
    }
    showToast.info('Publishing procedure cancelled.');
  };

  const defaultValues: GalaFormValues = useMemo(
    () => ({
      name: '',
      about: '',
      coverImageUrl: '',
      status: 1,
      eventDate: '',
      eventTime: '',
      venue: '',
      city: '',
      expectedAttendees: 0,
      eveningItems: [],
      grants: [],
    }),
    []
  );

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

  const {
    fields: eveningProgramFields,
    append: appendProgram,
    remove: removeProgram,
    update: updateProgram,
  } = useFieldArray({
    control,
    name: 'eveningItems',
  });

  const eveningItems = watch('eveningItems');
  const grants = watch('grants');
  const coverImageUrl = watch('coverImageUrl');
  const formValues = watch();
  const activeImagePreview = tempImagePreview || imagePreview;
  const isSubmitting = isCreating || isUpdatingGala || isPublishingGala;

  const totalPrizePool = useMemo(
    () =>
      grants.reduce(
        (total, grant) => total + (Number(grant.prizeAmount) || 0),
        0
      ),
    [grants]
  );

  useEffect(() => {
    setTitle(isEditMode ? 'Edit Gala Event' : 'Create New Gala Event');
    setSubtitle(
      isEditMode
        ? 'Update event details and review linked grants'
        : 'Set up event details, Grants, and evening program'
    );
    setBackAction(true, () => navigate('/galas'));

    return () => resetHeader();
  }, [isEditMode, navigate, resetHeader, setBackAction, setSubtitle, setTitle]);

  useEffect(() => {
    if (!isEditMode) {
      const savedState = sessionStorage.getItem(CREATE_GALA_FORM_SESSION_KEY);

      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState) as GalaFormValues;
          reset({ ...defaultValues, ...parsedState });
          setImagePreview(parsedState.coverImageUrl || null);
        } catch (error: unknown) {
          // Fail silently - user can start fresh if draft is corrupted
        }
      }

      setIsRestored(true);
      return;
    }

    if (galaDetail?.data) {
      const { data } = galaDetail;
      reset({
        name: data.name,
        about: data.about,
        coverImageUrl: data.coverImageUrl,
        status: data.status,
        eventDate: data.eventDate
          ? new Date(data.eventDate).toLocaleDateString('en-CA')
          : '',
        eventTime: data.eventDate
          ? new Date(data.eventDate).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })
          : data.eventTime,
        venue: data.venue,
        city: data.city || '',
        expectedAttendees: data.expectedAttendees,
        eveningItems: data.eveningItems.map((item) => ({
          time: item.time,
          title: item.title,
          description: item.description,
        })),
        grants:
          data.grants.length > 0
            ? data.grants.map((grant) => ({
                id: grant.id,
                name: grant.name,
                description: grant.description,
                category: grant.category,
                prizeAmount: grant.prizeAmount,
                numberOfPrizes: grant.numberOfPrizes,
                juryPanelSize: 3,
                applicationDeadline: grant.applicationDeadline
                  ? toDateInputValue(grant.applicationDeadline)
                  : '',
                status: grant.status,
                requireInterview: grant.requireInterview,
                requireCompanyName: grant.requireCompanyName,
                requireIndustrySelection: grant.requireIndustrySelection,
                requireMotivationStatement: grant.requireMotivationStatement,
                requireBusinessPlanDocument: grant.requireBusinessPlanDocument,
                juryCriteria: grant.juryCriteria.map(
                  (criteria) => criteria.type
                ),
                questions: grant.questions || [],
                additionalRequirements: grant.additionalRequirements || [],
              }))
            : [],
      });
      setImagePreview(data.coverImageUrl);
      setIsRestored(true);
    }
  }, [defaultValues, galaDetail, isEditMode, reset]);

  useEffect(() => {
    if (!isEditMode && isRestored) {
      sessionStorage.setItem(
        CREATE_GALA_FORM_SESSION_KEY,
        JSON.stringify(formValues)
      );
    }
  }, [formValues, isEditMode, isRestored]);

  useEffect(() => {
    if (coverImageUrl && coverImageUrl !== imagePreview) {
      setImagePreview(coverImageUrl);
    }
  }, [coverImageUrl, imagePreview]);

  useEffect(() => {
    if (!tempImagePreview) return undefined;

    return () => {
      URL.revokeObjectURL(tempImagePreview);
    };
  }, [tempImagePreview]);

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await uploadFile(formData).unwrap();

      if (response.success && response.data) {
        setValue('coverImageUrl', response.data, { shouldValidate: true });
        setImagePreview(response.data);
      }
    } catch {
      showToast.error('Image upload failed. Please try again.');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setTempImagePreview(previewUrl);

      try {
        await handleUpload(file);
      } catch {
        showToast.error('Image upload failed. Please try again.');
      } finally {
        setTempImagePreview(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file).catch(() => {
        showToast.error('Image upload failed. Please try again.');
      });
    }
  };

  const handleProgramSubmit = (data: {
    time: string;
    title: string;
    description?: string;
  }) => {
    if (editingProgramIndex === null) {
      appendProgram(data);
    } else {
      updateProgram(editingProgramIndex, data);
    }

    setEditingProgramIndex(null);
    setIsProgramModalOpen(false);
  };

  const openEditProgram = (index: number) => {
    setEditingProgramIndex(index);
    setIsProgramModalOpen(true);
  };

  const handleLinkGrant = () => {
    sessionStorage.setItem(
      CREATE_GALA_FORM_SESSION_KEY,
      JSON.stringify({ ...formValues, id })
    );
    sessionStorage.removeItem(CREATE_GRANT_FORM_SESSION_KEY);

    navigate(
      `/grants/create?mode=gala-builder&galaId=${id || ''}&galaName=${encodeURIComponent(formValues.name)}&returnTo=${encodeURIComponent(location.pathname)}`
    );
  };

  const handleEditLinkedGrant = (index: number) => {
    sessionStorage.setItem(
      CREATE_GALA_FORM_SESSION_KEY,
      JSON.stringify({ ...formValues, id })
    );
    sessionStorage.removeItem(CREATE_GRANT_FORM_SESSION_KEY);

    navigate(
      `/grants/create?mode=gala-builder&draftIndex=${index}&galaId=${id || ''}&galaName=${encodeURIComponent(formValues.name)}&returnTo=${encodeURIComponent(location.pathname)}`
    );
  };

  const handleRemoveLinkedGrant = (index: number) => {
    const nextGrants = grants.filter((_, grantIndex) => grantIndex !== index);
    setValue('grants', nextGrants, { shouldDirty: true, shouldValidate: true });
    showToast.success('Grant removed from this gala.');
  };

  const submitForm = async (data: GalaFormValues, intent: SubmitIntent) => {
    isAbortedRef.current = false;

    if (!isEditMode && data.grants.length === 0 && intent === 'publish') {
      showToast.error('Add at least one grant before creating the gala.');
      return;
    }

    if (intent === 'publish') {
      setIsLocalPublishing(true);
    }

    try {
      let galaIdToPublish = id;

      if (isEditMode && id) {
        await updateGala({
          id,
          name: data.name,
          about: data.about,
          coverImageUrl: data.coverImageUrl,
          status: data.status,
          eventDate: toUtcIsoString(`${data.eventDate}T${data.eventTime}`),
          eventTime: data.eventTime,
          venue: data.venue,
          city: data.city,
          expectedAttendees: Number(data.expectedAttendees),
          eveningItems: data.eveningItems.map((item) => ({
            time: item.time,
            title: item.title,
            description: item.description || '',
          })),
        }).unwrap();

        if (intent === 'draft') {
          showToast.success('Gala updated successfully.');
        }
      } else {
        const createdGala = await createOrganiserGalaWithGrants({
          name: data.name,
          about: data.about,
          coverImageUrl: data.coverImageUrl,
          status: data.status,
          eventDate: toUtcIsoString(`${data.eventDate}T${data.eventTime}`),
          eventTime: data.eventTime,
          venue: data.venue,
          city: data.city,
          expectedAttendees: Number(data.expectedAttendees),
          eveningItems: data.eveningItems.map((item) => ({
            time: item.time,
            title: item.title,
            description: item.description || '',
          })),
          grant: data.grants.map((grant) => ({
            name: grant.name,
            description: grant.description,
            category: grant.category,
            prizeAmount: Number(grant.prizeAmount),
            numberOfPrizes: Number(grant.numberOfPrizes),
            juryPanelSize: Number(grant.juryPanelSize) || 3,
            applicationDeadline: toUtcIsoString(grant.applicationDeadline),
            status: grant.status,
            questions: (grant.questions || []).map(
              (question, questionIndex) => {
                // Defensively map question types to backend-compliant strings
                const mapType = (type: string) => {
                  const t = type.toLowerCase().replace(/\s+/g, '');
                  if (t === 'short' || t === 'shorttext' || t === 'text')
                    return 'ShortText';
                  if (t === 'long' || t === 'longtext') return 'LongText';
                  if (t === 'number') return 'Number';
                  if (t === 'file' || t === 'fileupload') return 'File';
                  return 'ShortText'; // Default fallback
                };

                return {
                  ...question,
                  questionType: mapType(question.questionType),
                  order: question.order ?? questionIndex,
                };
              }
            ),
            requireInterview: grant.requireInterview,
            requireCompanyName: grant.requireCompanyName,
            requireIndustrySelection: grant.requireIndustrySelection,
            requireMotivationStatement: grant.requireMotivationStatement,
            requireBusinessPlanDocument: grant.requireBusinessPlanDocument,
            juryCriteria: grant.juryCriteria,
            additionalRequirements: (grant.additionalRequirements || []).map(
              (requirement, requirementIndex) => ({
                ...requirement,
                order: requirement.order ?? requirementIndex,
              })
            ),
            prizeWinners:
              grant.prizeWinners
                ?.slice(0, 3)
                .map((pw: { rank: number; amount: number }) => ({
                  rank: pw.rank,
                  amount: Number(pw.amount),
                })) || [],
            juryIds: grant.juryIds || [],
          })),
          saveAsDraft: true,
        }).unwrap();

        galaIdToPublish = createdGala.data.id;

        if (intent === 'draft') {
          showToast.success('Gala draft saved successfully.');
        }
      }

      if (intent === 'publish') {
        if (!galaIdToPublish) {
          throw new Error(
            'Unable to publish this gala because no gala ID was found.'
          );
        }
        showToast.info(
          'Please confirm the wallet transaction for your grants.'
        );

        const totalPoolAmount = data.grants.reduce((acc, grant) => {
          return acc + (Number(grant.prizeAmount) || 0);
        }, 0);

        const { transactionHash, walletAddress } =
          await createGrantPlatformTransaction(totalPoolAmount);

        if (isAbortedRef.current) {
          return;
        }

        publishPromiseRef.current = publishGala({
          id: galaIdToPublish,
          body: {
            blockchainTransactionHash: transactionHash,
            organiserWalletAddress: walletAddress,
          },
        });
        await publishPromiseRef.current.unwrap();

        if (!isAbortedRef.current) {
          showToast.success(
            isEditMode
              ? 'Gala published successfully.'
              : 'Gala created and published successfully.'
          );
        }
      }

      sessionStorage.removeItem(CREATE_GALA_FORM_SESSION_KEY);
      navigate('/galas');
    } catch (error: unknown) {
      let errorMessage = '';
      if (typeof error === 'object' && error !== null && 'data' in error) {
        // Handle RTK Query error responses specifically
        const rtkError = error as {
          data: { message?: string; errors?: unknown[] };
        };
        errorMessage =
          rtkError.data.message || 'Validation failed. Please check the form.';
      } else if (error instanceof Error) {
        if (
          error.message.includes('User denied transaction') ||
          error.message.includes('user rejected')
        ) {
          errorMessage = 'Wallet transaction cancelled by user.';
        } else {
          errorMessage = isEditMode
            ? 'Failed to update gala. Please try again.'
            : 'Failed to save gala. Please review the form and try again.';
        }
      } else {
        errorMessage = isEditMode
          ? 'Failed to update gala. Please try again.'
          : 'Failed to save gala. Please review the form and try again.';
      }

      showToast.error(errorMessage);
    } finally {
      if (intent === 'publish') {
        setIsLocalPublishing(false);
      }
    }
  };

  const submitWithIntent = (intent: SubmitIntent) => {
    handleSubmit(
      (data) => submitForm(data, intent),
      (validationErrors) => {
        // Find the first error message to show in the toast
        const errorKeys = Object.keys(validationErrors);
        if (errorKeys.length > 0) {
          const firstField = errorKeys[0];
          const errorObj = validationErrors[
            firstField as keyof typeof validationErrors
          ] as { message?: string } | undefined;
          const message =
            errorObj?.message || `The ${firstField} field is invalid.`;
          showToast.error(`Form validation failed: ${message}`);
        }
      }
    )().catch(() => {
      showToast.error('An error occurred while submitting the form.');
    });
  };

  const getSubmitButtonLabel = (intent: SubmitIntent) => {
    if (isSubmitting) {
      return intent === 'draft' ? 'Saving...' : 'Publishing...';
    }

    if (isEditMode) {
      return intent === 'draft' ? 'Save Changes' : 'Update & Publish';
    }

    return intent === 'draft' ? 'Save Draft' : 'Publish';
  };

  return (
    <div className="create-gala-page">
      <HeaderActions>
        <button
          type="button"
          className="header-btn btn-danger-soft"
          onClick={() => navigate('/galas')}
        >
          <Trash size={18} />
          <span>Trash</span>
        </button>
        <button
          type="button"
          className="header-btn btn-outline"
          onClick={() => submitWithIntent('draft')}
          disabled={isSubmitting || isLoadingGala || !isVerified}
          title={!isVerified ? 'Verify your account to save drafts' : ''}
        >
          <Save size={18} />
          <span>{getSubmitButtonLabel('draft')}</span>
        </button>
        {(isEditMode || isVerified) && (
          <button
            type="button"
            className="header-btn btn-primary"
            onClick={() => submitWithIntent('publish')}
            disabled={
              isSubmitting || isLoadingGala || isLocalPublishing || !isVerified
            }
            title={!isVerified ? 'Verify your account to publish' : ''}
          >
            <Send size={18} />
            <span>{getSubmitButtonLabel('publish')}</span>
          </button>
        )}
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
                <label id="gala-name-label" htmlFor="gala-name-input">
                  Event Name *
                  <input
                    id="gala-name-input"
                    type="text"
                    {...register('name')}
                    placeholder="e.g. Gala Vision Montreal 2026"
                    className={errors.name ? 'error' : ''}
                    aria-labelledby="gala-name-label"
                  />
                </label>
                {errors.name && (
                  <span className="error-message">{errors.name.message}</span>
                )}
              </div>

              <div className="form-group">
                <label id="gala-about-label" htmlFor="gala-about-input">
                  About Event *
                  <textarea
                    id="gala-about-input"
                    {...register('about')}
                    placeholder="The biggest entrepreneurial event of the year..."
                    rows={4}
                    className={errors.about ? 'error' : ''}
                    aria-labelledby="gala-about-label"
                  />
                </label>
                {errors.about && (
                  <span className="error-message">{errors.about.message}</span>
                )}
              </div>

              <div className="form-group">
                <label id="gala-cover-label" htmlFor="gala-cover-file">
                  Event Cover Image *
                  <input
                    id="gala-cover-file"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    id="gala-cover-dropzone"
                    className={`dropzone-area ${imagePreview ? 'has-image' : ''} ${isUploading ? 'uploading' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    aria-labelledby="gala-cover-label"
                  >
                    {isUploading ? (
                      <div className="upload-spinner-container">
                        <RefreshCcw className="animate-spin" size={32} />
                        <p>Uploading image...</p>
                      </div>
                    ) : (
                      <>
                        {!activeImagePreview && (
                          <div className="upload-placeholder">
                            <Upload size={32} />
                            <p>Click to upload or drag and drop</p>
                            <span>PNG, JPG up to 10MB</span>
                          </div>
                        )}

                        {activeImagePreview && (
                          <div className="image-preview-container">
                            <img
                              src={getAssetUrl(activeImagePreview)}
                              alt="Gala cover preview"
                            />
                            <div className="image-overlay">
                              <Upload size={24} />
                              <span>Change Image</span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </button>
                </label>

                {errors.coverImageUrl && (
                  <span className="error-message">
                    {errors.coverImageUrl.message}
                  </span>
                )}
              </div>
            </div>
          </section>

          <section className="form-card">
            <div className="card-header">
              <h3>Date, Time &amp; Location</h3>
              <p>When and where the event will take place</p>
            </div>

            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label id="gala-date-label" htmlFor="gala-event-date">
                    Event Date *
                    <div className="input-with-icon">
                      <Calendar size={18} />
                      <input
                        id="gala-event-date"
                        type="date"
                        {...register('eventDate')}
                        className={errors.eventDate ? 'error' : ''}
                        aria-labelledby="gala-date-label"
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
                  <label id="gala-time-label" htmlFor="gala-event-time">
                    Event Time *
                    <div className="input-with-icon">
                      <Clock size={18} />
                      <input
                        id="gala-event-time"
                        type="time"
                        {...register('eventTime')}
                        className={errors.eventTime ? 'error' : ''}
                        aria-labelledby="gala-time-label"
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
                <label id="gala-venue-label" htmlFor="gala-venue-input">
                  Venue / Location *
                  <div className="input-with-icon">
                    <MapPin size={18} />
                    <input
                      id="gala-venue-input"
                      type="text"
                      {...register('venue')}
                      placeholder="Palais des congres, Montreal"
                      className={errors.venue ? 'error' : ''}
                      aria-labelledby="gala-venue-label"
                    />
                  </div>
                </label>
                {errors.venue && (
                  <span className="error-message">{errors.venue.message}</span>
                )}
              </div>

              <div className="form-group">
                <label id="gala-city-label" htmlFor="gala-city-input">
                  City / Region *
                  <input
                    id="gala-city-input"
                    type="text"
                    {...register('city')}
                    placeholder="Montreal, QC"
                    className={errors.city ? 'error' : ''}
                    aria-labelledby="gala-city-label"
                  />
                </label>
                {errors.city && (
                  <span className="error-message">{errors.city.message}</span>
                )}
              </div>
            </div>
          </section>

          <section className="form-card">
            <div className="card-header">
              <h3>Participants &amp; Prize Pool</h3>
              <p>Expected attendees and grant prize pool</p>
            </div>

            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label
                    id="attendees-label"
                    htmlFor="expected-attendees-count"
                  >
                    Expected Attendees *
                    <div className="input-with-icon">
                      <Users size={18} />
                      <input
                        id="expected-attendees-count"
                        type="number"
                        {...register('expectedAttendees')}
                        placeholder="245"
                        className={errors.expectedAttendees ? 'error' : ''}
                        aria-labelledby="attendees-label"
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
                  <label id="grants-count-label" htmlFor="number-of-grants">
                    Number of Grants *
                    <div className="input-with-icon readonly-input">
                      <Link2 size={18} />
                      <input
                        id="number-of-grants"
                        type="text"
                        value={grants.length.toString()}
                        readOnly
                        aria-labelledby="grants-count-label"
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label id="prize-pool-label" htmlFor="total-prize-pool">
                  Total Prize Pool *
                  <div className="input-with-icon readonly-input">
                    <Trophy size={18} />
                    <input
                      id="total-prize-pool"
                      type="text"
                      value={`$ ${totalPrizePool.toLocaleString()} in grants`}
                      readOnly
                      aria-labelledby="prize-pool-label"
                    />
                  </div>
                </label>
              </div>
            </div>
          </section>

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
                {eveningProgramFields.map((item, index) => (
                  <div key={item.id} className="program-item-card-premium">
                    <div className="time-badge">
                      <span>{eveningItems[index]?.time || '--:--'}</span>
                    </div>

                    <div className="item-content">
                      <h4>{eveningItems[index]?.title || 'Program item'}</h4>
                      <p>
                        {eveningItems[index]?.description ||
                          'No description provided'}
                      </p>
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
                        onClick={() => removeProgram(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {eveningProgramFields.length === 0 && (
                  <div className="empty-state-card">
                    <p>
                      No program items yet. Click &quot;Add Item&quot; to start.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="form-card section-grants">
            <div className="card-header flex-header">
              <div className="header-text">
                <h3>Associated Grants</h3>
                <p>Grants available for this gala</p>
              </div>
              <button
                type="button"
                className="btn-add-item-header"
                onClick={handleLinkGrant}
              >
                <Plus size={16} />
                <span>Link Grant</span>
              </button>
            </div>

            <div className="card-body">
              <div className="grants-items-list">
                {grants.map((grant, index) => {
                  const grantTotal = Number(grant.prizeAmount) || 0;

                  return (
                    <div key={grant.name} className="grant-item-card-premium">
                      <div className="grant-icon-badge">
                        <Gift size={20} />
                      </div>

                      <div className="item-content">
                        <h4>{grant.name}</h4>
                        <div className="grant-meta">
                          <span className="amount">
                            $ {grantTotal.toLocaleString()}
                          </span>
                          <span className="dot">•</span>
                          <span className="date">
                            {formatDateTimeShort(grant.applicationDeadline)}
                          </span>
                        </div>
                      </div>

                      <div className="item-actions">
                        <button
                          type="button"
                          className="action-btn-view"
                          onClick={() => handleEditLinkedGrant(index)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          className="action-btn-link"
                          onClick={() => handleRemoveLinkedGrant(index)}
                        >
                          <Link2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {grants.length === 0 && (
                  <div className="empty-state-card">
                    <p>
                      No grants linked yet. Click &quot;Link Grant&quot; to add
                      one.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

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
        minTime={formValues.eventTime}
      />

      <GalaActionOverlay
        isOpen={isLocalPublishing}
        title="Publishing Gala"
        message="Verifying prize pool proof on the blockchain. Please confirm the transaction if your wallet prompts you."
        onCancel={handleCancelPublishing}
      />
    </div>
  );
}

export default CreateGala;
