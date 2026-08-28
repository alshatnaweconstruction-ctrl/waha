/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Shield, ArrowUp, Calendar, RefreshCcw } from 'lucide-react';
import { ConstructionService } from '../types';

interface ServicesManagerProps {
  services: ConstructionService[];
  onSaveService: (service: Partial<ConstructionService>) => void;
  onDeleteService: (id: string) => void;
}

export default function ServicesManager({ services, onSaveService, onDeleteService }: ServicesManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState<string>('');
  const [formUsp, setFormUsp] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Sorting services to determine rotation order:
  // Oldest posted at / never posted at gets the highest priority in the rotation!
  const sortedRotation = [...services].sort((a, b) => {
    if (!a.lastPostedAt) return -1;
    if (!b.lastPostedAt) return 1;
    return new Date(a.lastPostedAt).getTime() - new Date(b.lastPostedAt).getTime();
  });

  const handleStartEdit = (service: ConstructionService) => {
    setEditingId(service.id);
    setFormName(service.name);
    setFormUsp(service.usp);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormName('');
    setFormUsp('');
  };

  const handleSaveEdit = (id: string) => {
    if (!formName || !formUsp) return;
    onSaveService({ id, name: formName, usp: formUsp });
    handleCancelEdit();
  };

  const handleCreate = () => {
    if (!formName || !formUsp) return;
    onSaveService({ name: formName, usp: formUsp });
    setFormName('');
    setFormUsp('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6" id="services-manager">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div>
          <h2 className="font-display text-base font-bold text-slate-900">
            Construction Services Rotation Queue
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Services queued for daily publication. Priority goes to the longest-waiting service.
          </p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-semibold text-xs py-2 px-3 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            id="add-service-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </button>
        )}
      </div>

      {/* Add New Service Form */}
      {showAddForm && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Create Construction Service Category
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Category Name
              </label>
              <input
                type="text"
                placeholder="e.g., Demolitions & Excavations"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                id="new-service-name"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Unique Selling Point (USP) / Materials / Standards
              </label>
              <textarea
                rows={3}
                placeholder="e.g., Owned fleet of heavy-duty excavators, certified operators, rapid land plot preparation, safety hazard-free standards."
                value={formUsp}
                onChange={(e) => setFormUsp(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                id="new-service-usp"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Be factual and trade-specific to match AL SHATNAWE contractor style.
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowAddForm(false);
                handleCancelEdit();
              }}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!formName || !formUsp}
              className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-amber-400 font-semibold text-xs py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
              id="save-new-service-btn"
            >
              Save Service
            </button>
          </div>
        </div>
      )}

      {/* Services List and Rotation Indicator */}
      <div className="space-y-3.5">
        {services.map((service, index) => {
          const isEditing = editingId === service.id;
          
          // Determine where this service is in rotation order
          const rotationIndex = sortedRotation.findIndex((s) => s.id === service.id);
          const isNextUp = rotationIndex === 0;

          return (
            <div
              key={service.id}
              className={`border rounded-xl p-4 transition-all relative ${
                isNextUp
                  ? 'border-amber-500 bg-amber-50/15 shadow-2xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {isNextUp && (
                <span className="absolute -top-2.5 left-4 bg-amber-500 text-slate-950 text-[9px] font-bold px-2.5 py-0.5 rounded-full border border-amber-600 shadow-2xs flex items-center gap-1">
                  <RefreshCcw className="w-2.5 h-2.5" />
                  NEXT UP IN ROTATION
                </span>
              )}

              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      value={formUsp}
                      onChange={(e) => setFormUsp(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleSaveEdit(service.id)}
                      className="p-1 text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-950 flex items-center gap-2">
                        {service.name}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1.5 font-sans leading-relaxed">
                        <strong className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                          Unique Selling Point (USP):
                        </strong>
                        {service.usp}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleStartEdit(service)}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                        title="Edit service details"
                        id={`edit-service-${service.id}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteService(service.id)}
                        className="p-1.5 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete service"
                        id={`delete-service-${service.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Date information */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-sans">
                    <span className="flex items-center gap-1 font-medium text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Last Advertised: {service.lastPostedAt ? new Date(service.lastPostedAt).toLocaleDateString() : 'Never posted'}
                    </span>
                    <span className="font-mono text-[9px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-semibold">
                      Queue index: {rotationIndex + 1} of {services.length}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
