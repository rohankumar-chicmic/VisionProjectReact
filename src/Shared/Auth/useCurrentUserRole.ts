import { useSelector } from 'react-redux';
import type { RootState } from '../../Store';
import { getRoleLabel, getUserRole } from './roles';

export const useCurrentUserRole = () => {
  const user = useSelector((state: RootState) => state.common.user);
  const role = getUserRole(user);

  return {
    role,
    roleLabel: getRoleLabel(role),
    user,
  };
};
