import type { CreateGalaWizardValues } from './types';

interface ReviewStepProps {
  values: CreateGalaWizardValues;
  totalPrizePool: number;
  estimatedTicketPrice: number;
}

function ReviewStep({
  values,
  totalPrizePool,
  estimatedTicketPrice,
}: Readonly<ReviewStepProps>) {
  return (
    <div className="wizard-body">
      <div className="dashboard-section-header">
        <div>
          <h3>Review</h3>
          <p>Sanity-check the gala setup before final publishing.</p>
        </div>
      </div>

      <div className="review-grid">
        <div className="review-card">
          <h4>Basic Info</h4>
          <p>{values.name || 'Untitled gala'}</p>
          <p>
            {values.venue || 'Venue TBD'}
            {values.city ? `, ${values.city}` : ''}
          </p>
          <p>{values.eventDate || 'Date TBD'}</p>
        </div>

        <div className="review-card">
          <h4>Attendance & Pricing</h4>
          <p>Expected attendees: {values.expectedAttendees || 0}</p>
          <p>Total prize pool: ${totalPrizePool.toLocaleString()}</p>
          <p>Estimated ticket price: ${estimatedTicketPrice.toFixed(2)}</p>
        </div>

        <div className="review-card">
          <h4>Grant Lineup</h4>
          <ul className="list-stack">
            {values.grants.map((grant) => (
              <li key={`${grant.name}-${grant.prizeAmount}`}>
                <div className="metric-copy">
                  <strong>{grant.name || 'Untitled Grant'}</strong>
                  <span>{grant.slots || 0} prize slots</span>
                </div>
                <span className="metric-value">
                  ${(grant.prizeAmount * grant.slots).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="review-card">
          <h4>Jury Assignment</h4>
          <ul className="list-stack">
            {values.juryAssignments.map((member) => (
              <li key={`${member.email}-${member.name}`}>
                <div className="metric-copy">
                  <strong>{member.name || 'Pending assignment'}</strong>
                  <span>{member.expertise || 'Expertise TBD'}</span>
                </div>
                <span className="dashboard-tag-muted">
                  {member.email || 'No email'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ReviewStep;
