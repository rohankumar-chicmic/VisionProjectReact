import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  useLoginAdminMutation,
  useForgotPasswordMutation,
} from '../../../Services/Api/module/AuthApi';
import { updateAuthTokenRedux } from '../../../Store/Common';
import type { AppDispatch } from '../../../Store';
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
  loginSchema,
  LoginFormValues,
  resetPasswordSchema,
  ResetPasswordFormValues,
} from '../Helpers/AuthValidations';
import showToast from '../../../Shared/Utils/toast';

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null) {
    if ('data' in error) {
      const { data } = error as {
        data?: { message?: string; error?: string };
      };

      if (data?.message) {
        return data.message;
      }

      if (data?.error) {
        return data.error;
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
  const [loginAdmin, { isLoading }] = useLoginAdminMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onSubmit',
  });

  const onSubmit = form.handleSubmit(async ({ email, password }) => {
    setSubmitError(null);

    try {
      const response = await loginAdmin({ email, password }).unwrap();

      if (response.success && response.data) {
        showToast.success('Login successful!');
        const { accessToken, refreshToken, ...user } = response.data;

        dispatch(
          updateAuthTokenRedux({
            token: accessToken,
            refreshToken,
            user,
          })
        );
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
    isSubmitting: form.formState.isSubmitting || isLoading,
    showPassword,
    togglePasswordVisibility: () => setShowPassword((prev) => !prev),
    submitError,
    onSubmit,
  };
};

export const useForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

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
      const response = (await forgotPassword(data).unwrap()) as {
        success: boolean;
        message?: string;
      };

      if (response.success) {
        showToast.success('Reset link sent to your email!');
        navigate('/email-sent', { state: { email: data.email } });
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
    isSubmitting: form.formState.isSubmitting || isLoading,
    submitError,
    onSubmit,
  };
};

export const useResetPasswordForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const onSubmit = form.handleSubmit(async () => {
    navigate('/reset-success');
  });

  return {
    ...form,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility: () => setShowPassword((prev) => !prev),
    toggleConfirmPasswordVisibility: () =>
      setShowConfirmPassword((prev) => !prev),
    passwordRequirements,
    onSubmit,
  };
};
