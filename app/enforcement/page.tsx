'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Jurisdiction, EnforcementActionType, EnforcementStatus } from '@/lib/types';
import {
    Gavel,
    Building2,
    CreditCard,
    Receipt,
    Package,
    Briefcase,
    Users,
    AlertTriangle,
    Scale,
    Plus,
    ChevronRight,
    Clock,
    DollarSign,
    Target,
    FileText,
    CheckCircle,
    XCircle,
    Loader2
} from 'lucide-react';

const enforcementTypes: { type: EnforcementActionType; label: string; icon: React.ReactNode; description: string }[] = [
    { type: 'wage_garnishment', label: 'Wage Garnishment', icon: <CreditCard className="w-5 h-5" />, description: 'Garnish debtor or owner wages/salary' },
    { type: 'bank_levy', label: 'Bank Account Levy', icon: <Building2 className="w-5 h-5" />, description: 'Levy funds from bank accounts' },
    { type: 'ar_garnishment', label: 'A/R Garnishment', icon: <Receipt className="w-5 h-5" />, description: 'Garnish business accounts receivable' },
    { type: 'execution', label: 'Writ of Execution', icon: <Package className="w-5 h-5" />, description: 'Seize and sell tangible property' },
    { type: 'charging_order', label: 'Charging Order', icon: <Briefcase className="w-5 h-5" />, description: 'Against LLC/partnership interests' },
    { type: 'receivership', label: 'Receivership', icon: <Users className="w-5 h-5" />, description: 'Appoint receiver over business/assets' },
    { type: 'fraudulent_transfer', label: 'Fraudulent Transfer', icon: <AlertTriangle className="w-5 h-5" />, description: 'Recover transferred assets' },
    { type: 'contempt', label: 'Contempt Motion', icon: <Scale className="w-5 h-5" />, description: 'Compel compliance with court orders' },
];

const statusColors: Record<EnforcementStatus, { bg: string; text: string }> = {
    planned: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
    filed: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    served: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
    pending_response: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
    active: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
    collected: { bg: 'bg-green-500/20', text: 'text-green-400' },
    terminated: { bg: 'bg-red-500/20', text: 'text-red-400' },
};

export default function EnforcementPage() {
    const {
        tasks,
        files,
        parties,
        getJurisdictionStats,
        enforcementActions,
        assetIntelligence,
        caseConfig
    } = useData();

    const [selectedJurisdiction, setSelectedJurisdiction] = useState<Jurisdiction | 'ALL'>('ALL');
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'documents'>('overview');
    const [showNewActionModal, setShowNewActionModal] = useState(false);

    const jurisdictionStats = getJurisdictionStats();
    const jurisdictions: Jurisdiction[] = ['FL', 'TN', 'IN', 'CO'];
    const categories = ['ALL', 'DOMESTICATION', 'DISCOVERY', 'MOTION', 'EXECUTION', 'RESEARCH', 'COMMUNICATION'];

    const filteredStats = selectedJurisdiction === 'ALL'
        ? jurisdictionStats
        : jurisdictionStats.filter(s => s.jurisdiction === selectedJurisdiction);

    const filteredActions = selectedJurisdiction === 'ALL'
        ? enforcementActions
        : enforcementActions.filter(a => a.jurisdiction === selectedJurisdiction);

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

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

    // Calculate totals
    const totalExpectedRecovery = enforcementActions.reduce((sum, a) => sum + a.expectedRecovery, 0);
    const totalCollected = enforcementActions.reduce((sum, a) => sum + a.amountCollected, 0);
    const totalCosts = enforcementActions.reduce((sum, a) => sum + a.costsIncurred, 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Gavel className="w-7 h-7 text-blue-400" />
                        Enforcement Command Center
                    </h1>
                    <p className="text-slate-400 mt-1">Manage enforcement actions across all jurisdictions</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowNewActionModal(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Action
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-slate-700">
                {[
                    { id: 'overview', label: 'Jurisdiction Overview' },
                    { id: 'actions', label: 'Enforcement Actions' },
                    { id: 'documents', label: 'Documents & Writs' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                ? 'text-blue-400'
                                : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
                        )}
                    </button>
                ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-slate-500">Active Actions</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                        {enforcementActions.filter(a => a.status !== 'terminated' && a.status !== 'collected').length}
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-slate-500">Expected Recovery</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400">{formatCurrency(totalExpectedRecovery)}</div>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-slate-500">Collected</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400">{formatCurrency(totalCollected)}</div>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-amber-400" />
                        <span className="text-xs text-slate-500">Costs Incurred</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-400">{formatCurrency(totalCosts)}</div>
                </div>
            </div>

            {activeTab === 'overview' && (
                <>
                    {/* Filters */}
                    <div className="flex gap-3 mb-6">
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

                    {/* Jurisdiction Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredStats.map((stat) => {
                            const j = stat.jurisdiction as Jurisdiction;
                            const details = jurisdictionDetails[j];
                            const jurisdictionParties = getPartiesForJurisdiction(j);
                            const jurisdictionTasks = getTasksForJurisdiction(j);
                            const inProgressTasks = jurisdictionTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'THIS_WEEK');
                            const jurisdictionActions = enforcementActions.filter(a => a.jurisdiction === j);

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
                                        {/* Enforcement Actions for this jurisdiction */}
                                        {jurisdictionActions.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                                                    Enforcement Actions
                                                </h4>
                                                <div className="space-y-2">
                                                    {jurisdictionActions.slice(0, 2).map(action => {
                                                        const typeInfo = enforcementTypes.find(t => t.type === action.actionType);
                                                        const statusStyle = statusColors[action.status];
                                                        return (
                                                            <div key={action.id} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-blue-400">{typeInfo?.icon}</span>
                                                                    <span className="text-sm text-white">{typeInfo?.label}</span>
                                                                </div>
                                                                <span className={`px-2 py-1 rounded text-xs capitalize ${statusStyle.bg} ${statusStyle.text}`}>
                                                                    {action.status.replace('_', ' ')}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

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
                </>
            )}

            {activeTab === 'actions' && (
                <div className="space-y-6">
                    {/* Enforcement Type Quick Actions */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {enforcementTypes.map((type) => {
                            const count = enforcementActions.filter(a => a.actionType === type.type).length;
                            return (
                                <button
                                    key={type.type}
                                    className="bg-slate-900 border border-slate-700 rounded-xl p-4 hover:border-blue-500/50 transition-all text-left group"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="text-blue-400">{type.icon}</span>
                                        {count > 0 && (
                                            <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded">
                                                {count}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-medium text-white text-sm mb-1">{type.label}</h3>
                                    <p className="text-xs text-slate-500">{type.description}</p>
                                    <div className="mt-3 flex items-center gap-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Start New <ChevronRight className="w-3 h-3" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Actions List */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-700">
                            <h3 className="font-semibold text-white">Active Enforcement Actions</h3>
                        </div>
                        {enforcementActions.length > 0 ? (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-700">
                                        <th className="text-left text-xs font-medium text-slate-400 p-4">Type</th>
                                        <th className="text-left text-xs font-medium text-slate-400 p-4">Target</th>
                                        <th className="text-left text-xs font-medium text-slate-400 p-4">Jurisdiction</th>
                                        <th className="text-left text-xs font-medium text-slate-400 p-4">Status</th>
                                        <th className="text-right text-xs font-medium text-slate-400 p-4">Expected</th>
                                        <th className="text-right text-xs font-medium text-slate-400 p-4">Next Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enforcementActions.map((action) => {
                                        const typeInfo = enforcementTypes.find(t => t.type === action.actionType);
                                        const statusStyle = statusColors[action.status];
                                        return (
                                            <tr key={action.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-blue-400">{typeInfo?.icon}</span>
                                                        <span className="font-medium text-white">{typeInfo?.label}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-sm text-white">{action.target.name}</div>
                                                    <div className="text-xs text-slate-500 capitalize">{action.target.type}</div>
                                                </td>
                                                <td className="p-4">
                                                    <JurisdictionBadge jurisdiction={action.jurisdiction} />
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs capitalize ${statusStyle.bg} ${statusStyle.text}`}>
                                                        {action.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className="font-semibold text-emerald-400">{formatCurrency(action.expectedRecovery)}</span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="text-sm text-slate-400">{action.nextAction}</div>
                                                    {action.nextActionDate && (
                                                        <div className="text-xs text-slate-500 flex items-center justify-end gap-1 mt-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(action.nextActionDate).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center">
                                <Gavel className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-400 mb-4">No enforcement actions initiated yet</p>
                                <button
                                    onClick={() => setShowNewActionModal(true)}
                                    className="text-blue-400 hover:text-blue-300 text-sm"
                                >
                                    Create your first enforcement action →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'documents' && (
                <div className="space-y-6">
                    {/* Document Generation Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { title: 'Demand Letters', count: 0, desc: 'Escalating series of demand letters', icon: <FileText className="w-5 h-5" /> },
                            { title: 'Garnishment Writs', count: 0, desc: 'Wage, bank, and A/R garnishment forms', icon: <CreditCard className="w-5 h-5" /> },
                            { title: 'Execution Writs', count: 0, desc: 'Writs to seize and sell property', icon: <Package className="w-5 h-5" /> },
                            { title: 'Subpoenas', count: 0, desc: 'Subpoenas duces tecum for discovery', icon: <Scale className="w-5 h-5" /> },
                            { title: 'Contempt Motions', count: 0, desc: 'Motions for contempt of court', icon: <Gavel className="w-5 h-5" /> },
                            { title: 'Domestication Packages', count: 4, desc: 'State-specific domestication forms', icon: <Building2 className="w-5 h-5" /> },
                        ].map((category) => (
                            <div key={category.title} className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition-all cursor-pointer">
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-blue-400">{category.icon}</span>
                                    <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded">
                                        {category.count} generated
                                    </span>
                                </div>
                                <h3 className="font-medium text-white mb-1">{category.title}</h3>
                                <p className="text-sm text-slate-500">{category.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Recent Documents */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4">Recent Documents</h3>
                        <div className="text-center py-8">
                            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400">No documents generated yet</p>
                            <p className="text-sm text-slate-500 mt-1">Select a category above to generate enforcement documents</p>
                        </div>
                    </div>
                </div>
            )}

            {/* New Action Modal Placeholder */}
            {showNewActionModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowNewActionModal(false)}>
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-white mb-4">New Enforcement Action</h2>
                        <p className="text-slate-400 mb-6">Select the type of enforcement action to initiate:</p>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {enforcementTypes.slice(0, 4).map((type) => (
                                <button
                                    key={type.type}
                                    className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-blue-500 transition-all text-left"
                                >
                                    <span className="text-blue-400 mb-2 block">{type.icon}</span>
                                    <span className="text-sm font-medium text-white">{type.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowNewActionModal(false)}
                                className="px-4 py-2 text-slate-400 hover:text-white text-sm"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium">
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
