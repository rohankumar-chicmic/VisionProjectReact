import { Navigate } from 'react-router-dom';
import { CustomRouter } from './RootRoutes';
import Dashboard from '../Views/Dashboard/Dashboard';
import UserList from '../Views/Users/UserList';
import GalaList from '../Views/Galas/GalaList';
import CreateGala from '../Views/Galas/CreateGala';
import GrantList from '../Views/Grants/GrantList';
import CreateGrant from '../Views/Grants/CreateGrant';
import ApplicationList from '../Views/Applications/ApplicationList';
import ApplicationDetail from '../Views/Applications/ApplicationDetail';
import JuryPanel from '../Views/Applications/JuryPanel';
import AnnouncementList from '../Views/Announcements/AnnouncementList';
import AdminManagersList from '../Views/Settings/AdminManagersList';
import UserProfile from '../Views/Users/UserProfile';
import GalaDetails from '../Views/Galas/GalaDetails';
import GrantDetails from '../Views/Grants/GrantDetails';
import Notifications from '../Views/Notifications/NotificationAutomations';
import JuryPage from '../Views/Jury/JuryPage';
import AdminSettings from '../Views/Settings/AdminSettings';
import ManageJuryCriteria from '../Views/Grants/ManageJuryCriteria';
import AddCustomCriteria from '../Views/Grants/AddCustomCriteria';
import ManageJury from '../Views/Jury/ManageJury';
import EventOrganiserList from '../Views/Admin/EventOrganisers/EventOrganiserList';

// eslint-disable-next-line import/prefer-default-export
export const PRIVATE_ROUTES: Array<CustomRouter> = [
  {
    path: '/dashboard',
    element: <Dashboard />,
    title: 'Dashboard',
  },
  {
    path: '/users',
    element: <UserList />,
    title: 'Users Management',
  },
  {
    path: '/users/:id',
    element: <UserProfile />,
    title: 'User Profile Details',
  },
  {
    path: '/event-organisers',
    element: <EventOrganiserList />,
    title: 'Event Organisers',
  },
  {
    path: '/galas',
    element: <GalaList />,
    title: 'Galas Management',
  },
  {
    path: '/galas/create',
    element: <CreateGala />,
    title: 'Create Gala',
  },
  {
    path: '/galas/:id',
    element: <GalaDetails />,
    title: 'Gala Details',
  },
  {
    path: '/galas/edit/:id',
    element: <CreateGala />,
    title: 'Edit Gala',
  },
  {
    path: '/grants',
    element: <GrantList />,
    title: 'Grants',
  },
  {
    path: '/grants/create',
    element: <CreateGrant />,
    title: 'Create Grant',
  },
  {
    path: '/grants/edit/:id',
    element: <CreateGrant />,
    title: 'Edit Grant',
  },
  {
    path: '/grants/jury-criteria',
    element: <ManageJuryCriteria />,
    title: 'Manage Jury Criteria',
  },
  {
    path: '/grants/:id',
    element: <GrantDetails />,
    title: 'Grant Details',
  },
  {
    path: '/grants/add-custom-criteria',
    element: <AddCustomCriteria />,
    title: 'Add Custom Criteria',
  },
  {
    path: '/applications',
    element: <ApplicationList />,
    title: 'Applications',
  },
  {
    path: '/applications/:id',
    element: <ApplicationDetail />,
    title: 'Application Detail',
  },
  {
    path: '/applications/:id/jury',
    element: <JuryPanel />,
    title: 'Jury Panel',
  },
  {
    path: '/announcements',
    element: <AnnouncementList />,
    title: 'Announcements',
  },
  {
    path: '/admins',
    element: <AdminManagersList />,
    title: 'Admin Managers',
  },
  {
    path: '/notifications',
    element: <Notifications />,
    title: 'Notifications',
  },
  {
    path: '/manage-jury',
    element: <ManageJury />,
    title: 'Manage Jury',
  },
  {
    path: '/jury',
    element: <JuryPage />,
    title: 'Jury Scoring',
  },
  {
    path: '/settings',
    element: <AdminSettings />,
    title: 'Admin Settings',
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" />,
    title: 'Rendering wildcard',
  },
];
