import { Loader2, Save } from 'lucide-react';

interface GrantFooterActionsProps {
  isSaving: boolean;
  isEditMode: boolean;
  onDiscard: () => void;
  onSave: () => void;
}

function GrantFooterActions({
  isSaving,
  isEditMode,
  onDiscard,
  onSave,
}: GrantFooterActionsProps) {
  return (
    <footer className="form-navigation">
      <button type="button" className="btn-secondary" onClick={onDiscard}>
        Discard Changes
      </button>
      <button
        type="button"
        className="btn-primary"
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <Save size={18} />
        )}
        <span>{isEditMode ? 'Update Grant' : 'Save Grant'}</span>
      </button>
    </footer>
  );
}

export default GrantFooterActions;
