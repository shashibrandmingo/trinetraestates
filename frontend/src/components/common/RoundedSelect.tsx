'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface RoundedSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  className?: string;
}

export const RoundedSelect: React.FC<RoundedSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to { value, label } shape
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* ── Trigger Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-[#141414] flex items-center justify-between cursor-pointer transition-all duration-200 outline-none hover:border-gray-300"
        style={
          isOpen
            ? { borderColor: '#c69960', boxShadow: '0 0 0 3px rgba(198,153,96,0.15)' }
            : { borderColor: '#e5e7eb' }
        }
      >
        <span style={{ color: selectedOption ? '#141414' : '#9ca3af' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className="w-3.5 h-3.5 transition-transform duration-200"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: isOpen ? '#c69960' : '#9ca3af',
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Floating Dropdown ── */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-1.5 z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className="px-3.5 py-2.5 rounded-lg text-[13px] font-semibold cursor-pointer transition-colors flex items-center justify-between my-0.5"
                style={
                  isSelected
                    ? { background: 'rgba(198,153,96,0.08)', color: '#141414' }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLDivElement).style.background = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLDivElement).style.background = '';
                  }
                }}
              >
                <span style={{ color: isSelected ? '#141414' : '#374151' }}>
                  {opt.label}
                </span>
                {isSelected && (
                  <span className="font-bold text-xs" style={{ color: '#c69960' }}>✓</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
