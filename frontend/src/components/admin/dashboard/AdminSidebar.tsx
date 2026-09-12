'use client';

import React from 'react';

export type SidebarTab = 'dashboard' | 'properties' | 'leads' | 'clients';

interface AdminSidebarProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export default function AdminSidebar({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  onLogout
}: AdminSidebarProps) {
  const menuItems = [
    {
      id: 'dashboard' as SidebarTab,
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-4a1 1 0 011-1h4a1 1 0 011 1v8a1 1 0 01-1 1h-4a1 1 0 01-1-1v-8z" />
        </svg>
      )
    },
    {
      id: 'properties' as SidebarTab,
      label: 'Properties',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 'clients' as SidebarTab,
      label: 'Clients',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 'leads' as SidebarTab,
      label: 'Leads',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  return (
    <aside
      className={`h-full z-30 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out hidden md:flex flex-col justify-between flex-shrink-0 select-none overflow-hidden ${
        isCollapsed ? 'w-16 p-2.5' : 'w-52 p-3.5'
      }`}
    >
      <div>
        {/* Header with Toggle Arrow (< when expanded, > when collapsed) */}
        <div
          className={`flex items-center mb-3 pb-2 border-b border-slate-100 ${
            isCollapsed ? 'justify-center' : 'justify-between px-1.5'
          }`}
        >
          {!isCollapsed && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">
              Navigation
            </span>
          )}

          {/* Toggle Arrow Button inside Sidebar */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-slate-100 border border-slate-200/80 transition-colors flex items-center justify-center"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse to Icons'}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? (
              <svg className="w-4 h-4 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isCollapsed
                    ? 'justify-center py-2.5 px-0'
                    : 'gap-2.5 px-3 py-2 text-left'
                } ${
                  isActive
                    ? 'bg-navy-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                }`}
              >
                <span className={isActive ? 'text-gold-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                {!isCollapsed && <span className="font-sans truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Bottom: Sign Out Button - ALWAYS VISIBLE AT BOTTOM OF FRAME */}
      <div className="pt-3 pb-1 border-t border-slate-100 space-y-1.5 flex-shrink-0">
        <button
          type="button"
          onClick={onLogout}
          title={isCollapsed ? 'Sign Out' : undefined}
          className={`w-full flex items-center rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-100 transition-colors font-sans cursor-pointer ${
            isCollapsed ? 'justify-center py-2.5 px-0' : 'gap-2 px-3 py-2'
          }`}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!isCollapsed && <span>Sign Out</span>}
        </button>

        {!isCollapsed && (
          <div className="px-2 text-[10px] text-slate-400 font-sans truncate">
            admin@officespacenoida.com
          </div>
        )}
      </div>
    </aside>
  );
}
