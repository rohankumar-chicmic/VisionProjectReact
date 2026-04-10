import {
  CheckCircle2,
  Clock,
  ListTodo,
  Award,
  Calendar,
  LayoutList,
} from 'lucide-react';
import { JurySummaryData } from '../../../../../Services/Api/module/JuryApi';

interface JurySummaryProps {
  data: JurySummaryData;
}

function JurySummary({ data }: Readonly<JurySummaryProps>) {
  const stats = [
    {
      label: 'Assigned Applications',
      value: (data?.assignedApplicationsCount ?? 0).toString(),
      icon: ListTodo,
      color: '#3b82f6',
    },
    {
      label: 'Pending Reviews',
      value: (data?.pendingReviewsCount ?? 0).toString(),
      icon: Clock,
      color: '#f59e0b',
    },
    {
      label: 'Completed Reviews',
      value: (data?.completedReviewsCount ?? 0).toString(),
      icon: CheckCircle2,
      color: '#00ce86',
    },
    {
      label: 'Linked Grants',
      value: (data?.linkedGrantsCount ?? 0).toString(),
      icon: Award,
      color: '#8b5cf6',
    },
    {
      label: 'Scheduled Interviews',
      value: (data?.scheduledInterviewsCount ?? 0).toString(),
      icon: Calendar,
      color: '#ec4899',
    },
    {
      label: 'Pending Evaluations',
      value: (data?.pendingEvaluationsCount ?? 0).toString(),
      icon: LayoutList,
      color: '#06b6d4',
    },
  ];

  return (
    <section className="jury-summary-cards">
      {stats.map((stat) => (
        <div key={stat.label} className="summary-card">
          <div
            className="card-icon"
            style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
          >
            <stat.icon size={24} />
          </div>
          <div className="card-info">
            <span className="label">{stat.label}</span>
            <strong className="value">{stat.value}</strong>
          </div>
        </div>
      ))}
    </section>
  );
}

export default JurySummary;
