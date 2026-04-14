import {
  Calendar,
  Ticket,
  Trophy,
  Target,
  FileText,
  Clock,
  CheckCircle,
  Award,
} from 'lucide-react';
import KpiCard, {
  type KpiCardProps,
} from '../../../../../Components/Shared/KpiCard';
import { OrganiserGalaSummaryData } from '../../../../../Services/Api/module/Organiser/Gala';
import { OrganiserGrantSummaryData } from '../../../../../Services/Api/module/Organiser/Grant';
import formatNumberWithUnits from '../../../../../Shared/Utils/numbers';

interface DashboardStatsProps {
  galaSummary: OrganiserGalaSummaryData | null | undefined;
  grantSummary: OrganiserGrantSummaryData | null | undefined;
}

function DashboardStats({
  galaSummary,
  grantSummary,
}: Readonly<DashboardStatsProps>) {
  const cards: KpiCardProps[] = [
    {
      icon: <Calendar size={22} />,
      label: 'Total Galas',
      value: galaSummary?.totalGalas.toLocaleString() ?? '0',
      color: '#3B82F6',
    },
    {
      icon: <FileText size={22} />,
      label: 'Draft Galas',
      value: galaSummary?.draftGalas.toLocaleString() ?? '0',
      color: '#6B7280', // Gray
    },
    {
      icon: <Clock size={22} />,
      label: 'Upcoming Galas',
      value: galaSummary?.upcomingGalas.toLocaleString() ?? '0',
      color: '#F97316', // Orange
    },
    {
      icon: <Target size={22} />,
      label: 'Active Programs',
      value: grantSummary?.activePrograms.toLocaleString() ?? '0',
      color: '#8B5CF6', // Purple
    },
    {
      icon: <CheckCircle size={22} />,
      label: 'Completed Galas',
      value: galaSummary?.completedGalas.toLocaleString() ?? '0',
      color: '#10B981', // Green
    },
    {
      icon: <Award size={22} />,
      label: 'Total Grants',
      value: grantSummary?.totalGrants.toLocaleString() ?? '0',
      color: '#EC4899', // Pink
    },
    {
      icon: <Ticket size={22} />,
      label: 'Applications',
      value: grantSummary?.totalApplicants.toLocaleString() ?? '0',
      color: '#00CE86', // Primary Teal/Green
    },
    {
      icon: <Trophy size={22} />,
      label: 'Total Prize Pool',
      value: `$${formatNumberWithUnits(grantSummary?.totalFundAmount)}`,
      color: '#F59E0B', // Amber
    },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((card) => (
        <KpiCard
          key={`${card.label}-${card.value}`}
          icon={card.icon}
          label={card.label}
          value={card.value}
          trend={card.trend}
          trendType={card.trendType}
          color={card.color}
        />
      ))}
    </div>
  );
}

export default DashboardStats;
