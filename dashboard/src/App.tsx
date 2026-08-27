/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsGrid from './components/StatsGrid';
import PipelineSimulator from './components/PipelineSimulator';
import TelegramMock from './components/TelegramMock';
import ServicesManager from './components/ServicesManager';
import ListingsTable from './components/ListingsTable';
import SettingsPanel from './components/SettingsPanel';
import { ConstructionService, BazarakiAd, SystemSettings, DashboardStats, PipelineLog, AdStatus } from './types';
import { Sparkles, RefreshCcw, Layers, HelpCircle, AlertCircle, HardHat } from 'lucide-react';

export default function App() {
  const [services, setServices] = useState<ConstructionService[]>([]);
  const [listings, setListings] = useState<BazarakiAd[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [systemLogs, setSystemLogs] = useState<PipelineLog[]>([]);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'rotation' | 'settings'>('pipeline');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [resServices, resListings, resSettings, resStats, resLogs] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/listings'),
        fetch('/api/settings'),
        fetch('/api/stats'),
        fetch('/api/system-logs'),
      ]);

      if (!resServices.ok || !resListings.ok || !resSettings.ok || !resStats.ok || !resLogs.ok) {
        throw new Error('Failed to retrieve full data package from the server.');
      }

      const servicesData = await resServices.json();
      const listingsData = await resListings.json();
      const settingsData = await resSettings.json();
      const statsData = await resStats.json();
      const logsData = await resLogs.json();

      setServices(servicesData);
      setListings(listingsData);
      setSettings(settingsData);
      setStats(statsData);
      setSystemLogs(logsData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Connection to backend server lost or database failed to initialize.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll data every 5 seconds to capture simulated Telegram actions / live logs
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveService = async (servicePayload: Partial<ConstructionService>) => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(servicePayload),
      });
      if (!response.ok) throw new Error('Failed to save service');
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete service');
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (settingsPayload: SystemSettings) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsPayload),
      });
      if (!response.ok) throw new Error('Failed to save settings');
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: AdStatus) => {
    try {
      const response = await fetch('/api/listings/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualRefresh = () => {
    setLoading(true);
    fetchData();
  };

  if (loading && !settings) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 select-none">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center max-w-xs text-center">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
            <HardHat className="w-5 h-5 text-amber-500 absolute left-3.5 top-3.5" />
          </div>
          <h3 className="font-display font-bold text-slate-800 mt-4">Assembling Pipeline Hub</h3>
          <p className="text-xs text-slate-500 mt-1">Booting database engines, loading rotation states, and connecting simulated webhooks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Banner & Title Brand */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Error alert fallback */}
        {error && (
          <div className="mt-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-center gap-2.5 shadow-2xs">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <p className="font-bold">Database Server Disconnected</p>
              <p className="text-slate-500 mt-0.5">{error}</p>
            </div>
            <button
              onClick={handleManualRefresh}
              className="ml-auto bg-white hover:bg-rose-100 border border-rose-200 text-rose-800 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Stats Bento Grid */}
        {stats && <StatsGrid stats={stats} />}

        {/* Pipeline Controls & Telegram Mock Twin Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
          
          {/* Left Column: Flow Controllers (Simulator / Queue / Settings) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Dashboard Tabs menu */}
            <div className="bg-white border border-slate-200 p-1.5 rounded-xl flex shadow-2xs">
              <button
                onClick={() => setActiveTab('pipeline')}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'pipeline'
                    ? 'bg-slate-900 text-amber-400 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                id="tab-pipeline"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ad Publisher Hub</span>
              </button>
              <button
                onClick={() => setActiveTab('rotation')}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'rotation'
                    ? 'bg-slate-900 text-amber-400 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                id="tab-rotation"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Rotation Queue</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'settings'
                    ? 'bg-slate-900 text-amber-400 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                id="tab-settings"
              >
                <HardHat className="w-3.5 h-3.5" />
                <span>Configs & Integrations</span>
              </button>
            </div>

            {/* Selected Tab panel */}
            <div className="flex-1">
              {activeTab === 'pipeline' && (
                <PipelineSimulator
                  services={services}
                  onPipelineComplete={fetchData}
                  systemLogs={systemLogs}
                  refreshLogs={fetchData}
                />
              )}

              {activeTab === 'rotation' && (
                <ServicesManager
                  services={services}
                  onSaveService={handleSaveService}
                  onDeleteService={handleDeleteService}
                />
              )}

              {activeTab === 'settings' && settings && (
                <SettingsPanel
                  settings={settings}
                  onSaveSettings={handleSaveSettings}
                />
              )}
            </div>
          </div>

          {/* Right Column: High Fidelity Telegram Chat */}
          <div className="lg:col-span-5 flex flex-col">
            <TelegramMock
              listings={listings}
              onActionCompleted={fetchData}
              refreshLogs={fetchData}
            />
          </div>
        </div>

        {/* Global Historical List and Comparisons */}
        <div className="mt-6">
          <ListingsTable
            listings={listings}
            onStatusChange={handleStatusChange}
          />
        </div>
      </main>
    </div>
  );
}
