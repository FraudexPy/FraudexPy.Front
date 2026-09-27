import { AlertCircle, Upload, X } from 'lucide-react';
import React, { useState } from 'react';
import { apiClient } from '../api/client';
import type { ApiResponse, FileUploadResult, FraudReport } from '../types';

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportCreated: () => void;
}

export const CreateReportModal: React.FC<CreateReportModalProps> = ({ isOpen, onClose, onReportCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [suspectIdentity, setSuspectIdentity] = useState('');
  const [estimatedLoss, setEstimatedLoss] = useState<number>(0);
  const [currency, setCurrency] = useState('USD');
  const [riskLevel, setRiskLevel] = useState('Medium');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setErrorMessage('El título del caso es obligatorio.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      let attachmentObjectName: string | null = null;
      let attachmentFileName: string | null = null;
      let attachmentContentType: string | null = null;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadRes = await apiClient.post<ApiResponse<FileUploadResult>>('/api/storage/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (uploadRes.data.success && uploadRes.data.data) {
          attachmentObjectName = uploadRes.data.data.objectName;
          attachmentFileName = uploadRes.data.data.originalFileName;
          attachmentContentType = uploadRes.data.data.contentType;
        }
      }

      const reportPayload = {
        title,
        description,
        suspectIdentity,
        estimatedLoss: Number(estimatedLoss),
        currency,
        riskLevel,
        incidentDate: new Date(incidentDate).toISOString(),
        attachmentObjectName,
        attachmentFileName,
        attachmentContentType,
      };

      const res = await apiClient.post<ApiResponse<FraudReport>>('/api/fraudreports', reportPayload);
      if (res.data.success) {
        onReportCreated();
        onClose();
      } else {
        setErrorMessage(res.data.message || 'Error creando reporte');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Error en la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-white">Nuevo Caso de Fraude</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-400 border border-rose-500/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Título del Caso *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Clonación de Tarjeta / Phishing Masivo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Descripción / Detalles
            </label>
            <textarea
              rows={3}
              placeholder="Describa el patrón de fraude detectado, IPs, transferencias sospechosas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Sospechoso / Cédula / IP / Cuenta
              </label>
              <input
                type="text"
                placeholder="Ej: John Doe / 192.168.1.50"
                value={suspectIdentity}
                onChange={(e) => setSuspectIdentity(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Fecha del Incidente
              </label>
              <input
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Pérdida Estimada
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={estimatedLoss}
                onChange={(e) => setEstimatedLoss(parseFloat(e.target.value) || 0)}
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Moneda
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="USD">USD</option>
                <option value="PYG">PYG (Guaraní)</option>
                <option value="EUR">EUR</option>
                <option value="BRL">BRL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Nivel de Riesgo
              </label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="Low">Bajo</option>
                <option value="Medium">Medio</option>
                <option value="High">Alto</option>
                <option value="Critical">Crítico</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Adjuntar Evidencia (Almacenamiento MinIO)
            </label>
            <div className="mt-1 flex items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-950 p-4 text-center">
              <label className="flex flex-col items-center cursor-pointer">
                <Upload className="h-6 w-6 text-slate-400 mb-1" />
                <span className="text-xs text-slate-300">
                  {selectedFile ? selectedFile.name : 'Haz clic para seleccionar comprobante, log o captura'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50 cursor-pointer shadow-md shadow-cyan-500/20"
            >
              {isSubmitting ? 'Guardando...' : 'Crear Reporte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
