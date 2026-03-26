import { TrendingUp } from 'lucide-react';
import './KpiCard.scss';

export interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  trendType: 'up' | 'down';
  color: string;
  subLabel?: string;
  period?: string;
}

function KpiCard({
  icon,
  label,
  value,
  trend,
  trendType,
  color,
  subLabel,
  period,
}: Readonly<KpiCardProps>) {
  return (
    <div className="kpi-card wide">
      <div className="kpi-header">
        <div
          className="kpi-icon"
          style={{ backgroundColor: `${color}`, color: 'white' }}
        >
          {icon}
        </div>
        <div className={`kpi-trend ${trendType}`}>
          <TrendingUp size={14} />
          <span>{trend}</span>
        </div>
      </div>

      <div className="kpi-body-row">
        <div className="kpi-info">
          <span className="kpi-label">{label}</span>
          <p className="kpi-sublabel">{subLabel}</p>
        </div>
        <div className="kpi-data">
          <span className="kpi-period">{period}</span>
          <h3 className="kpi-value">{value}</h3>
        </div>
      </div>
    </div>
  );
}

export default KpiCard;
