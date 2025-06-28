'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';

export default function AuthRedirector() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      const userType = session.user.user_metadata?.user_type || 'customer';
      
      switch (userType) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'reseller':
          router.push('/revendedor');
          break;
        default:
          router.push('/');
      }
    }
  }, [session, router]);

  return null;
}
