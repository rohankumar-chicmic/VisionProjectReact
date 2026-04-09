import Table, { type Column } from '../../../../../Components/Atom/Table/Table';
import type { AdminApplication } from '../../../../../Services/Api/module/Admin/Application';

interface RecentApplicationsTableProps {
  data: AdminApplication[];
  isLoading: boolean;
}

const columns: Column<AdminApplication>[] = [
  { header: 'Applicant', accessor: 'applicantName' },
  { header: 'Gala', accessor: 'galaName' },
  { header: 'Grant', accessor: 'grantName' },
  {
    header: 'Score',
    accessor: (item) =>
      item.juryScore ? item.juryScore.toFixed(1) : 'Pending',
  },
];

function RecentApplicationsTable({
  data,
  isLoading,
}: Readonly<RecentApplicationsTableProps>) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <div>
          <h3>Application Oversight</h3>
          <p>Recent submissions that need coordination follow-up.</p>
        </div>
      </div>
      <Table columns={columns} data={data} isLoading={isLoading} />
    </section>
  );
}

export default RecentApplicationsTable;
