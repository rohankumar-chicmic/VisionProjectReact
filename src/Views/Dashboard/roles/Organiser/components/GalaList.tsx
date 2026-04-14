import Table, { type Column } from '../../../../../Components/Atom/Table/Table';
import type { GalaItem } from '../../../../../Services/Api/module/Organiser/Gala';
import formatNumberWithUnits from '../../../../../Shared/Utils/numbers';

interface OrganiserGalaListProps {
  data: GalaItem[];
  isLoading: boolean;
}

const columns: Column<GalaItem>[] = [
  { header: 'Gala', accessor: 'name' },
  {
    header: 'Venue',
    accessor: (item) => {
      const cityPrefix = item.city ? `, ${item.city}` : '';
      return `${item.venue}${cityPrefix}`;
    },
  },
  {
    header: 'Date',
    accessor: (item) => new Date(item.eventDate).toLocaleDateString(),
  },
  {
    header: 'Prize Pool',
    accessor: (item) => `$${formatNumberWithUnits(item.totalGalaValue)}`,
  },
];

function GalaList({ data, isLoading }: Readonly<OrganiserGalaListProps>) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <div>
          <h3>Gala List</h3>
          <p>Recent gala setups that organisers can continue refining.</p>
        </div>
      </div>
      <Table columns={columns} data={data} isLoading={isLoading} />
    </section>
  );
}

export default GalaList;
