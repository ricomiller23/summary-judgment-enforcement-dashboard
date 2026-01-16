'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import {
    Brain, Target, TrendingUp, Clock, CheckCircle, Play,
    ChevronRight, Zap, DollarSign, Calendar, Settings
} from 'lucide-react';

const strategies = [
    {
        id: '1',
        name: 'Aggressive Asset Seizure',
        confidence: 87,
        timeline: '3-6 months',
        expectedRecovery: '70-90%',
        risk: 'Medium',
        description: 'Simultaneous levy on all known bank accounts and wage garnishment',
        tactics: ['Bank levies', 'Wage garnishment', 'Property liens']
    },
    {
        id: '2',
        name: 'Surgical Strikes',
        confidence: 72,
        timeline: '2-4 months',
        expectedRecovery: '40-60%',
        risk: 'Low',
        description: 'Target highest-value assets with lowest exemption exposure',
        tactics: ['Commercial property levy', 'A/R garnishment', 'Bank discovery']
    },
    {
        id: '3',
        name: 'Negotiated Settlement',
        confidence: 65,
        timeline: '1-3 months',
        expectedRecovery: '50-70%',
        risk: 'Low',
        description: 'Structured settlement with payment plan backed by security',
        tactics: ['Settlement offer', 'Payment plan', 'Personal guarantee']
    },
];

const actionSequence = [
    { week: 1, action: 'File judgment liens in all identified counties', status: 'complete' },
    { week: 2, action: 'Serve bank subpoenas for account discovery', status: 'complete' },
    { week: 3, action: 'Initiate wage garnishment proceedings', status: 'in-progress' },
    { week: 4, action: 'Levy accounts with confirmed balances', status: 'pending' },
    { week: 5, action: 'Schedule debtor examination', status: 'pending' },
    { week: 6, action: 'Evaluate settlement or escalation options', status: 'pending' },
];

export default function StrategyPage() {
    const { caseConfig, getRecoveryProbability } = useData();
    const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]);
    const [activeTab, setActiveTab] = useState<'recommend' | 'sequence' | 'automation'>('recommend');

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#23313E] flex items-center gap-3">
                            <Brain className="w-8 h-8 text-[#C7A252]" />
                            AI Strategy Engine
                        </h1>
                        <p className="text-[#5a6a7a] mt-1">Intelligent recommendations for optimal recovery</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">AI Analysis Active</span>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#C7A252]/15 rounded-lg flex items-center justify-center">
                                <Target className="w-5 h-5 text-[#C7A252]" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-[#C7A252]">{getRecoveryProbability}%</div>
                        <div className="text-sm text-[#8a95a3]">Recovery Confidence</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#3B82F6]/10 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-[#3B82F6]" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-[#3B82F6]">{strategies.length}</div>
                        <div className="text-sm text-[#8a95a3]">Strategies Available</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-[#22C55E]" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-[#22C55E]">{formatCurrency(caseConfig.judgmentAmount)}</div>
                        <div className="text-sm text-[#8a95a3]">Target Amount</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#8B5CF6]/10 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-[#8B5CF6]" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-[#8B5CF6]">3-6 mo</div>
                        <div className="text-sm text-[#8a95a3]">Est. Timeline</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-white border border-[#E5E7EB] rounded-xl p-1 shadow-sm">
                    {[
                        { id: 'recommend', label: 'Recommendations', icon: Brain },
                        { id: 'sequence', label: 'Action Sequence', icon: Play },
                        { id: 'automation', label: 'Automation Rules', icon: Settings }
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

                {activeTab === 'recommend' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {strategies.map((strategy) => (
                            <div
                                key={strategy.id}
                                onClick={() => setSelectedStrategy(strategy)}
                                className={`bg-white border rounded-xl p-6 shadow-sm cursor-pointer transition-all ${selectedStrategy.id === strategy.id
                                        ? 'border-[#C7A252] ring-2 ring-[#C7A252]/20'
                                        : 'border-[#E5E7EB] hover:border-[#C7A252]'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-[#C7A252]/15 rounded-xl flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-[#C7A252]" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-[#C7A252]">{strategy.confidence}%</div>
                                        <div className="text-xs text-[#8a95a3]">Confidence</div>
                                    </div>
                                </div>
                                <h3 className="font-semibold text-[#23313E] mb-2">{strategy.name}</h3>
                                <p className="text-sm text-[#5a6a7a] mb-4">{strategy.description}</p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-[#8a95a3]">{strategy.timeline}</span>
                                    <span className="text-emerald-600 font-medium">{strategy.expectedRecovery}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {strategy.tactics.map((tactic, i) => (
                                        <span key={i} className="px-2 py-1 bg-[#F8F9FA] text-[#5a6a7a] text-xs rounded-full">
                                            {tactic}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'sequence' && (
                    <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#E5E7EB]">
                            <h3 className="font-semibold text-[#23313E]">Week-by-Week Action Plan</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {actionSequence.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${item.status === 'complete' ? 'bg-emerald-100 text-emerald-700' :
                                                item.status === 'in-progress' ? 'bg-[#C7A252]/20 text-[#C7A252]' :
                                                    'bg-[#F8F9FA] text-[#8a95a3]'
                                            }`}>
                                            {item.status === 'complete' ? <CheckCircle className="w-5 h-5" /> : `W${item.week}`}
                                        </div>
                                        <div className="flex-1">
                                            <div className={`font-medium ${item.status === 'complete' ? 'text-[#8a95a3] line-through' : 'text-[#23313E]'
                                                }`}>{item.action}</div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'complete' ? 'bg-emerald-100 text-emerald-700' :
                                                item.status === 'in-progress' ? 'bg-[#C7A252]/20 text-[#C7A252]' :
                                                    'bg-[#F8F9FA] text-[#8a95a3]'
                                            }`}>{item.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'automation' && (
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-[#23313E] mb-4">Automation Rules</h3>
                        <div className="space-y-3">
                            {[
                                { name: 'Daily interest calculation', status: 'active', frequency: 'Daily' },
                                { name: 'PACER bankruptcy check', status: 'active', frequency: 'Weekly' },
                                { name: 'Payment reminder emails', status: 'paused', frequency: 'Monthly' },
                                { name: 'Lien expiration alerts', status: 'active', frequency: 'Monthly' },
                            ].map((rule, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${rule.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'
                                            }`} />
                                        <span className="font-medium text-[#23313E]">{rule.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-[#8a95a3]">{rule.frequency}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${rule.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                                            }`}>{rule.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
