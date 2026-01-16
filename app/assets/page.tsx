'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { Target, Building2, Landmark, Car, Briefcase, RefreshCw, Eye } from 'lucide-react';

export default function AssetsPage() {
    const { getRecoveryProbability, getTotalKnownAssets } = useData();
    const [activeTab, setActiveTab] = useState<'overview' | 'property' | 'accounts' | 'vehicles' | 'business'>('overview');

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#23313E] flex items-center gap-3">
                            <Target className="w-8 h-8 text-[#C7A252]" />
                            Asset Intelligence Hub
                        </h1>
                        <p className="text-[#5a6a7a] mt-1">Comprehensive debtor asset tracking</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#C7A252] hover:bg-[#a88b43] text-[#23313E] rounded-lg font-medium">
                        <RefreshCw className="w-4 h-4" />
                        Refresh Data
                    </button>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 mb-6 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 relative">
                                <svg className="w-20 h-20 transform -rotate-90">
                                    <circle cx="40" cy="40" r="36" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                                    <circle cx="40" cy="40" r="36" stroke="#C7A252" strokeWidth="8" fill="none"
                                        strokeDasharray={`${(getRecoveryProbability / 100) * 226} 226`} strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-[#23313E]">{getRecoveryProbability}%</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[#23313E]">Recovery Probability</h3>
                                <p className="text-sm text-[#5a6a7a]">Based on known assets</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center px-6 py-3 bg-[#F8F9FA] rounded-xl">
                                <div className="text-xl font-bold text-[#C7A252]">{formatCurrency(getTotalKnownAssets)}</div>
                                <div className="text-xs text-[#8a95a3] uppercase">Total Assets</div>
                            </div>
                            <div className="text-center px-6 py-3 bg-[#F8F9FA] rounded-xl">
                                <div className="text-xl font-bold text-[#22C55E]">4</div>
                                <div className="text-xs text-[#8a95a3] uppercase">Jurisdictions</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-1 mb-6 bg-white border border-[#E5E7EB] rounded-xl p-1 shadow-sm">
                    {[
                        { id: 'overview', label: 'Overview', icon: Eye },
                        { id: 'property', label: 'Property', icon: Building2 },
                        { id: 'accounts', label: 'Accounts', icon: Landmark },
                        { id: 'vehicles', label: 'Vehicles', icon: Car },
                        { id: 'business', label: 'Business', icon: Briefcase }
                    ].map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium flex-1 justify-center ${activeTab === tab.id ? 'bg-[#C7A252] text-[#23313E]' : 'text-[#5a6a7a] hover:bg-[#F8F9FA]'
                                }`}>
                            <tab.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm text-center">
                    <Target className="w-16 h-16 text-[#C7A252] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[#23313E] mb-2">Asset Discovery Available</h3>
                    <p className="text-[#5a6a7a] max-w-md mx-auto">
                        Use the enforcement actions and document suite to discover and track debtor assets.
                    </p>
                </div>
            </div>
        </div>
    );
}
