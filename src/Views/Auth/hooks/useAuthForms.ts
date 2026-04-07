import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useLoginAdminMutation,
  useLoginOrganiserMutation,
  useLoginJuryMutation,
  useForgotPasswordAdminMutation,
  useForgotPasswordOrganiserMutation,
  useForgotPasswordJuryMutation,
  useResetPasswordAdminMutation,
  useResetPasswordOrganiserMutation,
  useResetPasswordJuryMutation,
  useRegisterOrganiserMutation,
} from '../../../Services/Api/module/AuthApi';
import { useUploadFileMutation } from '../../../Services/Api/module/CommonApi';
import { updateAuthTokenRedux } from '../../../Store/Common';
import type { AppDispatch } from '../../../Store';
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
  loginSchema,
  LoginFormValues,
  resetPasswordSchema,
  ResetPasswordFormValues,
  organiserStep1Schema,
  organiserStep2Schema,
  organiserStep3Schema,
  OrganiserRegistrationValues,
} from '../Helpers/AuthValidations';
import showToast from '../../../Shared/Utils/toast';

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null) {
    if ('data' in error) {
      const { data } = error as {
        data?: { message?: string; error?: string; errors?: unknown };
      };

      if (data?.message) {
        return data.message;
      }

      if (data?.error) {
        return data.error;
      }

      if (data?.errors) {
        return JSON.stringify(data.errors);
      }
    }

    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
  }

  return 'Unable to complete the request. Please try again.';
};

export const useLoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [loginAdmin, { isLoading: isAdminLoading }] = useLoginAdminMutation();
  const [loginOrganiser, { isLoading: isOrganiserLoading }] =
    useLoginOrganiserMutation();
  const [loginJury, { isLoading: isJuryLoading }] = useLoginJuryMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'organiser',
      rememberMe: false,
    },
    mode: 'onSubmit',
  });

  const selectedRole = form.watch('role');

  const onSubmit = form.handleSubmit(async (data) => {
    setSubmitError(null);

    try {
      let loginMutation;
      if (data.role === 'admin') {
        loginMutation = loginAdmin;
      } else if (data.role === 'organiser') {
        loginMutation = loginOrganiser;
      } else {
        loginMutation = loginJury;
      }

      const response = await loginMutation(data).unwrap();

      if (response.success && response.data) {
        showToast.success('Login successful!');
        const { accessToken, refreshToken, ...user } = response.data;

        dispatch(
          updateAuthTokenRedux({
            token: accessToken,
            refreshToken,

            user,
            role: data.role,
          })
        );
        // console.log(user);
        navigate('/dashboard');
      } else {
        const msg = response.message || 'Login failed';
        setSubmitError(msg);
        showToast.error(msg);
      }
    } catch (error) {
      const msg = getErrorMessage(error);
      setSubmitError(msg);
      showToast.error(msg);
    }
  });

  return {
    ...form,
    errors: form.formState.errors,
    isSubmitting:
      form.formState.isSubmitting ||
      isAdminLoading ||
      isOrganiserLoading ||
      isJuryLoading,
    showPassword,
    togglePasswordVisibility: () => setShowPassword((prev) => !prev),
    submitError,
    onSubmit,
    selectedRole,
  };
};

export const useForgotPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || 'organiser';

  const [submitError, setSubmitError] = useState<string | null>(null);

  const [forgotAdmin, { isLoading: isAdminLoading }] =
    useForgotPasswordAdminMutation();
  const [forgotOrganiser, { isLoading: isOrganiserLoading }] =
    useForgotPasswordOrganiserMutation();
  const [forgotJury, { isLoading: isJuryLoading }] =
    useForgotPasswordJuryMutation();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setSubmitError(null);
    try {
      let forgotMutation;
      if (role === 'admin') {
        forgotMutation = forgotAdmin;
      } else if (role === 'organiser') {
        forgotMutation = forgotOrganiser;
      } else {
        forgotMutation = forgotJury;
      }

      const response = (await forgotMutation(data).unwrap()) as {
        success: boolean;
        message?: string;
      };

      if (response.success) {
        showToast.success('Reset link sent to your email!');
        navigate('/email-sent', { state: { email: data.email, role } });
      } else {
        const msg = response.message || 'Failed to send reset link';
        setSubmitError(msg);
        showToast.error(msg);
      }
    } catch (error) {
      const msg = getErrorMessage(error);
      setSubmitError(msg);
      showToast.error(msg);
    }
  });

  return {
    ...form,
    errors: form.formState.errors,
    isSubmitting:
      form.formState.isSubmitting ||
      isAdminLoading ||
      isOrganiserLoading ||
      isJuryLoading,
    submitError,
    onSubmit,
    role,
  };
};

export const useResetPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // We should ideally get the role from the URL or state
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role') || 'organiser';
  const token = queryParams.get('token') || '';

  const [resetAdmin, { isLoading: isAdminLoading }] =
    useResetPasswordAdminMutation();
  const [resetOrganiser, { isLoading: isOrganiserLoading }] =
    useResetPasswordOrganiserMutation();
  const [resetJury, { isLoading: isJuryLoading }] =
    useResetPasswordJuryMutation();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });

  const passwordValue = form.watch('password');
  const passwordRequirements = [
    {
      label: 'At least 8 characters',
      met: passwordValue.length >= 8,
    },
    {
      label: 'One uppercase letter',
      met: /[A-Z]/.test(passwordValue),
    },
    {
      label: 'One lowercase letter',
      met: /[a-z]/.test(passwordValue),
    },
    {
      label: 'One number or special character',
      met: /[0-9!@#$%^&*]/.test(passwordValue),
    },
  ];

  const onSubmit = form.handleSubmit(async (data) => {
    setSubmitError(null);
    try {
      let resetMutation;
      if (role === 'admin') {
        resetMutation = resetAdmin;
      } else if (role === 'organiser') {
        resetMutation = resetOrganiser;
      } else {
        resetMutation = resetJury;
      }

      const response = (await resetMutation({ ...data, token }).unwrap()) as {
        success: boolean;
        message?: string;
      };

      if (response.success) {
        showToast.success('Password reset successfully!');
        navigate('/reset-success');
      } else {
        const msg = response.message || 'Failed to reset password';
        setSubmitError(msg);
        showToast.error(msg);
      }
    } catch (error) {
      const msg = getErrorMessage(error);
      setSubmitError(msg);
      showToast.error(msg);
    }
  });

  return {
    ...form,
    errors: form.formState.errors,
    isSubmitting:
      form.formState.isSubmitting ||
      isAdminLoading ||
      isOrganiserLoading ||
      isJuryLoading,
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility: () => setShowPassword((prev) => !prev),
    toggleConfirmPasswordVisibility: () =>
      setShowConfirmPassword((prev) => !prev),
    passwordRequirements,
    onSubmit,
    submitError,
  };
};

export const useCreateOrganiserForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [step, setStep] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registerOrganiser, { isLoading: isRegistering }] =
    useRegisterOrganiserMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const isSubmitting = isRegistering || isUploading;

  const getStepSchema = () => {
    if (step === 1) return organiserStep1Schema;
    if (step === 2) return organiserStep2Schema;
    return organiserStep3Schema;
  };

  const form = useForm<OrganiserRegistrationValues>({
    resolver: zodResolver(
      getStepSchema()
    ) as unknown as import('react-hook-form').Resolver<OrganiserRegistrationValues>,
    defaultValues: {
      fullname: '',
      email: '',
      phone: '',
      password: '',
      companyName: '',
      industryType: 'Technology',
      govtId: undefined,
    },
    mode: 'onChange',
  });

  const onSubmit = form.handleSubmit(async () => {
    const data = form.getValues();
    setSubmitError(null);
    try {
      let finalGovtId = data.govtId;

      if (data.govtId instanceof File) {
        const formData = new FormData();
        formData.append('file', data.govtId);
        const uploadResponse = await uploadFile(formData).unwrap();

        if (uploadResponse.success && uploadResponse.data) {
          finalGovtId = uploadResponse.data;
        } else {
          throw new Error('Failed to upload Government ID image');
        }
      }

      if (typeof finalGovtId !== 'string' || !finalGovtId.trim()) {
        throw new Error('Government ID upload failed or was not provided');
      }

      const payload = {
        fullName: data.fullname,
        email: data.email,
        password: data.password,
        phoneNumber: data.phone,
        governmentId: finalGovtId,
        companyName: data.companyName,
        industryDomain: data.industryType,
      };

      const response = await registerOrganiser(payload).unwrap();

      if (response.success) {
        showToast.success('Account created successfully!');

        dispatch(updateAuthTokenRedux({ token: null, role: 'organiser' }));
        navigate('/login');
      } else {
        setSubmitError(response.message || 'Registration failed');
        showToast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      const msg = getErrorMessage(error);
      setSubmitError(msg);
      showToast.error(msg);
    }
  });

  const nextStep = async () => {
    const fieldsToValidate = (() => {
      if (step === 1) return ['fullname', 'email', 'phone', 'password'];
      if (step === 2) return ['companyName', 'industryType'];
      return ['govtId'];
    })();

    const isValid = await form.trigger(
      fieldsToValidate as Array<keyof OrganiserRegistrationValues>
    );
    if (isValid) {
      if (step < 3) {
        setStep((s) => s + 1);
      } else {
        await onSubmit();
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    } else {
      navigate('/login');
    }
  };

  return {
    ...form,
    step,
    setStep,
    nextStep,
    prevStep,
    submitError,
    isSubmitting: isSubmitting || form.formState.isSubmitting,
    errors: form.formState.errors,
  };
};
