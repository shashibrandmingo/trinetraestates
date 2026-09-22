import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-scope font-poppins min-h-screen bg-[#ebebeb] text-[#0c1a30]">
      {children}
    </div>
  );
}
