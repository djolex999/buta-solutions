'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, AdminUser } from '@/lib/auth';

export function useAdminAuth() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getMe().then((user) => {
      if (!user) {
        router.replace('/admin/login');
      } else {
        setAdmin(user);
      }
      setChecking(false);
    });
  }, [router]);

  return { admin, checking };
}
