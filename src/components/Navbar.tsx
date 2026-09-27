import { LogIn, LogOut, Plus, ShieldAlert, User as UserIcon } from 'lucide-react';
import React from 'react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenCreateModal }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-lg shadow-cyan-500/20">
            <ShieldAlert className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">Fraudex<span className="text-cyan-400">Py</span></span>
              <span className="rounded-full bg-cyan-950/70 px-2 py-0.5 text-xs font-semibold text-cyan-300 border border-cyan-800/60">v1.0 .NET 10</span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Plataforma de Inteligencia y Detección de Fraude</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button
                onClick={onOpenCreateModal}
                className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3.5 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-cyan-500/25 transition-all hover:bg-cyan-400 focus:outline-none cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Nuevo Reporte</span>
              </button>

              <div className="flex items-center gap-3 border-l border-slate-800 pl-3">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-sm font-medium text-slate-200">{user?.fullName || user?.username}</span>
                  <span className="text-xs text-slate-400">{user?.role}</span>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300">
                  <UserIcon className="h-4 w-4" />
                </div>
                <button
                  onClick={logout}
                  title="Cerrar sesión"
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-red-400 cursor-pointer"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 cursor-pointer border border-slate-700"
            >
              <LogIn className="h-4 w-4" />
              <span>Iniciar Sesión / Registro</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
