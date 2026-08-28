/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ConstructionService {
  id: string;
  name: string;
  usp: string;
  lastPostedAt: string | null;
  isActive: boolean;
  displayOrder: number;
}

export type AdStatus = 'draft' | 'pending_approval' | 'published' | 'rejected' | 'rewriting';

export interface AdRewriteHistory {
  title: string;
  body: string;
  similarityScore: number;
  timestamp: string;
  note: string;
}

export interface BazarakiAd {
  id: string;
  serviceId: string;
  serviceName: string;
  title: string;
  body: string;
  similarityScore: number;
  similarityComparisonListingId: string | null;
  status: AdStatus;
  createdAt: string;
  postedAt: string | null;
  telegramMessageId: string | null;
  history: AdRewriteHistory[];
}

export interface SystemSettings {
  telegramBotToken: string;
  telegramChatId: string;
  useRealTelegram: boolean;
  bazarakiPhone: string;
  bazarakiLocation: string;
  bazarakiCategory: string;
  n8nWebhookUrl: string;
  schedulerActive: boolean;
  schedulerHour: number;
  schedulerMinute: number;
}

export interface PipelineLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export interface DashboardStats {
  totalPublished: number;
  pendingReview: number;
  totalRejected: number;
  autoRewrites: number;
  nextScheduledRun: string | null;
}
