'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { Modal } from '@/components/ui/Modal';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import {
    FileText,
    Plus,
    AlertTriangle,
    CheckCircle,
    Clock,
    DollarSign,
    Building2,
    Calendar,
    MapPin,
    RefreshCw,
    TrendingUp,
    ChevronRight,
    Shield,
    Scale,
    Target,
    Briefcase,
    Eye
} from 'lucide-react';
import { Jurisdiction } from '@/lib/types';

// Lien types
interface JudgmentLien {
    id: string;
    jurisdiction: Jurisdiction;
    county: string;
    propertyAddress: string;
    fileDate: string;
    fileNumber: string;
    amountAtFiling: number;
    currentAmount: number;
    expirationDate: string;
    status: 'active' | 'expired' | 'satisfied' | 'released';
    renewalHistory: { date: string; newExpiration: string }[];
}

interface UCCFiling {
    id: string;
    filingState: string;
    fileDate: string;
    fileNumber: string;
    collateralDescription: string;
    amountSecured: number;
    expirationDate: string;
    continuationFiled: boolean;
    status: 'active' | 'expired' | 'terminated';
}

// Seed data
const seedJudgmentLiens: JudgmentLien[] = [
    {
        id: 'lien-1',
        jurisdiction: 'FL',
        county: 'Brevard County',
        propertyAddress: '123 Commerce Way, Melbourne, FL 32901',
        fileDate: '2024-06-15',
        fileNumber: 'OR-2024-00567',
        amountAtFiling: 2378443.28,
        currentAmount: 2485000,
        expirationDate: '2044-06-15',
        status: 'active',
        renewalHistory: []
    },
    {
        id: 'lien-2',
        jurisdiction: 'TN',
        county: 'Davidson County',
        propertyAddress: '456 Business Park Dr, Nashville, TN 37203',
        fileDate: '2024-08-20',
        fileNumber: 'TN-2024-12890',
        amountAtFiling: 2378443.28,
        currentAmount: 2450000,
        expirationDate: '2034-08-20',
        status: 'active',
        renewalHistory: []
    }
];

const seedUCCFilings: UCCFiling[] = [
    {
        id: 'ucc-1',
        filingState: 'TN',
        fileDate: '2024-09-01',
        fileNumber: 'UCC-2024-0089234',
        collateralDescription: 'All accounts, inventory, equipment, and general intangibles',
        amountSecured: 2378443.28,
        expirationDate: '2029-09-01',
        continuationFiled: false,
        status: 'active'
    }
];

export default function LiensPage() {
    const { caseConfig, calculateInterest } = useData();
    const [judgmentLiens, setJudgmentLiens] = useState<JudgmentLien[]>(seedJudgmentLiens);
    const [uccFilings, setUccFilings] = useState<UCCFiling[]>(seedUCCFilings);
    const [activeTab, setActiveTab] = useState<'judgment' | 'ucc' | 'priority' | 'payoff'>('judgment');
    const [showNewLienModal, setShowNewLienModal] = useState(false);
    const [showNewUCCModal, setShowNewUCCModal] = useState(false);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

    const getDaysUntilExpiration = (expirationDate: string) => {
        const expDate = new Date(expirationDate);
        const today = new Date();
        const diff = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const getExpirationStatus = (days: number) => {
        if (days <= 30) return { color: 'text-red-400', bg: 'bg-red-500/20', label: 'URGENT' };
        if (days <= 90) return { color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'WARNING' };
        if (days <= 365) return { color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'MONITOR' };
        return { color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'OK' };
    };

    const activeLiens = judgmentLiens.filter(l => l.status === 'active');
    const activeUCC = uccFilings.filter(u => u.status === 'active');
    const totalLienValue = activeLiens.reduce((sum, l) => sum + l.currentAmount, 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Shield className="w-7 h-7 text-blue-400" />
                        Lien & Security Interest Registry
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Track, monitor, and manage all liens and security interests
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowNewLienModal(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        File Lien
                    </button>
                    <button
                        onClick={() => setShowNewUCCModal(true)}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium border border-slate-700"
                    >
                        <Plus className="w-4 h-4" />
                        File UCC-1
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-slate-500">Active Liens</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{activeLiens.length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="w-4 h-4 text-purple-400" />
                        <span className="text-xs text-slate-500">UCC Filings</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{activeUCC.length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-slate-500">Total Secured</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400">{formatCurrency(totalLienValue)}</div>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span className="text-xs text-slate-500">Expiring Soon</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-400">
                        {judgmentLiens.filter(l => getDaysUntilExpiration(l.expirationDate) <= 365).length}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-slate-700">
                {[
                    { id: 'judgment', label: 'Judgment Liens', icon: Scale },
                    { id: 'ucc', label: 'UCC Filings', icon: Briefcase },
                    { id: 'priority', label: 'Priority Waterfall', icon: TrendingUp },
                    { id: 'payoff', label: 'Payoff Demands', icon: DollarSign }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
                        )}
                    </button>
                ))}
            </div>

            {activeTab === 'judgment' && (
                <div className="space-y-4">
                    {judgmentLiens.map((lien) => {
                        const daysUntil = getDaysUntilExpiration(lien.expirationDate);
                        const status = getExpirationStatus(daysUntil);

                        return (
                            <div key={lien.id} className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <JurisdictionBadge jurisdiction={lien.jurisdiction} />
                                            <span className="text-white font-medium">{lien.county}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs ${lien.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    lien.status === 'expired' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-slate-500/20 text-slate-400'
                                                }`}>
                                                {lien.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <MapPin className="w-4 h-4" />
                                            {lien.propertyAddress}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-emerald-400">
                                            {formatCurrency(lien.currentAmount)}
                                        </div>
                                        <div className="text-xs text-slate-500">Current Amount</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                                    <div>
                                        <div className="text-xs text-slate-500">File Number</div>
                                        <div className="text-sm text-white font-mono">{lien.fileNumber}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500">File Date</div>
                                        <div className="text-sm text-white">{new Date(lien.fileDate).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500">Expires</div>
                                        <div className="text-sm text-white">{new Date(lien.expirationDate).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500">Days Remaining</div>
                                        <div className={`text-sm font-semibold flex items-center gap-2 ${status.color}`}>
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${status.bg}`}>{status.label}</span>
                                            {daysUntil.toLocaleString()} days
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-800">
                                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                                        <Eye className="w-4 h-4" />
                                        View Recording
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors">
                                        <RefreshCw className="w-4 h-4" />
                                        Renew Lien
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors">
                                        <FileText className="w-4 h-4" />
                                        Generate Payoff
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {activeTab === 'ucc' && (
                <div className="space-y-4">
                    {uccFilings.map((ucc) => {
                        const daysUntil = getDaysUntilExpiration(ucc.expirationDate);
                        const status = getExpirationStatus(daysUntil);

                        return (
                            <div key={ucc.id} className="bg-slate-900 border border-slate-700 rounded-xl p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <Briefcase className="w-5 h-5 text-purple-400" />
                                            <span className="text-white font-medium">UCC-1 Filing - {ucc.filingState}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs ${ucc.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {ucc.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="text-sm text-slate-400 font-mono">{ucc.fileNumber}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-purple-400">
                                            {formatCurrency(ucc.amountSecured)}
                                        </div>
                                        <div className="text-xs text-slate-500">Secured Amount</div>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
                                    <div className="text-xs text-slate-500 mb-1">Collateral Description</div>
                                    <div className="text-sm text-white">{ucc.collateralDescription}</div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                                    <div>
                                        <div className="text-xs text-slate-500">Filed</div>
                                        <div className="text-sm text-white">{new Date(ucc.fileDate).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500">Expires</div>
                                        <div className="text-sm text-white">{new Date(ucc.expirationDate).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500">Status</div>
                                        <div className={`text-sm font-semibold ${status.color}`}>
                                            {daysUntil.toLocaleString()} days left
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-purple-400 hover:bg-purple-500/10 rounded-lg">
                                        <RefreshCw className="w-4 h-4" />
                                        File Continuation (UCC-3)
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-500/10 rounded-lg">
                                        <FileText className="w-4 h-4" />
                                        Amend Filing
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {activeTab === 'priority' && (
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        Lien Priority Waterfall Analysis
                    </h3>

                    <div className="space-y-4">
                        {/* Property 1 */}
                        <div className="bg-slate-800 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Building2 className="w-5 h-5 text-slate-400" />
                                <span className="text-white font-medium">456 Business Park Dr, Nashville, TN</span>
                            </div>
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-400">Estimated Value</span>
                                    <span className="text-white font-semibold">$1,200,000</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
                                        <div>
                                            <div className="text-sm text-white">First Horizon Bank (Mortgage)</div>
                                            <div className="text-xs text-slate-500">Recorded: 2019-03-15</div>
                                        </div>
                                    </div>
                                    <span className="text-emerald-400 font-semibold">$650,000</span>
                                </div>
                                <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">2</span>
                                        <div>
                                            <div className="text-sm text-white font-semibold">Good Dogg Beverage (Our Lien)</div>
                                            <div className="text-xs text-slate-500">Recorded: 2024-08-20</div>
                                        </div>
                                    </div>
                                    <span className="text-blue-400 font-semibold">$2,450,000</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-700">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Available Equity</span>
                                    <span className="text-emerald-400 font-semibold">$550,000</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-slate-400">Est. Recovery (Our Position)</span>
                                    <span className="text-white font-semibold">$550,000</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <div className="flex items-start gap-3">
                            <Target className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <div className="text-blue-400 font-medium">Total Estimated Recovery from Liens</div>
                                <div className="text-2xl font-bold text-white mt-1">{formatCurrency(550000)}</div>
                                <div className="text-sm text-slate-400 mt-1">Based on current equity positions across all properties</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'payoff' && (
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-emerald-400" />
                            Generate Payoff Statement
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Select Lien</label>
                                    <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                                        {judgmentLiens.map(lien => (
                                            <option key={lien.id} value={lien.id}>
                                                {lien.county} - {lien.fileNumber}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Payoff Date</label>
                                    <input
                                        type="date"
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Recipient (Title Company)</label>
                                    <input
                                        type="text"
                                        placeholder="Enter title company name..."
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-800 rounded-xl p-5">
                                <h4 className="text-white font-medium mb-4">Payoff Calculation</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b border-slate-700">
                                        <span className="text-slate-400">Original Judgment</span>
                                        <span className="text-white">{formatCurrency(caseConfig.judgmentAmount)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-700">
                                        <span className="text-slate-400">Interest Accrued</span>
                                        <span className="text-white">{formatCurrency(calculateInterest())}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-700">
                                        <span className="text-slate-400">Costs & Fees</span>
                                        <span className="text-white">{formatCurrency(5000)}</span>
                                    </div>
                                    <div className="flex justify-between py-3 font-semibold">
                                        <span className="text-white">Total Payoff</span>
                                        <span className="text-emerald-400 text-xl">
                                            {formatCurrency(caseConfig.judgmentAmount + calculateInterest() + 5000)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 text-sm">
                                        <span className="text-slate-500">Per Diem Interest</span>
                                        <span className="text-amber-400">
                                            +{formatCurrency(caseConfig.judgmentAmount * 0.0552 / 365)}/day
                                        </span>
                                    </div>
                                </div>

                                <button className="w-full mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center justify-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Generate Payoff Statement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New Lien Modal */}
            <Modal isOpen={showNewLienModal} onClose={() => setShowNewLienModal(false)} title="Record New Judgment Lien">
                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">State</label>
                            <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                                <option value="FL">Florida</option>
                                <option value="TN">Tennessee</option>
                                <option value="IN">Indiana</option>
                                <option value="CO">Colorado</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">County</label>
                            <input type="text" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Property Address</label>
                        <input type="text" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">File Date</label>
                            <input type="date" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">File Number</label>
                            <input type="text" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setShowNewLienModal(false)} className="flex-1 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">
                            Record Lien
                        </button>
                    </div>
                </form>
            </Modal>

            {/* New UCC Modal */}
            <Modal isOpen={showNewUCCModal} onClose={() => setShowNewUCCModal(false)} title="File UCC-1 Financing Statement">
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Filing State</label>
                        <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                            <option value="TN">Tennessee</option>
                            <option value="FL">Florida</option>
                            <option value="IN">Indiana</option>
                            <option value="CO">Colorado</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Collateral Description</label>
                        <textarea rows={3} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setShowNewUCCModal(false)} className="flex-1 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg">
                            File UCC-1
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
