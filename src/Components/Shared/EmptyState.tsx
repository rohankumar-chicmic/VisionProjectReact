import React from 'react';
import { LucideIcon } from 'lucide-react';
import './EmptyState.scss';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

function EmptyState({
  icon: Icon,
  title,
  description = '',
  action = null,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`empty-state-container ${className}`}>
      <div className="empty-state-content">
        {Icon && (
          <div className="icon-wrapper">
            <Icon size={64} strokeWidth={1.5} />
            <div className="icon-glow" />
          </div>
        )}
        <h3 className="empty-title">{title}</h3>
        {description && <p className="empty-description">{description}</p>}
        {action && <div className="empty-action">{action}</div>}
      </div>
    </div>
  );
}

EmptyState.defaultProps = {
  icon: undefined,
  description: '',
  action: null,
  className: '',
};

export default EmptyState;
