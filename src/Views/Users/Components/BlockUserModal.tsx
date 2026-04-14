import { Slash, ChevronDown, RefreshCcw } from 'lucide-react';
import Modal from '../../../Components/Atom/Modal/Modal';
import { useBlockUserMutation } from '../../../Services/Api/module/Admin/User';
import showToast from '../../../Shared/Utils/toast';
import './UserModals.scss';

interface BlockUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  isBlocked: boolean;
}

function BlockUserModal({
  isOpen,
  onClose,
  userId,
  userName,
  isBlocked,
}: Readonly<BlockUserModalProps>) {
  const [blockUser, { isLoading }] = useBlockUserMutation();

  const handleAction = async () => {
    try {
      await blockUser({ id: userId, isBlocked: !isBlocked }).unwrap();
      showToast.success(
        `User ${isBlocked ? 'unblocked' : 'blocked'} successfully!`
      );
      onClose();
    } catch (error) {
      showToast.error(`Failed to ${isBlocked ? 'unblock' : 'block'} user`);
    }
  };

  const getActionIcon = () => {
    if (isLoading) return <RefreshCcw size={18} className="animate-spin" />;
    return isBlocked ? (
      <RefreshCcw size={18} />
    ) : (
      <Slash size={18} strokeWidth={2.5} />
    );
  };

  const getStatusText = () => (isBlocked ? 'Unblock User' : 'Block User');

  const footer = (
    <>
      <button
        type="button"
        className="modal-btn secondary"
        onClick={onClose}
        disabled={isLoading}
      >
        Cancel
      </button>
      <button
        type="button"
        className={`modal-btn ${isBlocked ? 'primary' : 'danger'}`}
        onClick={handleAction}
        disabled={isLoading}
      >
        {getActionIcon()}
        <span>{getStatusText()}</span>
      </button>
    </>
  );

  const getModalDescription = () => {
    if (isBlocked) return 'will regain access to the platform and features.';
    return 'will no longer be able to access the platform. You can unblock them at any time.';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="" // Custom title area
      width="550px"
      footer={footer}
    >
      <div className="block-user-content">
        <div className="warning-icon-container">
          <div className={`icon-circle ${isBlocked ? 'unblock' : 'block'}`}>
            {isBlocked ? <RefreshCcw size={32} /> : <Slash size={32} />}
          </div>
        </div>

        <div className="block-text-header">
          <h3>{isBlocked ? 'Unblock this user?' : 'Block this user?'}</h3>
          <p>
            {userName} {getModalDescription()}
          </p>
        </div>

        {!isBlocked && (
          <>
            <div className="form-group no-margin">
              <label htmlFor="block-message" className="form-label">
                <span>Message to send to user</span>
                <p className="field-hint">
                  This message will be sent by email and SMS to the user
                </p>
                <textarea
                  id="block-message"
                  placeholder="Your account has been temporarily suspended..."
                  defaultValue="Your account has been temporarily suspended. Please contact our support team at support@visionpme.com if you believe this is a mistake."
                />
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="block-reason" className="form-label">
                <span>Reason for block</span>
                <div className="select-wrapper">
                  <select id="block-reason">
                    <option>Select a reason...</option>
                    <option>Spam behavior</option>
                    <option>Policy violation</option>
                    <option>Payment failure</option>
                  </select>
                  <ChevronDown size={18} className="select-icon" />
                </div>
              </label>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

export default BlockUserModal;
