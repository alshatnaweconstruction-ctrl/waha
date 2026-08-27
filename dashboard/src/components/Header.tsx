/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Building2, Copy, Check, FileCode, CheckCircle, ExternalLink } from 'lucide-react';

export default function Header() {
  const [copied, setCopied] = useState(false);
  const feedUrl = `${window.location.origin}/api/feed.xml`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(feedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white py-5 px-6 shadow-md rounded-b-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-slate-950 p-2.5 rounded-lg shadow-inner">
            <Building2 className="w-6 h-6 stroke-[2.5]" id="header-logo" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold tracking-tight">AL SHATNAWE</h1>
              <span className="bg-amber-500/15 text-amber-400 text-xs font-semibold px-2 py-0.5 rounded border border-amber-500/20">
                CONSTRUCTION LTD
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Cyprus Ad Publishing Pipeline &bull; Bazaraki Sync
            </p>
          </div>
        </div>

        {/* Live Feed and System Status */}
        <div className="flex flex-wrap items-center gap-3 md:self-center">
          {/* Feed URL Copy Bar */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg p-1.5 pl-3 text-xs">
            <span className="text-slate-400 font-mono select-none mr-2">XML Feed:</span>
            <span className="text-slate-300 font-mono truncate max-w-[200px] sm:max-w-xs pr-2">
              /api/feed.xml
            </span>
            <button
              onClick={copyToClipboard}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
              title="Copy live XML Feed link"
              id="copy-feed-btn"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <a
              href="/api/feed.xml"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
              title="Open Live Feed XML"
              id="view-feed-btn"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-lg text-xs text-emerald-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>SYSTEM ONLINE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
