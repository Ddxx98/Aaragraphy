import React from 'react';
import Dashboard from '../../views/Admin/Dashboard';

export const metadata = {
  title: 'Admin Dashboard | Aaragraphy',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboardPage() {
  return <Dashboard />;
}
