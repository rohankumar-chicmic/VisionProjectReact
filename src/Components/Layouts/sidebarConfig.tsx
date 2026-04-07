import {
  Award,
  Bell,
  Calendar,
  FileText,
  LayoutDashboard,
  Megaphone,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AppRole } from '../../Shared/Auth/roles';

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

export const SIDEBAR_CONFIG: Record<AppRole, SidebarItem[]> = {
  organiser: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Galas Management', path: '/galas' },
    { icon: Award, label: 'Grants', path: '/grants' },
    { icon: FileText, label: 'Applications', path: '/applications' },
    { icon: Megaphone, label: 'Announcements', path: '/announcements' },
    { icon: Users, label: 'Manage Jury', path: '/manage-jury' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Users Management', path: '/users' },
    { icon: Calendar, label: 'Galas Management', path: '/galas' },
    { icon: Award, label: 'Grants', path: '/grants' },
    { icon: FileText, label: 'Applications', path: '/applications' },
    { icon: Megaphone, label: 'Announcements', path: '/announcements' },
    { icon: ShieldCheck, label: 'Admin Managers', path: '/admins' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
  ],
  sub_admin: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Users Management', path: '/users' },
    { icon: Calendar, label: 'Galas Management', path: '/galas' },
    { icon: Award, label: 'Grants', path: '/grants' },
    { icon: FileText, label: 'Applications', path: '/applications' },
    { icon: Megaphone, label: 'Announcements', path: '/announcements' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
  ],
  jury: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Star, label: 'Jury Workspace', path: '/jury' },
    { icon: FileText, label: 'Applications', path: '/applications' },
    { icon: Calendar, label: 'Galas Management', path: '/galas' },
  ],
};
