import Skeleton from '../../../Components/Shared/Skeleton';

export function GalaCardSkeleton() {
  return (
    <div className="gala-card skeleton-card">
      <div className="gala-image">
        <Skeleton width="100%" height="100%" borderRadius="14px" />
      </div>

      <div className="gala-content">
        <div className="gala-info">
          <Skeleton width="60%" height={22} />
          <div style={{ marginTop: '10px' }}>
            <Skeleton width="100%" height={16} />
            <Skeleton width="75%" height={16} />
          </div>

          <div className="gala-meta" style={{ marginTop: '18px' }}>
            <Skeleton width="24%" height={14} />
            <Skeleton width="20%" height={14} />
            <Skeleton width="22%" height={14} />
          </div>
        </div>

        <div className="gala-actions">
          <Skeleton width={78} height={34} borderRadius="10px" />
          <Skeleton width={110} height={34} borderRadius="10px" />
        </div>
      </div>
    </div>
  );
}

export function GalaGridSkeleton() {
  return (
    <div className="gala-grid">
      {[1, 2, 3].map((id) => (
        <GalaCardSkeleton key={`gala-skeleton-${id}`} />
      ))}
    </div>
  );
}
