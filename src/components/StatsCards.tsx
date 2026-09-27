import { AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import React from 'react';
import type { FraudReport } from '../types';

interface StatsCardsProps {
  reports: FraudReport[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ reports }) => {
  const totalCases = reports.length;
  const pendingCases = reports.filter((r) => r.status === 'Pending').length;
  const confirmedCases = reports.filter((r) => r.status === 'ConfirmedFraud').length;
  const totalLoss = reports.reduce((acc, curr) => acc + (curr.estimatedLoss || 0), 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Reportes</span>
          <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{totalCases}</span>
          <span className="text-xs text-slate-400">casos registrados</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pendientes</span>
          <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-amber-400">{pendingCases}</span>
          <span className="text-xs text-slate-400">en revisión</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Fraudes Confirmados</span>
          <div className="rounded-lg bg-rose-500/10 p-2 text-rose-400">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-rose-400">{confirmedCases}</span>
          <span className="text-xs text-slate-400">detectados</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pérdida Estimada</span>
          <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-emerald-400">${totalLoss.toLocaleString()}</span>
          <span className="text-xs text-slate-400">USD acumulado</span>
        </div>
      </div>
    </div>
  );
};
