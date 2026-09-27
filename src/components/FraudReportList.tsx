import { AlertCircle, Calendar, Download, FileText, Search, User } from 'lucide-react';
import React from 'react';
import { apiClient } from '../api/client';
import type { ApiResponse, FileDownloadUrlResult, FraudReport } from '../types';

interface FraudReportListProps {
  reports: FraudReport[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  riskFilter: string;
  onRiskFilterChange: (value: string) => void;
}

export const FraudReportList: React.FC<FraudReportListProps> = ({
  reports,
  isLoading,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  riskFilter,
  onRiskFilterChange,
}) => {
  const handleDownloadAttachment = async (objectName: string) => {
    try {
      const response = await apiClient.get<ApiResponse<FileDownloadUrlResult>>(
        `/api/storage/download-url/${objectName}`
      );
      if (response.data.success && response.data.data?.downloadUrl) {
        window.open(response.data.data.downloadUrl, '_blank');
      } else {
        alert('No se pudo obtener el enlace de descarga de MinIO');
      }
    } catch (err: any) {
      alert('Error descargando archivo de MinIO: ' + (err.response?.data?.message || err.message));
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Critical':
        return <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-400 border border-rose-500/30">Crítico</span>;
      case 'High':
        return <span className="rounded-md bg-orange-500/10 px-2 py-0.5 text-xs font-semibold text-orange-400 border border-orange-500/30">Alto</span>;
      case 'Medium':
        return <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/30">Medio</span>;
      case 'Low':
      default:
        return <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">Bajo</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ConfirmedFraud':
        return <span className="rounded-full bg-rose-950 px-2.5 py-0.5 text-xs font-medium text-rose-300 border border-rose-800">Fraude Confirmado</span>;
      case 'UnderInvestigation':
        return <span className="rounded-full bg-cyan-950 px-2.5 py-0.5 text-xs font-medium text-cyan-300 border border-cyan-800">En Investigación</span>;
      case 'Dismissed':
        return <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-400 border border-slate-700">Desestimado</span>;
      case 'Pending':
      default:
        return <span className="rounded-full bg-amber-950 px-2.5 py-0.5 text-xs font-medium text-amber-300 border border-amber-800">Pendiente</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por título, sospechoso, descripción..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-2 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 focus:border-cyan-500 focus:outline-none cursor-pointer"
          >
            <option value="">Todos los Estados</option>
            <option value="Pending">Pendiente</option>
            <option value="UnderInvestigation">En Investigación</option>
            <option value="ConfirmedFraud">Fraude Confirmado</option>
            <option value="Dismissed">Desestimado</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => onRiskFilterChange(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 focus:border-cyan-500 focus:outline-none cursor-pointer"
          >
            <option value="">Todos los Riesgos</option>
            <option value="Low">Bajo</option>
            <option value="Medium">Medio</option>
            <option value="High">Alto</option>
            <option value="Critical">Crítico</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/30">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/20 py-16 text-center">
          <AlertCircle className="h-10 w-10 text-slate-600 mb-2" />
          <p className="text-base font-medium text-slate-300">No se encontraron reportes</p>
          <p className="text-xs text-slate-500 mt-1">Crea un nuevo caso de fraude o ajusta los filtros de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-sm transition-all hover:border-slate-700/80 hover:bg-slate-900/80"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold text-white">{report.title}</h3>
                    {getRiskBadge(report.riskLevel)}
                    {getStatusBadge(report.status)}
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{report.description}</p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <div className="text-lg font-bold text-cyan-400">
                    {report.currency} ${Number(report.estimatedLoss).toLocaleString()}
                  </div>
                  <span className="text-xs text-slate-500">Monto estimado</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3 text-xs text-slate-400">
                <div className="flex flex-wrap items-center gap-4">
                  {report.suspectIdentity && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <span className="text-slate-500">Sospechoso:</span> {report.suspectIdentity}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-500" />
                    <span>{report.reporterFullName || report.reporterUsername || 'Analista'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>{new Date(report.incidentDate || report.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>

                {report.attachmentObjectName && (
                  <button
                    onClick={() => handleDownloadAttachment(report.attachmentObjectName!)}
                    className="flex items-center gap-1 rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-cyan-300 hover:bg-slate-700 hover:text-cyan-200 transition cursor-pointer border border-slate-700"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>{report.attachmentFileName || 'Evidencia (MinIO)'}</span>
                    <Download className="h-3 w-3 ml-1" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
