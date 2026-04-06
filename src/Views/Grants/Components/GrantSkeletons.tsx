import Skeleton from '../../../Components/Shared/Skeleton';

export function GrantCardSkeleton() {
  return (
    <div className="grant-card skeleton-card">
      <div className="card-header">
        <Skeleton width="60%" height={24} />
        <Skeleton width={80} height={24} borderRadius={20} />
      </div>

      <div style={{ marginTop: '16px' }}>
        <Skeleton width="100%" height={16} />
        <Skeleton width="90%" height={16} />
      </div>

      <div className="grant-meta" style={{ marginTop: '24px' }}>
        <div className="meta-item">
          <Skeleton width={16} height={16} borderRadius="50%" />
          <Skeleton width={100} height={14} />
        </div>
        <div className="meta-item">
          <Skeleton width={16} height={16} borderRadius="50%" />
          <Skeleton width={100} height={14} />
        </div>
        <div className="meta-item">
          <Skeleton width={16} height={16} borderRadius="50%" />
          <Skeleton width={100} height={14} />
        </div>
      </div>

      <div className="eligibility-section" style={{ marginTop: '24px' }}>
        <Skeleton width="40%" height={16} />
        <div className="criteria-chips" style={{ marginTop: '12px' }}>
          <Skeleton width={80} height={24} borderRadius={16} />
          <Skeleton width={120} height={24} borderRadius={16} />
        </div>
      </div>

      <div className="card-actions" style={{ marginTop: '24px' }}>
        <Skeleton width="30%" height={32} />
        <Skeleton width="30%" height={32} />
        <Skeleton width="30%" height={32} />
      </div>
    </div>
  );
}

export function GrantGridSkeleton() {
  return (
    <div className="grants-grid">
      {[1, 2, 3, 4, 5, 6].map((id) => (
        <GrantCardSkeleton key={`grant-skeleton-${id}`} />
      ))}
    </div>
  );
}
