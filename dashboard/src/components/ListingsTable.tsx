/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, Eye, Filter, Check, X, ChevronDown, ChevronUp, Copy, Calendar, ShieldCheck, RefreshCw, AlertOctagon } from 'lucide-react';
import { BazarakiAd, AdStatus } from '../types';

interface ListingsTableProps {
  listings: BazarakiAd[];
  onStatusChange: (id: string, newStatus: AdStatus) => void;
}

export default function ListingsTable({ listings, onStatusChange }: ListingsTableProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | AdStatus>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copyingId, setCopyingId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopyingId(id);
    setTimeout(() => setCopyingId(null), 1500);
  };

  // Filter listings
  const filteredListings = listings.filter((ad) => {
    const matchesSearch =
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === 'all' ? true : ad.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: AdStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Check className="w-3.5 h-3.5" />
            Live / Published
          </span>
        );
      case 'pending_approval':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Awaiting TG Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            <X className="w-3.5 h-3.5" />
            Rejected / Excluded
          </span>
        );
      case 'rewriting':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Auto-Rewriting
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" id="listings-table">
      {/* Header Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h3 className="font-display text-base font-bold text-slate-900">
            Bazaraki Listings Registry
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            View full details of auto-generated ads, similarity indices, and manual overrides
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search title or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-sans text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-64 transition-all"
              id="listing-search"
            />
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="border-b border-slate-100 px-5 flex flex-wrap gap-1.5 bg-white">
        {(['all', 'published', 'pending_approval', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-3.5 border-b-2 text-xs font-semibold transition-all capitalize cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-950 hover:border-slate-200'
            }`}
            id={`tab-filter-${tab}`}
          >
            <span>{tab === 'all' ? 'All Listings' : tab.replace('_', ' ')}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              activeTab === tab ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {tab === 'all' ? listings.length : listings.filter(l => l.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table Body */}
      {filteredListings.length === 0 ? (
        <div className="p-12 text-center text-slate-400 select-none">
          <p className="text-sm font-medium">No listings found matching filters.</p>
          <p className="text-xs text-slate-500 mt-1">Try relaxing your search terms or running the pipeline.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">ID & Date</th>
                <th className="py-3 px-5">Service Category</th>
                <th className="py-3 px-5">Draft Ad Title</th>
                <th className="py-3 px-5 text-center">Similarity Index</th>
                <th className="py-3 px-5 text-center">Status</th>
                <th className="py-3 px-5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredListings.map((ad) => {
                const isExpanded = expandedId === ad.id;

                return (
                  <tr key={ad.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* ID & Date */}
                    <td className="py-4 px-5 align-top whitespace-nowrap">
                      <div className="font-mono text-[10px] text-slate-700 font-bold">
                        {ad.id.split('_').slice(1).join('_') || ad.id}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-1 font-sans">
                        <Calendar className="w-3 h-3 shrink-0 text-slate-400" />
                        {new Date(ad.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Service */}
                    <td className="py-4 px-5 align-top whitespace-nowrap">
                      <span className="text-xs font-semibold text-slate-800">
                        {ad.serviceName}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="py-4 px-5 align-top">
                      <div className="text-xs font-medium text-slate-700 line-clamp-1 max-w-xs md:max-w-md">
                        {ad.title}
                      </div>
                      <div className="text-[10px] text-slate-500 line-clamp-1 mt-1 font-sans">
                        {ad.body}
                      </div>
                    </td>

                    {/* Similarity Score */}
                    <td className="py-4 px-5 align-top text-center whitespace-nowrap">
                      <div className="inline-flex flex-col items-center">
                        <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                          ad.similarityScore >= 0.75
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {ad.similarityScore}
                        </span>
                        <span className="text-[9px] text-slate-400 mt-1 font-sans">
                          {ad.similarityScore >= 0.75 ? '⚠️ High' : '✅ Compliant'}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5 align-top text-center whitespace-nowrap">
                      {getStatusBadge(ad.status)}
                    </td>

                    {/* Expand Trigger */}
                    <td className="py-4 px-5 align-top text-right">
                      <button
                        onClick={() => toggleExpand(ad.id)}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                        id={`inspect-trigger-${ad.id}`}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Expanded details view */}
      {expandedId && (
        (() => {
          const ad = listings.find(l => l.id === expandedId);
          if (!ad) return null;

          return (
            <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-col md:flex-row gap-6 animate-fadeIn">
              {/* Left Column: Full Ad Texts */}
              <div className="flex-1 space-y-4">
                {/* Draft Title Box */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Live Bazaraki Title
                  </label>
                  <div className="bg-white border border-slate-200 rounded-lg p-3 flex justify-between items-center gap-4">
                    <span className="text-xs font-bold text-slate-800">{ad.title}</span>
                    <button
                      onClick={() => handleCopyText(ad.id + '_t', ad.title)}
                      className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded transition-all cursor-pointer flex items-center gap-1 text-[10px]"
                      title="Copy title"
                      id={`copy-title-btn-${ad.id}`}
                    >
                      {copyingId === ad.id + '_t' ? <span className="text-emerald-600">Copied</span> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Draft Body Box */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Ad Listing Body
                  </label>
                  <div className="bg-white border border-slate-200 rounded-lg p-4 font-sans text-xs text-slate-600 leading-relaxed whitespace-pre-wrap relative">
                    {ad.body}
                    <button
                      onClick={() => handleCopyText(ad.id + '_b', ad.body)}
                      className="absolute right-3 top-3 p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-800 rounded transition-all cursor-pointer flex items-center gap-1 text-[10px]"
                      title="Copy body"
                      id={`copy-body-btn-${ad.id}`}
                    >
                      {copyingId === ad.id + '_b' ? <span className="text-emerald-600">Copied</span> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Similarity metrics and override controls */}
              <div className="w-full md:w-80 space-y-4">
                {/* Metrics */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-2">
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                    Security & Similarity Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <p className="text-[10px] font-medium text-slate-400">Similarity Score</p>
                      <p className="font-bold text-slate-800 font-mono mt-0.5">{ad.similarityScore}</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <p className="text-[10px] font-medium text-slate-400">Total Rewrites</p>
                      <p className="font-bold text-slate-800 font-mono mt-0.5">{ad.history?.length || 0}</p>
                    </div>
                  </div>

                  {ad.similarityComparisonListingId && (
                    <div className="bg-rose-50/50 border border-rose-100 p-3 rounded-lg text-[11px] text-rose-950">
                      <p className="font-semibold flex items-center gap-1">
                        <AlertOctagon className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        Highest Match Found:
                      </p>
                      <p className="font-mono mt-1 text-[10px] bg-white border border-rose-100 px-1 py-0.5 rounded text-rose-800 truncate">
                        ID: {ad.similarityComparisonListingId.split('_').slice(1).join('_')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Manual Override Status Panel */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-2">
                    Override Actions
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Force approve/publish into the live feed or reject listings manually to override automated workflows.
                  </p>
                  <div className="flex gap-2">
                    {ad.status !== 'published' && (
                      <button
                        onClick={() => onStatusChange(ad.id, 'published')}
                        className="flex-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-semibold text-xs py-2 px-3 rounded-lg transition-colors cursor-pointer text-center"
                        id={`override-approve-${ad.id}`}
                      >
                        Force Publish
                      </button>
                    )}
                    {ad.status !== 'rejected' && (
                      <button
                        onClick={() => onStatusChange(ad.id, 'rejected')}
                        className="flex-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-semibold text-xs py-2 px-3 rounded-lg transition-colors cursor-pointer text-center"
                        id={`override-reject-${ad.id}`}
                      >
                        Force Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
}
