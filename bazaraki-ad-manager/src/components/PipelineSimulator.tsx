/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Play, RotateCw, CheckCircle2, AlertTriangle, XCircle, ArrowRight, Loader2, Sparkles, Database, Send, ClipboardCheck } from 'lucide-react';
import { ConstructionService, BazarakiAd } from '../types';

interface PipelineSimulatorProps {
  services: ConstructionService[];
  onPipelineComplete: () => void;
  systemLogs: any[];
  refreshLogs: () => void;
}

export default function PipelineSimulator({ services, onPipelineComplete, systemLogs, refreshLogs }: PipelineSimulatorProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [pipelineResult, setPipelineResult] = useState<BazarakiAd | null>(null);
  const [pipelineSteps, setPipelineSteps] = useState<any[]>([]);

  const handleRunPipeline = async () => {
    setLoading(true);
    setActiveStep(1);
    setPipelineResult(null);
    setPipelineSteps([
      { step: 1, label: 'Querying Database & Selecting Rotation Service', status: 'running' },
      { step: 2, label: 'Generating Contractor Ad with Gemini AI', status: 'pending' },
      { step: 3, label: 'Running Multi-Ad Duplicate Similarity Checks', status: 'pending' },
      { step: 4, label: 'Dispatching Inline Telegram Approval Webhook', status: 'pending' },
    ]);

    try {
      // Step 1: Querying db
      await new Promise(resolve => setTimeout(resolve, 800));
      updateStepStatus(1, 'success');
      updateStepStatus(2, 'running');

      // Step 2: Generating and checking similarity (triggers backend call)
      const response = await fetch('/api/pipeline/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId: selectedServiceId || undefined }),
      });
      
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Pipeline run failed');
      }

      updateStepStatus(2, 'success');
      updateStepStatus(3, 'running');

      // Simulate similarity analysis timing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const ad: BazarakiAd = data.listing;
      setPipelineResult(ad);

      updateStepStatus(3, ad.status === 'rejected' ? 'error' : 'success');
      
      if (ad.status !== 'rejected') {
        updateStepStatus(4, 'running');
        await new Promise(resolve => setTimeout(resolve, 800));
        updateStepStatus(4, 'success');
      } else {
        updateStepStatus(4, 'skipped');
      }

      onPipelineComplete();
      refreshLogs();
    } catch (err) {
      console.error(err);
      setPipelineSteps(prev => prev.map(s => s.status === 'running' ? { ...s, status: 'error' } : s));
    } finally {
      setLoading(false);
    }
  };

  const updateStepStatus = (stepNumber: number, status: 'pending' | 'running' | 'success' | 'error' | 'skipped') => {
    setPipelineSteps(prev =>
      prev.map(s => (s.step === stepNumber ? { ...s, status } : s))
    );
    setActiveStep(stepNumber);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-full" id="pipeline-simulator">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Ad Publishing Pipeline
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            AI draft, anti-duplicate loops, and approval triggering
          </p>
        </div>
      </div>

      {/* Service Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Select Service Rotation Method
          </label>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            disabled={loading}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 font-sans focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            id="service-select"
          >
            <option value="">Auto-Rotate Queue (Recommends longest waiting service)</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.lastPostedAt ? `(Posted ${new Date(s.lastPostedAt).toLocaleDateString()})` : '(Never posted)'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            onClick={handleRunPipeline}
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-amber-400 font-semibold text-sm py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm border border-slate-950"
            id="run-pipeline-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Ad...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-amber-400" />
                <span>Trigger Pipeline Run</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pipeline Progress Visualizer */}
      {pipelineSteps.length > 0 && (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 mb-5">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-500" />
            Execution Progression (n8n Simulation)
          </h3>
          <div className="space-y-4">
            {pipelineSteps.map((step) => {
              const isRunning = step.status === 'running';
              const isSuccess = step.status === 'success';
              const isError = step.status === 'error';
              const isSkipped = step.status === 'skipped';

              return (
                <div key={step.step} className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-lg shadow-2xs">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                      isSuccess ? 'bg-emerald-100 text-emerald-700' :
                      isError ? 'bg-rose-100 text-rose-700' :
                      isRunning ? 'bg-amber-100 text-amber-700' :
                      isSkipped ? 'bg-slate-100 text-slate-400' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {isSuccess ? '✓' : isError ? '✗' : step.step}
                    </span>
                    <span className={`text-xs font-medium ${isRunning ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}>
                      {step.label}
                    </span>
                  </div>
                  <div>
                    {isRunning && <Loader2 className="w-4 h-4 animate-spin text-amber-500" />}
                    {isSuccess && <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider">OK</span>}
                    {isError && <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Failed</span>}
                    {isSkipped && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium uppercase tracking-wider">Skipped</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Real-time Result Summary / Loops Explanation */}
      {pipelineResult && (
        <div className={`border rounded-xl p-5 mb-4 ${
          pipelineResult.status === 'rejected' 
            ? 'bg-rose-50/50 border-rose-100 text-rose-950' 
            : 'bg-emerald-50/30 border-emerald-100 text-slate-900'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                {pipelineResult.status === 'rejected' ? (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <h4 className="font-display font-bold text-sm text-rose-900">Pipeline Generation Rejected (Duplicate Alert)</h4>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <h4 className="font-display font-bold text-sm text-emerald-900">Listing Pre-Approved for Human Review</h4>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-sans">
                Listing ID: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px] text-slate-700">{pipelineResult.id}</code> &bull; Service: <strong className="font-medium text-slate-700">{pipelineResult.serviceName}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className={`text-xs font-bold font-mono px-2 py-1 rounded border ${
                pipelineResult.similarityScore >= 0.75 
                  ? 'bg-rose-50 text-rose-700 border-rose-100' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-100'
              }`}>
                Similarity: {pipelineResult.similarityScore}
              </span>
            </div>
          </div>

          {/* Rewrite history logging inside the container */}
          {pipelineResult.history && pipelineResult.history.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-3.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <ClipboardCheck className="w-3.5 h-3.5" />
                Duplicate Prevention Logs ({pipelineResult.history.length} rewrites)
              </span>
              <div className="space-y-2 text-xs font-mono bg-slate-900 text-slate-300 p-3 rounded-lg max-h-40 overflow-y-auto">
                {pipelineResult.history.map((hist, idx) => (
                  <div key={idx} className="border-b border-slate-800 pb-2 last:border-none last:pb-0">
                    <p className="text-amber-400 font-bold">Attempt {idx + 1}: similarity score {hist.similarityScore}</p>
                    <p className="text-slate-400 mt-0.5 text-[11px] leading-relaxed">Generated Title: "{hist.title}"</p>
                    <p className="text-slate-500 mt-0.5 text-[11px] leading-relaxed italic">System action: Similarity above 0.75 target. Feeding rewrite directions...</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Ad content preview */}
          <div className="mt-4 bg-white border border-slate-100 p-4 rounded-lg shadow-2xs">
            <h5 className="text-xs font-bold text-slate-800 mb-1 border-b border-slate-50 pb-1">
              Title: {pipelineResult.title}
            </h5>
            <p className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-3">
              {pipelineResult.body}
            </p>
          </div>

          {pipelineResult.status === 'pending_approval' && (
            <div className="mt-4 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-800 p-3 rounded-lg text-xs font-medium">
              <Send className="w-4 h-4 text-amber-600 shrink-0 animate-bounce" />
              <span>Awaiting manual approval tap inside the Telegram Panel on the right!</span>
            </div>
          )}
        </div>
      )}

      {/* Terminal Output Logs */}
      <div className="mt-auto pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Pipeline Console Output
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            Updated just now
          </span>
        </div>
        <div className="bg-slate-950 text-slate-300 p-3.5 rounded-lg font-mono text-[11px] h-48 overflow-y-auto leading-relaxed border border-slate-800 shadow-inner">
          {systemLogs.length === 0 ? (
            <p className="text-slate-500 italic">No logs generated in this session.</p>
          ) : (
            systemLogs.map((log) => (
              <div key={log.id} className="mb-1.5 flex items-start gap-1.5 last:mb-0">
                <span className="text-slate-500 select-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className={`font-semibold shrink-0 ${
                  log.level === 'success' ? 'text-emerald-400' :
                  log.level === 'warn' ? 'text-amber-400' :
                  log.level === 'error' ? 'text-rose-400 font-bold' :
                  'text-blue-400'
                }`}>
                  [{log.level.toUpperCase()}]
                </span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
