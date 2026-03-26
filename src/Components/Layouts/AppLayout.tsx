import AdminLayout from './AdminLayout';
import PublicLayout from './Public/PublicLayout';
import { AppLayoutProps } from './AppLayout.d';

function AppLayout({ isAuthenticated, children }: AppLayoutProps) {
  return isAuthenticated ? (
    <AdminLayout>{children}</AdminLayout>
  ) : (
    <PublicLayout>{children}</PublicLayout>
  );
}

export default AppLayout;
