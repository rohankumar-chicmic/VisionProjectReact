import React, { useState } from 'react';
import { Plus, Trash2, Edit2, GripVertical, CheckCircle2 } from 'lucide-react';
import Modal from '../../../Components/Atom/Modal/Modal';
import './RequirementsModal.scss';

interface Requirement {
  id: string;
  text: string;
  enabled: boolean;
}

interface RequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (requirements: Requirement[]) => void;
  initialRequirements?: Requirement[];
}

const RequirementsModal: React.FC<RequirementsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRequirements = []
}) => {
  const [requirements, setRequirements] = useState<Requirement[]>(
    initialRequirements.length > 0 ? initialRequirements : [
      { id: '1', text: 'Must be registered business entity', enabled: true },
      { id: '2', text: 'Active technology development', enabled: true },
      { id: '3', text: 'Must attend gala event', enabled: true },
      { id: '4', text: 'Minimum 2 years in business', enabled: true },
      { id: '5', text: 'Must have revenue generating product', enabled: true },
      { id: '6', text: 'Located in Quebec province', enabled: true },
    ]
  );
  const [newReq, setNewReq] = useState('');

  const handleAdd = () => {
    if (!newReq.trim()) return;
    setRequirements([
      ...requirements,
      { id: Date.now().toString(), text: newReq, enabled: true }
    ]);
    setNewReq('');
  };

  const toggleReq = (id: string) => {
    setRequirements(requirements.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const removeReq = (id: string) => {
    setRequirements(requirements.filter(r => r.id !== id));
  };

  const footer = (
    <div className="modal-footer-btns">
      <button className="btn-cancel" onClick={onClose}>Cancel</button>
      <button className="btn-save" onClick={() => onSave(requirements)}>
        <CheckCircle2 size={16} />
        <span>Save Requirements</span>
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Additional Requirements"
      subtitle="Add, edit, or remove eligibility requirements for this grant"
      width="600px"
      footer={footer}
    >
      <div className="requirements-modal-content">
        <div className="add-requirement-row">
          <label>Add New Requirement</label>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Type new requirement..." 
              value={newReq}
              onChange={(e) => setNewReq(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button className="btn-add" onClick={handleAdd}>
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>
        </div>

        <div className="requirements-list-container">
          <label>Current Requirements ({requirements.length})</label>
          <div className="requirements-list">
            {requirements.map((req) => (
              <div key={req.id} className="requirement-item">
                <GripVertical size={16} className="drag-handle" />
                <div 
                  className={`custom-checkbox ${req.enabled ? 'checked' : ''}`}
                  onClick={() => toggleReq(req.id)}
                >
                  {req.enabled && <CheckCircle2 size={14} />}
                </div>
                <div className="req-text">{req.text}</div>
                <div className="item-actions">
                  <button className="icon-btn edit"><Edit2 size={14} /></button>
                  <button className="icon-btn delete" onClick={() => removeReq(req.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RequirementsModal;
