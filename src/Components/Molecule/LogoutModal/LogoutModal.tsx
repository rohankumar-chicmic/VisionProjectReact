import Modal from '../../Atom/Modal/Modal';
import './LogoutModal.scss';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: Readonly<LogoutModalProps>) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Logout Confirmation"
      width="400px"
    >
      <div className="logout-modal-content">
        <p>Are you sure you want to log out of your account?</p>
        <div className="modal-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="confirm-btn"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default LogoutModal;
