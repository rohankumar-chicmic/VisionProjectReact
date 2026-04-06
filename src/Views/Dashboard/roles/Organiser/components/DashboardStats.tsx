import { Calendar, Ticket, Trophy } from 'lucide-react';
import KpiCard, { type KpiCardProps } from '../../../../../Components/Shared/KpiCard';

interface DashboardStatsProps {
  activeGalas: number;
  totalPrizePool: number;
  expectedGuests: number;
}

function DashboardStats({
  activeGalas,
  totalPrizePool,
  expectedGuests,
}: Readonly<DashboardStatsProps>) {
  const cards: KpiCardProps[] = [
    {
      icon: <Calendar size={22} />,
      label: 'Active Galas',
      value: activeGalas.toLocaleString(),
      trend: '+6%',
      trendType: 'up',
      color: '#3B82F6',
    },
    {
      icon: <Trophy size={22} />,
      label: 'Total Prize Pool',
      value: `$${totalPrizePool.toLocaleString()}`,
      trend: '+14%',
      trendType: 'up',
      color: '#F59E0B',
    },
    {
      icon: <Ticket size={22} />,
      label: 'Expected Guests',
      value: expectedGuests.toLocaleString(),
      trend: '+9%',
      trendType: 'up',
      color: '#00CE86',
    },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((card) => (
        <KpiCard key={`${card.label}-${card.value}`} {...card} />
      ))}
    </div>
  );
}

export default DashboardStats;
