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

  // Normalize options
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close when clicking outside
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
      {/* Trigger Button with Rounded Border */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border rounded-xl px-3 py-2 text-xs font-medium text-navy-900 flex items-center justify-between cursor-pointer transition-all duration-200 outline-none ${
          isOpen
            ? 'border-gold-500 ring-2 ring-gold-500/20 shadow-xs'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <span className={selectedOption ? 'text-navy-900' : 'text-slate-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-gold-500' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Floating Dropdown Menu with Rounded Borders */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center justify-between my-0.5 ${
                  isSelected
                    ? 'bg-gold-50 text-gold-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-navy-950'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <span className="text-gold-600 font-bold text-xs">✓</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
