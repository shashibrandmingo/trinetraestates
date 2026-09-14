import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  variant?: 'default' | 'highlight' | 'warning' | 'danger' | 'indigo' | 'teal' | 'blue';
  icon?: React.ReactNode;
  onClick?: () => void;
}

export default function StatCard({
  label,
  value,
  subLabel,
  variant = 'default',
  icon,
  onClick
}: StatCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          card: 'border-amber-200 bg-white hover:border-amber-300',
          lblColor: 'text-amber-900/80',
          valColor: 'text-amber-800',
          iconWrap: 'bg-amber-100 text-amber-700 border-amber-200/80'
        };
      case 'danger':
        return {
          card: 'border-rose-200 bg-white hover:border-rose-300',
          lblColor: 'text-rose-900/80',
          valColor: 'text-rose-700',
          iconWrap: 'bg-rose-100 text-rose-700 border-rose-200/80'
        };
      case 'highlight':
        return {
          card: 'border-emerald-200 bg-white hover:border-emerald-300',
          lblColor: 'text-emerald-900/80',
          valColor: 'text-emerald-800',
          iconWrap: 'bg-emerald-100 text-emerald-700 border-emerald-200/80'
        };
      case 'indigo':
        return {
          card: 'border-indigo-200 bg-white hover:border-indigo-300',
          lblColor: 'text-indigo-900/80',
          valColor: 'text-indigo-950',
          iconWrap: 'bg-indigo-100 text-indigo-700 border-indigo-200/80'
        };
      case 'teal':
        return {
          card: 'border-teal-200 bg-white hover:border-teal-300',
          lblColor: 'text-teal-900/80',
          valColor: 'text-teal-900',
          iconWrap: 'bg-teal-100 text-teal-700 border-teal-200/80'
        };
      case 'blue':
      default:
        return {
          card: 'border-blue-200 bg-white hover:border-blue-300',
          lblColor: 'text-blue-900/80',
          valColor: 'text-navy-950',
          iconWrap: 'bg-blue-100/90 text-blue-700 border-blue-200/80'
        };
    }
  };

  const st = getVariantStyles();

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border py-2 px-2.5 sm:py-2.5 sm:px-3.5 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between min-h-[76px] sm:min-h-[88px] ${
        st.card
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between gap-1 mb-0.5 sm:mb-1">
        <span className={`text-[9px] sm:text-[10.5px] font-bold uppercase tracking-wider font-sans truncate ${st.lblColor}`}>
          {label}
        </span>
        {icon && (
          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md flex items-center justify-center shrink-0 border ${st.iconWrap}`}>
            {icon}
          </div>
        )}
      </div>

      <div className={`font-heading text-base sm:text-xl font-bold tracking-tight ${st.valColor} my-0.5 leading-tight`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>

      {subLabel && (
        <div className="text-[8.5px] sm:text-[10px] font-medium text-slate-500 font-sans truncate">
          {subLabel}
        </div>
      )}
    </div>
  );
}
