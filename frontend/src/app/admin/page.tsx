'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (token) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center">
      <div className="flex items-center gap-3 text-navy-900 font-semibold text-sm">
        <span className="w-5 h-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        <span>Loading Admin Portal...</span>
      </div>
    </div>
  );
}
