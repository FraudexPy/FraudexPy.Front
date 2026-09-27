import { Activity, Database, RefreshCw, Server } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { apiClient } from './api/client';
import { AuthModal } from './components/AuthModal';
import { CreateReportModal } from './components/CreateReportModal';
import { FraudReportList } from './components/FraudReportList';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { AuthProvider, useAuth } from './context/AuthContext';
import type { ApiResponse, FraudReport } from './types';

const DashboardContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [reports, setReports] = useState<FraudReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('');

  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (riskFilter) params.riskLevel = riskFilter;

      const response = await apiClient.get<ApiResponse<FraudReport[]>>('/api/fraudreports', {
        params,
      });

      if (response.data.success && response.data.data) {
        setReports(response.data.data);
      }
    } catch {
      // Set sample mock data if API is starting or in demo mode without DB
      if (reports.length === 0) {
        setReports([
          {
            id: '1',
            title: 'Transferencias sospechosas SPEI / SIPAP recurrentes',
            description: 'Múltiples transacciones fraccionadas por montos inferiores al umbral de control en menos de 10 minutos.',
            suspectIdentity: 'Cuenta 0981-XXXX-3342',
            estimatedLoss: 14500,
            currency: 'USD',
            status: 'ConfirmedFraud',
            riskLevel: 'Critical',
            incidentDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            reportedByUserId: 'sample-user-1',
            reporterUsername: 'analyst_carlos',
            reporterFullName: 'Carlos Rodriguez',
          },
          {
            id: '2',
            title: 'Intento de phishing mediante clonación de portal bancario',
            description: 'Detección de dominio malicioso apuntando a pasarelas de pago y credenciales interceptadas.',
            suspectIdentity: 'IP 185.220.101.5',
            estimatedLoss: 3200,
            currency: 'USD',
            status: 'UnderInvestigation',
            riskLevel: 'High',
            incidentDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            reportedByUserId: 'sample-user-2',
            reporterUsername: 'analyst_maria',
            reporterFullName: 'Maria Gonzalez',
          }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, statusFilter, riskFilter, reports.length]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCreateModal={() => {
          if (!isAuthenticated) {
            setIsAuthOpen(true);
          } else {
            setIsCreateOpen(true);
          }
        }}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Motor Anti-Fraude Activo
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Server className="h-3 w-3" /> .NET 10 API
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Database className="h-3 w-3" /> MySQL + MinIO S3
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Monitoreo y Prevención de Fraudes
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Registro, análisis forense, correlación de identidades y evidencias adjuntas en almacenamiento MinIO.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchReports}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  setIsAuthOpen(true);
                } else {
                  setIsCreateOpen(true);
                }
              }}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition cursor-pointer"
            >
              <Activity className="h-4 w-4" />
              <span>Reportar Incidente</span>
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <StatsCards reports={reports} />

        {/* Main List and Controls */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-4 sm:p-6 backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Casos de Fraude Registrados</h2>
              <p className="text-xs text-slate-400">Listado consolidado con trazabilidad y adjuntos</p>
            </div>
          </div>

          <FraudReportList
            reports={reports}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            riskFilter={riskFilter}
            onRiskFilterChange={setRiskFilter}
          />
        </div>
      </main>

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CreateReportModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onReportCreated={fetchReports}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}

export default App;
