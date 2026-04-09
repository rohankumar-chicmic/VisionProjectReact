import { useSelector } from 'react-redux';
import type { RootState } from '../../Store';
import { getRoleLabel, getUserRole, AppRole } from './roles';

const useCurrentUserRole = () => {
  const { user, role: storedRole } = useSelector(
    (state: RootState) => state.common
  );
  const role = (storedRole || getUserRole(user)) as AppRole;

  return {
    role,
    roleLabel: getRoleLabel(role),
    user,
  };
};

export default useCurrentUserRole;
