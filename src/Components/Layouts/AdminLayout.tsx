import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { HeaderProvider } from '../../Shared/Context/HeaderContext';
import './AdminLayout.scss';

function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <HeaderProvider>
      <div className="admin-layout">
        <Sidebar />
        <div className="main-content">
          <Header />
          <main className="page-content">{children || <Outlet />}</main>
        </div>
      </div>
    </HeaderProvider>
  );
}

export default AdminLayout;
