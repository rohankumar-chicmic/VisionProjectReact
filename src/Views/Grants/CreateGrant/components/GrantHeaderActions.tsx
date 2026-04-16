import { Link2, Save, Send } from 'lucide-react';

interface GrantHeaderActionsProps {
  isGalaBuilderMode: boolean;
  isEditMode: boolean;
  isSaving: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
}

function GrantHeaderActions({
  isGalaBuilderMode,
  isEditMode,
  isSaving,
  onSaveDraft,
  onPublish,
}: Readonly<GrantHeaderActionsProps>) {
  if (isGalaBuilderMode) {
    return (
      <button
        type="button"
        className="header-btn btn-primary"
        onClick={onSaveDraft}
        disabled={isSaving}
      >
        <Link2 size={18} />
        <span>Link to Gala</span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        className="header-btn btn-outline"
        onClick={onSaveDraft}
        disabled={isSaving}
      >
        <Save size={18} />
        <span>{isEditMode ? 'Update' : 'Save Draft'}</span>
      </button>
      {isEditMode && (
        <button
          type="button"
          className="header-btn btn-primary"
          onClick={onPublish}
          disabled={isSaving}
        >
          <Send size={18} />
          <span>Publish</span>
        </button>
      )}
    </>
  );
}

export default GrantHeaderActions;
