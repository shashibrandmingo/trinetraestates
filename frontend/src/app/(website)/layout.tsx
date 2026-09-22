import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="website-scope min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-body)]">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
