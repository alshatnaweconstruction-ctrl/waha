/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Settings, Save, ShieldAlert, ToggleLeft, ToggleRight, Phone, MapPin, Link2, Bell } from 'lucide-react';
import { SystemSettings } from '../types';

interface SettingsPanelProps {
  settings: SystemSettings;
  onSaveSettings: (settings: SystemSettings) => void;
}

export default function SettingsPanel({ settings, onSaveSettings }: SettingsPanelProps) {
  const [tgToken, setTgToken] = useState(settings.telegramBotToken || '');
  const [tgChatId, setTgChatId] = useState(settings.telegramChatId || '');
  const [realTg, setRealTg] = useState(settings.useRealTelegram || false);
  const [phone, setPhone] = useState(settings.bazarakiPhone || '');
  const [location, setLocation] = useState(settings.bazarakiLocation || '');
  const [category, setCategory] = useState(settings.bazarakiCategory || '');
  const [n8nUrl, setN8nUrl] = useState(settings.n8nWebhookUrl || '');
  const [schedActive, setSchedActive] = useState(settings.schedulerActive || false);
  const [schedHour, setSchedHour] = useState(settings.schedulerHour || 9);
  const [schedMinute, setSchedMinute] = useState(settings.schedulerMinute || 0);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      telegramBotToken: tgToken,
      telegramChatId: tgChatId,
      useRealTelegram: realTg,
      bazarakiPhone: phone,
      bazarakiLocation: location,
      bazarakiCategory: category,
      n8nWebhookUrl: n8nUrl,
      schedulerActive: schedActive,
      schedulerHour: Number(schedHour),
      schedulerMinute: Number(schedMinute),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6" id="settings-panel">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div>
          <h2 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-500" />
            System Configuration Hub
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Configure live Telegram bots, n8n orchestrations, and Bazaraki feed mappings
          </p>
        </div>
        <button
          type="submit"
          className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-semibold text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          id="save-settings-btn"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaved ? 'Saved!' : 'Save System Configuration'}</span>
        </button>
      </div>

      <div className="space-y-5">
        {/* Telegram Integration Setup */}
        <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-sky-500" />
                Telegram Approval Mechanism
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Toggling 'Real Bot' dispatches approval cards directly to your Telegram channel.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRealTg(!realTg)}
              className="text-slate-500 hover:text-slate-800 focus:outline-none cursor-pointer"
            >
              {realTg ? (
                <ToggleRight className="w-10 h-10 text-sky-500" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-slate-300" />
              )}
            </button>
          </div>

          {realTg && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Telegram Bot Token
                </label>
                <input
                  type="password"
                  placeholder="e.g. 123456:ABC-DEF"
                  value={tgToken}
                  onChange={(e) => setTgToken(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Telegram Group/Chat ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. -100123456789"
                  value={tgChatId}
                  onChange={(e) => setTgChatId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {!realTg && (
            <div className="bg-sky-500/10 border border-sky-500/25 p-3 rounded-lg flex items-start gap-2.5 text-xs text-sky-800">
              <ShieldAlert className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Simulated Environment Active</p>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  Approval requests will appear directly in the interactive **Telegram Channel Mockup** panel on the right. You can test and trigger approve/reject cycles without setting up tokens.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bazaraki Feed metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              Bazaraki Contact Phone
            </label>
            <input
              type="text"
              placeholder="+357 99 713028"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-sans text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Bazaraki Location
            </label>
            <input
              type="text"
              placeholder="Limassol, Cyprus"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-sans text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              Bazaraki Feed Category
            </label>
            <input
              type="text"
              placeholder="Services > Construction & Renovation"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-sans text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Orchestration Trigger Webhook */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Link2 className="w-3.5 h-3.5 text-slate-400" />
            n8n Orchestration Webhook Endpoint
          </label>
          <input
            type="text"
            placeholder="https://n8n.alshatnawe.com/webhook/..."
            value={n8nUrl}
            onChange={(e) => setN8nUrl(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all"
          />
        </div>

        {/* Daily schedule */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Daily Posting Schedule (n8n Simulation)
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Automatically start the pipeline daily at this time.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSchedActive(!schedActive)}
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                schedActive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              {schedActive ? 'SCHEDULE ACTIVE' : 'SCHEDULE DISABLED'}
            </button>
          </div>

          {schedActive && (
            <div className="flex items-center gap-3 text-xs animate-fadeIn">
              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-1">Hour (24-hour)</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={schedHour}
                  onChange={(e) => setSchedHour(Number(e.target.value))}
                  className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-mono text-slate-800 text-center"
                />
              </div>
              <span className="font-bold text-slate-400 self-end mb-1.5">:</span>
              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-1">Minute</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={schedMinute}
                  onChange={(e) => setSchedMinute(Number(e.target.value))}
                  className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-mono text-slate-800 text-center"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-4 font-sans italic self-end mb-1.5">
                Next run: today at {schedHour.toString().padStart(2, '0')}:{schedMinute.toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
