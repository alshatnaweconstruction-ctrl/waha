/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CheckCircle2, Clock, ShieldCheck, XOctagon, CalendarRange } from 'lucide-react';
import { DashboardStats } from '../types';

interface StatsGridProps {
  stats: DashboardStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const nextRunFormatted = stats.nextScheduledRun
    ? new Date(stats.nextScheduledRun).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Not Scheduled';

  const cards = [
    {
      id: "stat-published",
      title: 'Live Published Ads',
      value: stats.totalPublished,
      description: 'Active on Bazaraki XML Feed',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      darkText: 'text-emerald-700',
    },
    {
      id: "stat-pending",
      title: 'Pending Review',
      value: stats.pendingReview,
      description: 'Awaiting Telegram action',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      darkText: 'text-amber-700',
    },
    {
      id: "stat-rewritten",
      title: 'Duplicate Prevented',
      value: stats.autoRewrites,
      description: 'Auto-rewritten ad loops',
      icon: ShieldCheck,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      darkText: 'text-blue-700',
    },
    {
      id: "stat-rejected",
      title: 'Auto-Rejected / Skipped',
      value: stats.totalRejected,
      description: 'Similarity exceeded limits',
      icon: XOctagon,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      darkText: 'text-rose-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            id={card.id}
            className={`p-5 rounded-xl border ${card.color} flex items-center justify-between shadow-sm hover:shadow transition-shadow`}
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </p>
              <h3 className={`text-3xl font-bold font-display mt-1 ${card.darkText}`}>
                {card.value}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 font-sans">
                {card.description}
              </p>
            </div>
            <div className={`p-3 rounded-xl bg-white shadow-xs`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
