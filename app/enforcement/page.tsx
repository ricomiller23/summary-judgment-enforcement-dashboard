'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Jurisdiction } from '@/lib/types';

export default function EnforcementPage() {
    const { tasks, files, parties, getJurisdictionStats } = useData();
    const [selectedJurisdiction, setSelectedJurisdiction] = useState<Jurisdiction | 'ALL'>('ALL');
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

    const jurisdictionStats = getJurisdictionStats();
    const jurisdictions: Jurisdiction[] = ['FL', 'TN', 'IN', 'CO'];
    const categories = ['ALL', 'DOMESTICATION', 'DISCOVERY', 'MOTION', 'EXECUTION', 'RESEARCH', 'COMMUNICATION'];

    const filteredStats = selectedJurisdiction === 'ALL'
        ? jurisdictionStats
        : jurisdictionStats.filter(s => s.jurisdiction === selectedJurisdiction);

    const getPartiesForJurisdiction = (j: Jurisdiction) => {
        return parties.filter(p => p.jurisdiction === j);
    };

    const getTasksForJurisdiction = (j: Jurisdiction) => {
        let filtered = tasks.filter(t => t.jurisdiction === j);
        if (selectedCategory !== 'ALL') {
            filtered = filtered.filter(t => t.category === selectedCategory);
        }
        return filtered;
    };

    const jurisdictionDetails: Record<Jurisdiction, { name: string; court?: string; role: string }> = {
        FL: { name: 'Florida', court: 'Brevard County Circuit Court', role: 'Origin/Judgment State' },
        TN: { name: 'Tennessee', role: 'Defendant Domicile' },
        IN: { name: 'Indiana', role: 'Principal Location' },
        CO: { name: 'Colorado', role: 'Principal Location' },
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Enforcement Tracking</h1>
                    <p className="text-slate-400 mt-1">Monitor enforcement progress across all jurisdictions</p>
                </div>

                {/* Filters */}
                <div className="flex gap-3">
                    <select
                        value={selectedJurisdiction}
                        onChange={(e) => setSelectedJurisdiction(e.target.value as Jurisdiction | 'ALL')}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ALL">All Jurisdictions</option>
                        {jurisdictions.map(j => (
                            <option key={j} value={j}>{jurisdictionDetails[j].name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {categories.map(c => (
                            <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c.charAt(0) + c.slice(1).toLowerCase()}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Jurisdiction Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredStats.map((stat) => {
                    const j = stat.jurisdiction as Jurisdiction;
                    const details = jurisdictionDetails[j];
                    const jurisdictionParties = getPartiesForJurisdiction(j);
                    const jurisdictionTasks = getTasksForJurisdiction(j);
                    const inProgressTasks = jurisdictionTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'THIS_WEEK');

                    return (
                        <div
                            key={j}
                            className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden hover:border-slate-600 transition-all"
                        >
                            {/* Card Header */}
                            <div className="bg-slate-800/50 border-b border-slate-700 p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <JurisdictionBadge jurisdiction={j} size="lg" showFull />
                                            <span className="text-sm text-slate-400">{details.role}</span>
                                        </div>
                                        {details.court && (
                                            <p className="text-sm text-slate-500">{details.court}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">{stat.progress}%</div>
                                        <div className="text-xs text-slate-500">Complete</div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                                            style={{ width: `${stat.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5">
                                {/* Parties */}
                                <div className="mb-4">
                                    <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Parties</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {jurisdictionParties.length > 0 ? (
                                            jurisdictionParties.map(p => (
                                                <span key={p.id} className="bg-slate-800 text-slate-300 text-sm px-3 py-1 rounded-lg">
                                                    {p.name.split(' ').slice(0, 3).join(' ')}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-500 text-sm">No parties assigned</span>
                                        )}
                                    </div>
                                </div>

                                {/* Top Tasks */}
                                <div className="mb-4">
                                    <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                                        Active Tasks ({inProgressTasks.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {inProgressTasks.slice(0, 3).map(task => (
                                            <div key={task.id} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                                                <span className="text-sm text-white truncate flex-1 mr-2">{task.title}</span>
                                                <StatusBadge status={task.status} size="sm" />
                                            </div>
                                        ))}
                                        {inProgressTasks.length === 0 && (
                                            <p className="text-slate-500 text-sm">No active tasks</p>
                                        )}
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800">
                                    <div className="text-center">
                                        <div className="text-lg font-semibold text-white">{stat.openTasks}</div>
                                        <div className="text-xs text-slate-500">Open</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-semibold text-white">{stat.totalTasks - stat.openTasks}</div>
                                        <div className="text-xs text-slate-500">Done</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-semibold text-white">{stat.files}</div>
                                        <div className="text-xs text-slate-500">Files</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
