import { Loader2, X } from 'lucide-react';
import './PublishingLoaderOverlay.scss';

interface GalaActionOverlayProps {
  isOpen: boolean;
  title: string;
  message: string;
  onCancel?: () => void;
}

function GalaActionOverlay({
  isOpen,
  title,
  message,
  onCancel,
}: GalaActionOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="publishing-overlay-fullscreen">
      <div className="publishing-card">
        {onCancel && (
          <button type="button" className="cancel-pill" onClick={onCancel}>
            <X size={16} /> Cancel Process
          </button>
        )}

        <div className="publishing-loader-wrapper">
          <Loader2 size={48} className="animate-spin" />
        </div>

        <h2>{title}</h2>
        <p>{message}</p>
        <div className="progress-bar-container">
          <div className="progress-bar" />
        </div>
      </div>
    </div>
  );
}

GalaActionOverlay.defaultProps = {
  onCancel: undefined,
};

export default GalaActionOverlay;
