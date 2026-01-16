'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import {
    Shield, Building2, FileText, DollarSign, Calendar, Plus,
    ChevronRight, AlertTriangle, CheckCircle, Clock
} from 'lucide-react';

const seedJudgmentLiens = [
    {
        id: '1',
        county: 'Brevard County',
        state: 'FL' as const,
        propertyAddress: '123 Commerce Way, Nashville, TN 37203',
        fileDate: '2024-12-01',
        amount: 2378443,
        interestRate: 5.52,
        bookPage: 'OR Book 7892 / Page 1234',
        expires: '2034-12-01',
        status: 'active' as const,
    },
    {
        id: '2',
        county: 'Davidson County',
        state: 'TN' as const,
        propertyAddress: '456 Business Blvd, Franklin, TN 37067',
        fileDate: '2024-12-15',
        amount: 2378443,
        interestRate: 10.00,
        bookPage: 'Book 456 / Page 789',
        expires: '2034-12-15',
        status: 'active' as const,
    },
];

const seedUCCFilings = [
    {
        id: '1',
        state: 'TN' as const,
        filingNumber: 'TN-2024-1234567',
        fileDate: '2024-12-01',
        collateral: 'All assets, equipment, inventory, and accounts receivable',
        securedAmount: 2378443,
        expires: '2029-12-01',
        status: 'active' as const,
    },
];

export default function LiensPage() {
    const { caseConfig, calculateInterest } = useData();
    const [activeTab, setActiveTab] = useState<'judgment' | 'ucc'>('judgment');

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

    const totalSecured = seedJudgmentLiens.reduce((sum, l) => sum + l.amount, 0);

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#23313E] flex items-center gap-3">
                            <Shield className="w-8 h-8 text-[#C7A252]" />
                            Lien & Security Interest Registry
                        </h1>
                        <p className="text-[#5a6a7a] mt-1">Track and manage judgment liens and UCC filings</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#C7A252] hover:bg-[#a88b43] text-[#23313E] rounded-lg font-medium transition-all shadow-sm">
                        <Plus className="w-4 h-4" />
                        Record New Lien
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#23313E]">{seedJudgmentLiens.length}</div>
                        <div className="text-sm text-[#8a95a3]">Judgment Liens</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#3B82F6]">{seedUCCFilings.length}</div>
                        <div className="text-sm text-[#8a95a3]">UCC Filings</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#C7A252]">{formatCurrency(totalSecured)}</div>
                        <div className="text-sm text-[#8a95a3]">Total Secured</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#22C55E]">4</div>
                        <div className="text-sm text-[#8a95a3]">Jurisdictions Covered</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-white border border-[#E5E7EB] rounded-xl p-1 shadow-sm">
                    {[
                        { id: 'judgment', label: 'Judgment Liens', icon: Building2 },
                        { id: 'ucc', label: 'UCC Filings', icon: FileText }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${activeTab === tab.id
                                    ? 'bg-[#C7A252] text-[#23313E] shadow-sm'
                                    : 'text-[#5a6a7a] hover:bg-[#F8F9FA]'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === 'judgment' && (
                    <div className="space-y-4">
                        {seedJudgmentLiens.map((lien) => (
                            <div key={lien.id} className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm hover:border-[#C7A252] transition-all">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Building2 className="w-5 h-5 text-[#C7A252]" />
                                            <JurisdictionBadge jurisdiction={lien.state} />
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                Active
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-[#23313E] mb-1">{lien.propertyAddress}</h3>
                                        <p className="text-sm text-[#5a6a7a]">{lien.county} • {lien.bookPage}</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="px-4 py-2 bg-[#F8F9FA] rounded-lg">
                                            <div className="text-lg font-bold text-[#C7A252]">{formatCurrency(lien.amount)}</div>
                                            <div className="text-xs text-[#8a95a3]">Amount</div>
                                        </div>
                                        <div className="px-4 py-2 bg-[#F8F9FA] rounded-lg">
                                            <div className="text-lg font-bold text-[#23313E]">{lien.interestRate}%</div>
                                            <div className="text-xs text-[#8a95a3]">Rate</div>
                                        </div>
                                        <div className="px-4 py-2 bg-[#F8F9FA] rounded-lg">
                                            <div className="text-sm font-bold text-[#23313E]">{new Date(lien.expires).toLocaleDateString()}</div>
                                            <div className="text-xs text-[#8a95a3]">Expires</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#E5E7EB]">
                                    <div className="flex items-center gap-2 text-sm text-[#5a6a7a]">
                                        <Calendar className="w-4 h-4" />
                                        Filed: {new Date(lien.fileDate).toLocaleDateString()}
                                    </div>
                                    <span className="text-[#C7A252] text-sm font-medium flex items-center gap-1 ml-auto cursor-pointer hover:underline">
                                        View Details <ChevronRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'ucc' && (
                    <div className="space-y-4">
                        {seedUCCFilings.map((filing) => (
                            <div key={filing.id} className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm hover:border-[#C7A252] transition-all">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <FileText className="w-5 h-5 text-[#3B82F6]" />
                                            <JurisdictionBadge jurisdiction={filing.state} />
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                Active
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-[#23313E] mb-1">UCC-1 Financing Statement</h3>
                                        <p className="text-sm text-[#5a6a7a] font-mono">{filing.filingNumber}</p>
                                        <p className="text-sm text-[#5a6a7a] mt-2"><span className="font-medium">Collateral:</span> {filing.collateral}</p>
                                    </div>
                                    <div className="text-center px-6 py-3 bg-[#C7A252]/15 rounded-xl">
                                        <div className="text-xl font-bold text-[#C7A252]">{formatCurrency(filing.securedAmount)}</div>
                                        <div className="text-xs text-[#8a95a3]">Secured Amount</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#E5E7EB] text-sm text-[#5a6a7a]">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Filed: {new Date(filing.fileDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Expires: {new Date(filing.expires).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
