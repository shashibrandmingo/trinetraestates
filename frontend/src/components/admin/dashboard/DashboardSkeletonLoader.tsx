'use client';

import React from 'react';
import Image from 'next/image';

export default function DashboardSkeletonLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        padding: '24px',
        boxSizing: 'border-box'
      }}
      className="min-h-screen w-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none"
    >
      {/* Main Centered Loader Box */}
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        className="flex flex-col items-center justify-center relative z-10"
      >
        {/* Centered Brand Logo Box */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            position: 'relative'
          }}
          className="w-18 h-18 rounded-2xl bg-white shadow-md border border-slate-200 flex items-center justify-center mb-4 relative"
        >
          <Image
            src="/brand-logo.png"
            alt="Noida Office Spaces"
            width={48}
            height={48}
            style={{ width: '48px', height: '48px', objectFit: 'contain' }}
            priority
          />
        </div>

        {/* Brand Name & Clean Loading Status */}
        <div style={{ textAlign: 'center' }} className="text-center space-y-2">
          <h2
            style={{ fontSize: '18px', fontWeight: 700, color: '#0a233c', margin: '0 0 6px 0', fontFamily: 'system-ui, sans-serif' }}
            className="text-lg font-bold text-navy-950 tracking-tight"
          >
            Noida Office Spaces
          </h2>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 14px',
              borderRadius: '9999px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              fontSize: '12px',
              fontWeight: 600,
              color: '#334155',
              fontFamily: 'system-ui, sans-serif'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
            <span>Loading Inventory...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
