export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface FraudReport {
  id: string;
  title: string;
  description: string;
  suspectIdentity: string;
  estimatedLoss: number;
  currency: string;
  status: 'Pending' | 'UnderInvestigation' | 'ConfirmedFraud' | 'Dismissed' | string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' | string;
  attachmentObjectName?: string | null;
  attachmentFileName?: string | null;
  attachmentContentType?: string | null;
  incidentDate: string;
  createdAt: string;
  reportedByUserId: string;
  reporterUsername?: string | null;
  reporterFullName?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface FileUploadResult {
  objectName: string;
  originalFileName: string;
  contentType: string;
  fileSizeBytes: number;
}

export interface FileDownloadUrlResult {
  objectName: string;
  downloadUrl: string;
  expirationSeconds: number;
}
