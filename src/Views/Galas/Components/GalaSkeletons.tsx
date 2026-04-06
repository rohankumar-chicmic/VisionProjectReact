import Skeleton from '../../../Components/Shared/Skeleton';

export function GalaCardSkeleton() {
  return (
    <div className="gala-card skeleton-card">
      <div className="gala-image">
        <Skeleton width="100%" height={240} borderRadius="16px 16px 0 0" />
      </div>

      <div className="gala-content">
        <div className="gala-info">
          <Skeleton width="70%" height={24} />
          <div style={{ marginTop: '12px' }}>
            <Skeleton width="100%" height={16} />
            <Skeleton width="90%" height={16} />
          </div>

          <div className="gala-meta" style={{ marginTop: '24px' }}>
            <Skeleton width="30%" height={14} />
            <Skeleton width="30%" height={14} />
            <Skeleton width="30%" height={14} />
          </div>
        </div>

        <div className="gala-actions" style={{ marginTop: '16px' }}>
          <Skeleton width="45%" height={36} />
          <Skeleton width="45%" height={36} />
        </div>
      </div>
    </div>
  );
}

export function GalaGridSkeleton() {
  return (
    <div className="gala-grid">
      {[1, 2, 3, 4, 5, 6].map((id) => (
        <GalaCardSkeleton key={`gala-skeleton-${id}`} />
      ))}
    </div>
  );
}
