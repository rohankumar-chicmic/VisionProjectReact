import { AppLayoutProps } from '../AppLayout.d';

function PublicLayout({ children }: Readonly<AppLayoutProps>): JSX.Element {
  return <div>{children}</div>;
}

export default PublicLayout;
