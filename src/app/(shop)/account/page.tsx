'use client';

import Account from '@/components/pages/Account';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <Account />
    </ProtectedRoute>
  );
}
