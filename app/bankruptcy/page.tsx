'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import {
    Scale, AlertTriangle, Shield, FileText, Calculator, Clock,
    ChevronRight, CheckCircle, Eye, Plus, Bell
} from 'lucide-react';

export default function BankruptcyPage() {
    const { caseConfig, calculateInterest } = useData();
    const [activeTab, setActiveTab] = useState<'overview' | 'monitoring' | 'poc'>('overview');

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

    const riskScore = 35;
    const riskFactors = [
        { factor: 'Multiple ongoing enforcement actions', impact: 'high' },
        { factor: 'Debtor business appears operational', impact: 'low' },
        { factor: 'No prior bankruptcy filings', impact: 'low' },
        { factor: 'Significant debt load relative to assets', impact: 'medium' },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#23313E] flex items-center gap-3">
                            <Scale className="w-8 h-8 text-[#C7A252]" />
                            Bankruptcy Defense System
                        </h1>
                        <p className="text-[#5a6a7a] mt-1">PACER monitoring, risk assessment, and proof of claim tools</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#C7A252] hover:bg-[#a88b43] text-[#23313E] rounded-lg font-medium transition-all shadow-sm">
                        <Bell className="w-4 h-4" />
                        Set Alert
                    </button>
                </div>

                {/* Risk Score Card */}
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 mb-6 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 relative">
                                <svg className="w-24 h-24 transform -rotate-90">
                                    <circle cx="48" cy="48" r="42" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                                    <circle
                                        cx="48" cy="48" r="42"
                                        stroke={riskScore >= 70 ? '#EF4444' : riskScore >= 40 ? '#F59E0B' : '#22C55E'}
                                        strokeWidth="8"
                                        fill="none"
                                        strokeDasharray={`${(riskScore / 100) * 264} 264`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-[#23313E]">{riskScore}%</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[#23313E]">Bankruptcy Risk Score</h3>
                                <p className="text-sm text-[#22C55E] font-medium">LOW RISK</p>
                                <p className="text-sm text-[#5a6a7a] mt-1">Based on debtor profile and enforcement activity</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center px-6 py-3 bg-[#F8F9FA] rounded-xl">
                                <div className="text-xl font-bold text-[#23313E]">0</div>
                                <div className="text-xs text-[#8a95a3] uppercase font-medium">Prior Filings</div>
                            </div>
                            <div className="text-center px-6 py-3 bg-emerald-50 rounded-xl">
                                <div className="text-xl font-bold text-emerald-600">Active</div>
                                <div className="text-xs text-[#8a95a3] uppercase font-medium">PACER Monitor</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-white border border-[#E5E7EB] rounded-xl p-1 shadow-sm">
                    {[
                        { id: 'overview', label: 'Risk Factors', icon: AlertTriangle },
                        { id: 'monitoring', label: 'PACER Monitoring', icon: Eye },
                        { id: 'poc', label: 'Proof of Claim', icon: FileText }
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

                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Risk Factors */}
                        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#E5E7EB]">
                                <h3 className="font-semibold text-[#23313E]">Risk Factors</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {riskFactors.map((factor, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-lg">
                                        <div className={`w-3 h-3 rounded-full ${factor.impact === 'high' ? 'bg-red-500' :
                                                factor.impact === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                                            }`} />
                                        <span className="text-[#23313E] flex-1">{factor.factor}</span>
                                        <span className={`text-xs font-medium uppercase ${factor.impact === 'high' ? 'text-red-600' :
                                                factor.impact === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                                            }`}>{factor.impact}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Non-Dischargeability */}
                        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#E5E7EB]">
                                <h3 className="font-semibold text-[#23313E]">Non-Dischargeability Analysis</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {[
                                    { section: '§523(a)(2)', description: 'Fraud/False pretenses', applicable: true },
                                    { section: '§523(a)(4)', description: 'Fraud as fiduciary', applicable: false },
                                    { section: '§523(a)(6)', description: 'Willful injury', applicable: false },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-lg">
                                        {item.applicable ? (
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-[#E5E7EB]" />
                                        )}
                                        <div className="flex-1">
                                            <div className="font-medium text-[#23313E]">{item.section}</div>
                                            <div className="text-sm text-[#5a6a7a]">{item.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'monitoring' && (
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#23313E]">PACER Monitoring Active</h3>
                                <p className="text-sm text-[#5a6a7a]">Checking for new filings every 24 hours</p>
                            </div>
                        </div>
                        <div className="p-4 bg-[#F8F9FA] rounded-xl">
                            <div className="flex items-center justify-between">
                                <span className="text-[#23313E]">Management Services Holdings, LLC</span>
                                <span className="text-sm text-emerald-600 font-medium">No filings detected</span>
                            </div>
                            <div className="text-sm text-[#8a95a3] mt-1">Last checked: {new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                )}

                {activeTab === 'poc' && (
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
                        <div className="text-center py-8">
                            <FileText className="w-12 h-12 text-[#8a95a3] mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-[#23313E] mb-2">Proof of Claim Generator</h3>
                            <p className="text-[#5a6a7a] mb-4">Generate Form 410 with pre-filled case information</p>
                            <div className="bg-[#F8F9FA] rounded-xl p-4 max-w-md mx-auto mb-4">
                                <div className="grid grid-cols-2 gap-4 text-sm text-left">
                                    <div>
                                        <span className="text-[#8a95a3]">Principal:</span>
                                        <span className="text-[#23313E] ml-2 font-medium">{formatCurrency(caseConfig.judgmentAmount)}</span>
                                    </div>
                                    <div>
                                        <span className="text-[#8a95a3]">Interest:</span>
                                        <span className="text-[#23313E] ml-2 font-medium">{formatCurrency(calculateInterest())}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="px-6 py-2.5 bg-[#C7A252] text-[#23313E] rounded-lg font-medium hover:bg-[#a88b43] transition-colors">
                                Generate Proof of Claim
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
