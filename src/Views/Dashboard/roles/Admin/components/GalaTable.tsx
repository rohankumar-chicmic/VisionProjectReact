import Table, { type Column } from '../../../../../Components/Atom/Table/Table';
import type { GalaItem } from '../../../../../Services/Api/module/Admin/Gala';

interface GalaTableProps {
  data: GalaItem[];
  isLoading: boolean;
}

const columns: Column<GalaItem>[] = [
  { header: 'Gala', accessor: 'name' },
  {
    header: 'Date',
    accessor: (item) => new Date(item.eventDate).toLocaleDateString(),
  },
  {
    header: 'Attendees',
    accessor: (item) => (item.expectedAttendees ?? 0).toLocaleString(),
  },
  {
    header: 'Prize Pool',
    accessor: (item) => `$${(item.totalPrizePool ?? 0).toLocaleString()}`,
  },
];

function GalaTable({ data, isLoading }: Readonly<GalaTableProps>) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <div>
          <h3>Gala Table</h3>
          <p>Track the next events that need publishing attention.</p>
        </div>
        <span className="dashboard-section-note">{data.length} visible</span>
      </div>
      <Table columns={columns} data={data} isLoading={isLoading} />
    </section>
  );
}

export default GalaTable;
