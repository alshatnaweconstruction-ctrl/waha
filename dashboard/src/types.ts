export type AdStatus = 'active' | 'draft' | 'archived' | 'pending';

export interface ConstructionService {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  unit: string;
  description: string;
  isActive: boolean;
}

export interface BazarakiAd {
  id: string;
  title: string;
  category: string;
  price: number;
  status: AdStatus;
  views: number;
  lastUpdated: string;
}

export interface SystemSettings {
  whatsappNotifications: boolean;
  telegramSync: boolean;
  bazarakiAutoRotate: boolean;
  apiKey: string;
}

export interface DashboardStats {
  totalLeads: number;
  activeAds: number;
  completedJobs: number;
  conversionRate: number;
}

export interface PipelineLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}
