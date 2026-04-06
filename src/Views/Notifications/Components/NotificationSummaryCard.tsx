import React from 'react';
import './NotificationSummaryCard.scss';

interface NotificationSummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  badgeText?: string;
  badgeType?: 'success' | 'info' | 'warning' | 'error';
  color: string;
}

function NotificationSummaryCard({
  icon,
  label,
  value,
  badgeText,
  badgeType = 'success',
  color,
}: Readonly<NotificationSummaryCardProps>) {
  return (
    <div className={`notification-summary-card ${badgeType}`}>
      <div className="card-top">
        <div
          className="icon-box"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {icon}
        </div>
        {badgeText && (
          <span className={`active-badge ${badgeType}`}>{badgeText}</span>
        )}
      </div>
      <div className="card-bottom">
        <span className="summary-label">{label}</span>
        <h3 className="summary-value">{value}</h3>
      </div>
    </div>
  );
}

export default NotificationSummaryCard;
