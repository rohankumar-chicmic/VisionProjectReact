import Skeleton from '../../../Components/Shared/Skeleton';

export function KpiSkeleton() {
  return (
    <div
      className="kpi-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minHeight: '140px',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Skeleton width={24} height={24} borderRadius="50%" />
        <Skeleton width={40} height={16} />
      </div>
      <Skeleton width="60%" height={20} />
      <Skeleton width="40%" height={28} />
      <Skeleton width="30%" height={14} />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="chart-container">
      <div className="chart-header">
        <Skeleton width="40%" height={24} />
        <Skeleton width="60%" height={16} />
      </div>
      <div
        className="chart-body"
        style={{ marginTop: '24px', minHeight: '250px' }}
      >
        <Skeleton width="100%" height={250} />
      </div>
    </div>
  );
}
