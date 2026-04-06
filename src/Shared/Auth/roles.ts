export type AppRole = 'organiser' | 'admin' | 'sub_admin' | 'jury';

export interface RoleAwareUser {
  role?: string | number | null;
  roleLabel?: string | null;
  userRole?: string | number | null;
  type?: string | number | null;
}

const ROLE_LABELS: Record<AppRole, string> = {
  organiser: 'Organiser',
  admin: 'Admin',
  sub_admin: 'Sub Admin',
  jury: 'Jury',
};

const ROLE_ALIASES: Record<string, AppRole> = {
  organiser: 'organiser',
  organizer: 'organiser',
  admin: 'admin',
  'super admin': 'admin',
  super_admin: 'admin',
  subadmin: 'sub_admin',
  'sub admin': 'sub_admin',
  sub_admin: 'sub_admin',
  jury: 'jury',
  'jury member': 'jury',
  jury_member: 'jury',
};

const normalizeRoleString = (value: string) =>
  value.trim().toLowerCase().replace(/[-\s]+/g, '_');

export const normalizeRole = (
  value?: string | number | null
): AppRole | null => {
  if (typeof value === 'number') {
    if (value === 1) return 'admin';
    if (value === 2) return 'sub_admin';
    if (value === 3) return 'organiser';
    if (value === 4) return 'jury';
    return null;
  }

  if (!value) return null;

  const normalized = normalizeRoleString(value);
  return ROLE_ALIASES[normalized] || null;
};

export const getUserRole = (user?: RoleAwareUser | null): AppRole => {
  if (!user) return 'admin';

  return (
    normalizeRole(user.role) ||
    normalizeRole(user.userRole) ||
    normalizeRole(user.roleLabel) ||
    normalizeRole(user.type) ||
    'admin'
  );
};

export const getRoleLabel = (role: AppRole) => ROLE_LABELS[role];
