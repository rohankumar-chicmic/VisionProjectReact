import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginAdminMutation } from '../../../Services/Api/module/AuthApi';
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

type LoginApiResponse = {
  token?: string;
  accessToken?: string;
  data?: {
    token?: string;
    accessToken?: string;
  };
};

const getLoginToken = (response: LoginApiResponse | string) => {
  if (typeof response === 'string') {
    return response;
  }

  return (
    response?.token ??
    response?.accessToken ??
    response?.data?.token ??
    response?.data?.accessToken ??
    null
  );
};

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
      const token = getLoginToken(response as LoginApiResponse | string);

      if (!token) {
        setSubmitError(
          'Login succeeded, but no authentication token was returned.'
        );
        return;
      }

      dispatch(updateAuthTokenRedux({ token }));
      navigate('/dashboard');
    } catch (error) {
      setSubmitError(getErrorMessage(error));
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
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = form.handleSubmit(async () => {
    navigate('/email-sent');
  });

  return {
    ...form,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
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
