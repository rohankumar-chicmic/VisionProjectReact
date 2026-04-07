import { CalendarPlus } from 'lucide-react';

interface CreateGalaCTAProps {
  isOpen: boolean;
  onToggle: () => void;
}

function CreateGalaCTA({ isOpen, onToggle }: Readonly<CreateGalaCTAProps>) {
  return (
    <section className="dashboard-highlight-card">
      <div>
        <h3>Create Gala CTA</h3>
        <p>
          Start a gala plan from the dashboard, price it live from the grant
          pool, and assign jury members before publishing.
        </p>
      </div>

      <div className="dashboard-highlight-actions">
        <button
          type="button"
          className="dashboard-btn primary"
          onClick={onToggle}
        >
          <CalendarPlus size={18} />
          <span>{isOpen ? 'Hide Wizard' : 'Launch Wizard'}</span>
        </button>
        <span className="dashboard-tag-muted">5 steps</span>
      </div>
    </section>
  );
}

export default CreateGalaCTA;
