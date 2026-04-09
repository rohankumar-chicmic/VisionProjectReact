import Table, { type Column } from '../../../../../Components/Atom/Table/Table';
import type { AdminUser } from '../../../../../Services/Api/module/Admin/User';

interface UserTableProps {
  data: AdminUser[];
  isLoading: boolean;
}

const columns: Column<AdminUser>[] = [
  { header: 'User', accessor: 'fullName' },
  { header: 'Email', accessor: 'email' },
  {
    header: 'Passport',
    accessor: (item) => item.passportStatus || 'Unavailable',
  },
  {
    header: 'Status',
    accessor: (item) => (
      <span className={`status-pill ${item.isBlocked ? 'warning' : 'success'}`}>
        {item.isBlocked ? 'Blocked' : 'Active'}
      </span>
    ),
  },
];

function UserTable({ data, isLoading }: Readonly<UserTableProps>) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <div>
          <h3>User Table</h3>
          <p>Keep an eye on subscription health and account status.</p>
        </div>
        <span className="dashboard-section-note">{data.length} visible</span>
      </div>
      <Table columns={columns} data={data} isLoading={isLoading} />
    </section>
  );
}

export default UserTable;
