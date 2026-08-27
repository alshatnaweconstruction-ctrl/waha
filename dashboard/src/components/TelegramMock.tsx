/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Send, Check, X, ShieldAlert, CircleDot, Info, ArrowUpRight } from 'lucide-react';
import { BazarakiAd } from '../types';

interface TelegramMockProps {
  listings: BazarakiAd[];
  onActionCompleted: () => void;
  refreshLogs: () => void;
}

export default function TelegramMock({ listings, onActionCompleted, refreshLogs }: TelegramMockProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Filter listings that need action (pending_approval) or have recently been processed
  const activeAdListings = listings.filter(
    l => l.status === 'pending_approval' || l.status === 'published' || l.status === 'rejected'
  ).slice(0, 10).reverse(); // show latest 10, oldest first inside chat

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeAdListings.length]);

  const handleCallbackAction = async (listingId: string, action: 'a' | 'r') => {
    setActionLoading(`${listingId}_${action}`);
    try {
      const response = await fetch('/api/telegram-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: `${action}|${listingId}` }),
      });
      if (!response.ok) {
        throw new Error('Callback failed');
      }
      onActionCompleted();
      refreshLogs();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-xl flex flex-col h-full overflow-hidden" id="telegram-mock">
      {/* Telegram App Header */}
      <div className="bg-slate-950 px-4 py-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center font-bold text-sm text-white select-none">
            TG
          </div>
          <div>
            <h3 className="text-xs font-bold font-sans tracking-wide flex items-center gap-1.5">
              Al Shatnawe Pipeline Approvals
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
            </h3>
            <p className="text-[10px] text-sky-400 font-sans font-medium">Telegram Channel Mockup</p>
          </div>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/50 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
          BOT ID: @shatnawe_bazaraki_bot
        </div>
      </div>

      {/* Telegram Chat Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-[400px] max-h-[500px] bg-slate-950/40 relative">
        <div className="text-center">
          <span className="bg-slate-900 border border-slate-800/80 text-[10px] px-2.5 py-1 rounded-full text-slate-400 font-sans select-none">
            Today
          </span>
        </div>

        {activeAdListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 select-none opacity-40">
            <Info className="w-8 h-8 text-slate-500 mb-2" />
            <p className="text-xs text-slate-400 font-medium">Awaiting Ad Submissions</p>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">
              Trigger the pipeline on the left to see the ad appear here for immediate approval.
            </p>
          </div>
        ) : (
          activeAdListings.map((ad) => {
            const isPending = ad.status === 'pending_approval';
            const isPublished = ad.status === 'published';
            const isRejected = ad.status === 'rejected';

            return (
              <div key={ad.id} className="max-w-[90%] bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700/80 transition-all ml-0">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-2 mb-2">
                  <span className="text-[10px] font-bold text-sky-400 font-sans">
                    🏗️ {ad.serviceName}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded">
                    {ad.id.split('_').slice(1).join('_')}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 line-clamp-2 leading-snug">
                    {ad.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-4 font-sans whitespace-pre-wrap">
                    {ad.body}
                  </p>
                </div>

                {/* Similarity score banner */}
                <div className="mt-3 flex items-center justify-between gap-2 bg-slate-950/60 border border-slate-800/40 p-2 rounded-lg text-[10px]">
                  <span className="text-slate-500 font-mono">Similarity Index:</span>
                  <span className={`font-mono font-bold ${ad.similarityScore >= 0.75 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {ad.similarityScore} ({ad.similarityScore >= 0.75 ? 'Warning' : 'Safe'})
                  </span>
                </div>

                {/* Buttons controls */}
                <div className="mt-3.5 pt-3.5 border-t border-slate-800/60">
                  {isPending ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleCallbackAction(ad.id, 'a')}
                        disabled={actionLoading !== null}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-semibold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        id={`tg-approve-${ad.id}`}
                      >
                        {actionLoading === `${ad.id}_a` ? (
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        )}
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleCallbackAction(ad.id, 'r')}
                        disabled={actionLoading !== null}
                        className="bg-rose-950/80 hover:bg-rose-900 border border-rose-850 text-rose-300 disabled:bg-slate-800 text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        id={`tg-reject-${ad.id}`}
                      >
                        {actionLoading === `${ad.id}_r` ? (
                          <span className="w-3.5 h-3.5 border-2 border-rose-300 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        )}
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 py-1">
                      {isPublished ? (
                        <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-3 py-1.5 rounded-lg w-full justify-center">
                          <Check className="w-3.5 h-3.5" />
                          <span>PUBLISHED TO LIVE XML FEED</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold px-3 py-1.5 rounded-lg w-full justify-center">
                          <X className="w-3.5 h-3.5" />
                          <span>REJECTED AND EXCLUDED</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Simulated Footer Send Input */}
      <div className="bg-slate-950 border-t border-slate-800 p-3 flex items-center justify-between gap-2">
        <div className="bg-slate-900 text-slate-500 text-xs flex-1 px-3 py-2 rounded-xl select-none flex items-center justify-between">
          <span>Simulation active - Click buttons to trigger callback API</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" />
        </div>
      </div>
    </div>
  );
}
