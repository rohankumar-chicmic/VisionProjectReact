import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Calendar as CalendarIcon,
} from 'lucide-react';
import Modal from '../../../Components/Atom/Modal/Modal';
import './ApplicationModals.scss';
import UserIcon from '../../../Components/Atom/UserIcon';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string, notify: boolean) => void;
  currentDate: string;
  applicantName: string;
}

function RescheduleInterviewModal({
  isOpen,
  onClose,
  onConfirm,
  currentDate,
  applicantName,
}: Readonly<RescheduleModalProps>) {
  const [selectedDate, setSelectedDate] = useState<number | null>(12);
  const [selectedTime, setSelectedTime] = useState<string>('10:30 AM');
  const [notify, setNotify] = useState(true);

  const timeslots = [
    '9:00 AM',
    '9:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '2:00 PM',
    '2:30 PM',
    '3:00 PM',
    '3:30 PM',
    '4:00 PM',
  ];

  const handleConfirm = () => {
    onConfirm(`March ${selectedDate}, 2026`, selectedTime, notify);
  };

  const footer = (
    <div className="modal-actions-footer">
      <button type="button" className="btn-cancel" onClick={onClose}>
        Cancel
      </button>
      <button
        type="button"
        className="btn-confirm-reschedule"
        onClick={handleConfirm}
      >
        <span>Confirm Reschedule</span>
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reschedule Interview"
      subtitle="Select a new date and time slot for the interview"
      footer={footer}
      width="600px"
    >
      <div className="reschedule-modal-content">
        <div className="current-schedule-alert">
          <div className="icon">
            <Info size={16} />
          </div>
          <div className="details">
            <h4>Current Schedule</h4>
            <div className="row">
              <CalendarIcon size={14} />
              <span>{currentDate}</span>
            </div>
            <div className="row">
              <UserIcon />
              <span>Scheduled by applicant ({applicantName})</span>
            </div>
          </div>
        </div>

        <div className="form-group mb-1">
          <label>Select New Date *</label>
          <div className="calendar-widget">
            <div className="cal-header">
              <button type="button" className="arrow-btn">
                <ChevronLeft size={16} />
              </button>
              <span className="month-year">March 2026</span>
              <button type="button" className="arrow-btn">
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="cal-grid">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                <div key={d} className="day-header">
                  {d}
                </div>
              ))}
              {[
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
              ].map((d) => (
                <button
                  type="button"
                  key={d}
                  className={`cal-day ${selectedDate === d ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group mb-2">
          <label>Select Time Slot *</label>
          <div className="time-slots-grid">
            {timeslots.map((t) => (
              <button
                type="button"
                key={t}
                className={`time-pill ${selectedTime === t ? 'selected' : ''}`}
                onClick={() => setSelectedTime(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="checkbox-wrap mt-2"
          onClick={() => setNotify(!notify)}
        >
          <div className={`checkbox ${notify ? 'checked' : ''}`}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={notify ? 'block' : 'hidden'}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span>
            Send email notification to applicant about the schedule change
          </span>
        </button>
      </div>
    </Modal>
  );
}

export default RescheduleInterviewModal;
