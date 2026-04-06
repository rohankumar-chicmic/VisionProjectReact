import Skeleton from '../../../Components/Shared/Skeleton';

interface RowSkeletonProps {
  readonly id: number;
}

export function AdminManagerRowSkeleton({ id }: RowSkeletonProps) {
  return (
    <tr key={`admin-row-skeleton-${id}`}>
      <td>
        <div className="admin-cell">
          <Skeleton width={32} height={32} borderRadius="50%" />
          <div className="info" style={{ marginLeft: '12px' }}>
            <Skeleton width={120} height={16} />
            <Skeleton width={80} height={12} />
          </div>
        </div>
      </td>
      <td>
        <Skeleton width={180} height={14} />
      </td>
      <td>
        <Skeleton width={100} height={24} borderRadius={12} />
      </td>
      <td>
        <Skeleton width={80} height={14} />
      </td>
      <td>
        <Skeleton width={60} height={14} />
      </td>
      <td>
        <Skeleton width={60} height={14} />
      </td>
      <td>
        <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
          <Skeleton width={28} height={28} borderRadius={6} />
          <Skeleton width={28} height={28} borderRadius={6} />
        </div>
      </td>
    </tr>
  );
}

export function AdminManagersTableSkeleton({
  rows = 5,
}: {
  readonly rows?: number;
}) {
  return (
    <table className="hi-fi-table">
      <thead>
        <tr>
          <th>Admin</th>
          <th>Email</th>
          <th>Role</th>
          <th>Created Date</th>
          <th>Last active</th>
          <th>Password</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, idx) => (
          <AdminManagerRowSkeleton key={`row-skel-${idx + 1}`} id={idx + 1} />
        ))}
      </tbody>
    </table>
  );
}

AdminManagersTableSkeleton.defaultProps = {
  rows: 5,
};
