import React from 'react';

interface RevenueCardProps {
  amountFormatted: string;
  periodLabel?: string;
}

export default function RevenueCard({
  amountFormatted,
  periodLabel = 'This Month'
}: RevenueCardProps) {
  return (
    <div className="rounded-xl border border-gold-300/80 bg-white py-2.5 px-3.5 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between relative overflow-hidden min-h-[76px] sm:min-h-[88px]">
      <div className="flex items-center justify-between gap-1 mb-0.5 sm:mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] sm:text-[10.5px] font-bold uppercase tracking-wider text-gold-900 font-sans">
            My Revenue
          </span>
        </div>
        <span className="text-[8.5px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-gold-100 text-gold-900 border border-gold-200/70">
          +14.2% YoY
        </span>
      </div>

      <div className="font-heading text-base sm:text-xl font-bold tracking-tight text-gold-700 my-0.5 leading-tight">
        {amountFormatted}
      </div>

      <div className="text-[8.5px] sm:text-[10px] font-medium text-slate-500 flex items-center gap-1.5 font-sans truncate">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="truncate">{periodLabel} (Verified Billing)</span>
      </div>
    </div>
  );
}
