import { Navigate } from 'react-router-dom';
import { CustomRouter } from './RootRoutes';
import Login from '../Views/Auth/Login';
import ForgotPassword from '../Views/Auth/ForgotPassword';
import ResetPassword from '../Views/Auth/ResetPassword';
import EmailSent from '../Views/Auth/EmailSent';
import ResetSuccess from '../Views/Auth/ResetSuccess';

// eslint-disable-next-line import/prefer-default-export
export const PUBLIC_ROUTES: Array<CustomRouter> = [
  {
    path: '/login',
    element: <Login />,
    title: 'Login',
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
    title: 'Forgot Password',
  },
  {
    path: '/email-sent',
    element: <EmailSent />,
    title: 'Email Sent',
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
    title: 'Reset Password',
  },
  {
    path: '/reset-success',
    element: <ResetSuccess />,
    title: 'Reset Success',
  },
  {
    path: '*',
    element: <Navigate to="/login" />,
    title: 'Rendering wildcard',
  },
];
