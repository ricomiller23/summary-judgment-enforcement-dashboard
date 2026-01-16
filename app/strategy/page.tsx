'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import {
    Brain,
    Target,
    TrendingUp,
    DollarSign,
    AlertTriangle,
    CheckCircle,
    ChevronRight,
    Zap,
    Shield,
    Clock,
    RefreshCw,
    Lightbulb,
    BarChart3,
    Percent,
    ArrowRight,
    Play,
    Pause,
    Settings
} from 'lucide-react';

// Strategy types
interface StrategyRecommendation {
    id: string;
    name: string;
    confidence: number;
    description: string;
    tactics: string[];
    timeline: string;
    cost: string;
    expectedRecovery: string;
    riskLevel: 'low' | 'medium' | 'high';
}

const STRATEGIES: StrategyRecommendation[] = [
    {
        id: 'aggressive',
        name: 'Aggressive Asset Seizure',
        confidence: 87,
        description: 'Full enforcement campaign targeting all known assets simultaneously',
        tactics: [
            'File judgment liens on all real property',
            'Issue simultaneous bank garnishments',
            'Wage garnishment on owners',
            'A/R garnishments on top customers',
            'Schedule debtor examination'
        ],
        timeline: '3-6 months',
        cost: '$15,000-$25,000',
        expectedRecovery: '70-90%',
        riskLevel: 'high'
    },
    {
        id: 'surgical',
        name: 'Surgical Strikes',
        confidence: 72,
        description: 'Target highest-value assets with precision enforcement',
        tactics: [
            'Focus on commercial real estate ($550K equity)',
            'Single bank levy on primary account',
            'Pressure through lien filings only',
            'Negotiate with leverage'
        ],
        timeline: '2-4 months',
        cost: '$8,000-$12,000',
        expectedRecovery: '40-60%',
        riskLevel: 'medium'
    },
    {
        id: 'negotiated',
        name: 'Negotiated Settlement',
        confidence: 65,
        description: 'Structured negotiation leveraging enforcement threat',
        tactics: [
            'Send final demand with enforcement warning',
            'Propose structured payment plan',
            'Offer discount for quick resolution',
            'Preserve business relationship option'
        ],
        timeline: '1-3 months',
        cost: '$3,000-$6,000',
        expectedRecovery: '50-70%',
        riskLevel: 'low'
    },
    {
        id: 'pressure',
        name: 'Pressure Campaign',
        confidence: 58,
        description: 'Non-monetary pressure to force settlement',
        tactics: [
            'Credit bureau reporting',
            'Record judgment liens publicly',
            'Customer garnishment threats',
            'Professional license notifications'
        ],
        timeline: '1-2 months',
        cost: '$2,000-$4,000',
        expectedRecovery: '60-80%',
        riskLevel: 'medium'
    }
];

const ACTION_SEQUENCE = [
    {
        week: 1, title: 'Establish Dominance', actions: [
            { day: 1, action: 'File judgment liens on all TN real property', impact: 'Blocks refinancing, forces attention' },
            { day: 2, action: 'Issue information subpoenas to top 5 customers', impact: 'Reveals A/R, creates business pressure' },
            { day: 3, action: 'File UCC-1 financing statement on all business assets', impact: 'Prevents asset sales, establishes priority' },
            { day: 5, action: 'Send Nuclear Option demand letter', impact: 'Threatens immediate receivership if no response in 10 days' }
        ]
    },
    {
        week: 2, title: 'Intelligence Gathering', actions: [
            { day: 8, action: 'Serve judgment debtor interrogatories', impact: 'Discover hidden assets' },
            { day: 9, action: 'Issue bank account subpoenas (3 known banks)', impact: 'Identify account balances' },
            { day: 12, action: 'Schedule debtor examination (30 days out)', impact: 'Force disclosure under oath' }
        ]
    },
    {
        week: 3, title: 'First Strike Enforcement', actions: [
            { day: 15, action: 'File bank account garnishments (hit all 3 banks simultaneously)', impact: 'Expected recovery $10K-$40K' },
            { day: 17, action: 'File wage garnishment on owner\'s salary', impact: 'Expected recovery $1.5K/month ongoing' },
            { day: 19, action: 'Serve A/R garnishments on top 3 customers', impact: 'Expected recovery $15K-$60K' }
        ]
    },
    {
        week: 4, title: 'Evaluation & Escalation', actions: [
            { day: 22, action: 'Evaluate recovery to date', impact: 'Determine next phase' },
            { day: 25, action: 'If < $50K collected: File receivership petition', impact: 'Take over business operations' },
            { day: 25, action: 'If $50K-$100K: Offer 70 cents settlement', impact: '30-day deadline to accept' },
            { day: 25, action: 'If > $100K: Continue garnishments', impact: 'Monitor compliance, maintain pressure' }
        ]
    }
];

export default function StrategyPage() {
    const { caseConfig, calculateInterest, getRecoveryProbability, getTotalKnownAssets, assetIntelligence } = useData();
    const [selectedStrategy, setSelectedStrategy] = useState<StrategyRecommendation>(STRATEGIES[0]);
    const [activeTab, setActiveTab] = useState<'recommend' | 'sequence' | 'analytics' | 'automation'>('recommend');

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

    const recoveryProbability = getRecoveryProbability;
    const totalAssets = getTotalKnownAssets;
    const totalDebt = caseConfig.judgmentAmount + calculateInterest();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Brain className="w-7 h-7 text-purple-400" />
                        AI Collection Strategy Engine
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Intelligent analysis and recommendations for optimal recovery
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium">
                    <RefreshCw className="w-4 h-4" />
                    Recalculate
                </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-purple-400" />
                        <span className="text-xs text-slate-500">Recovery Score</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-400">{recoveryProbability}%</div>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-slate-500">Known Assets</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400">{formatCurrency(totalAssets)}</div>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span className="text-xs text-slate-500">BK Risk</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-400">35%</div>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-slate-500">Total Owed</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{formatCurrency(totalDebt)}</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-slate-700">
                {[
                    { id: 'recommend', label: 'Strategy Recommendations', icon: Lightbulb },
                    { id: 'sequence', label: 'Action Sequence', icon: Zap },
                    { id: 'analytics', label: 'Predictive Analytics', icon: BarChart3 },
                    { id: 'automation', label: 'Automation', icon: Settings }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab.id ? 'text-purple-400' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400" />
                        )}
                    </button>
                ))}
            </div>

            {activeTab === 'recommend' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Strategy Cards */}
                    <div className="lg:col-span-2 space-y-4">
                        {STRATEGIES.map((strategy) => (
                            <div
                                key={strategy.id}
                                onClick={() => setSelectedStrategy(strategy)}
                                className={`bg-slate-900 border rounded-xl p-5 cursor-pointer transition-all ${selectedStrategy.id === strategy.id
                                        ? 'border-purple-500'
                                        : 'border-slate-700 hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-white font-semibold flex items-center gap-2">
                                            {strategy.name}
                                            {strategy.id === 'aggressive' && (
                                                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                                                    RECOMMENDED
                                                </span>
                                            )}
                                        </h3>
                                        <p className="text-sm text-slate-400 mt-1">{strategy.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-purple-400">{strategy.confidence}%</div>
                                        <div className="text-xs text-slate-500">confidence</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-slate-400">
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        {strategy.timeline}
                                    </span>
                                    <span className="text-slate-400">
                                        <DollarSign className="w-4 h-4 inline mr-1" />
                                        {strategy.cost}
                                    </span>
                                    <span className="text-emerald-400">
                                        <Percent className="w-4 h-4 inline mr-1" />
                                        {strategy.expectedRecovery} recovery
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-xs ${strategy.riskLevel === 'low' ? 'bg-emerald-500/20 text-emerald-400' :
                                            strategy.riskLevel === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                                'bg-red-500/20 text-red-400'
                                        }`}>
                                        {strategy.riskLevel.toUpperCase()} RISK
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Strategy Detail */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-400" />
                            {selectedStrategy.name}
                        </h3>

                        <div className="mb-4">
                            <div className="text-xs text-slate-500 mb-2">Confidence Level</div>
                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                                    style={{ width: `${selectedStrategy.confidence}%` }}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="text-xs text-slate-500 mb-2">Key Tactics</div>
                            <ul className="space-y-2">
                                {selectedStrategy.tactics.map((tactic, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                        <ChevronRight className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                                        {tactic}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button className="w-full mt-4 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg flex items-center justify-center gap-2">
                            <Play className="w-5 h-5" />
                            Execute Strategy
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'sequence' && (
                <div className="space-y-6">
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <Zap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <div className="text-purple-400 font-medium">Aggressive Asset Seizure - Week-by-Week Action Plan</div>
                                <div className="text-sm text-slate-400 mt-1">
                                    Detailed execution sequence for maximum recovery pressure
                                </div>
                            </div>
                        </div>
                    </div>

                    {ACTION_SEQUENCE.map((week) => (
                        <div key={week.week} className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                            <div className="bg-slate-800 px-5 py-3 border-b border-slate-700">
                                <h3 className="font-semibold text-white flex items-center gap-2">
                                    <span className="w-7 h-7 bg-purple-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
                                        {week.week}
                                    </span>
                                    Week {week.week}: {week.title}
                                </h3>
                            </div>
                            <div className="divide-y divide-slate-800">
                                {week.actions.map((action, i) => (
                                    <div key={i} className="px-5 py-4 flex items-start gap-4">
                                        <div className="text-sm text-slate-500 w-16">Day {action.day}</div>
                                        <div className="flex-1">
                                            <div className="text-white font-medium">{action.action}</div>
                                            <div className="text-sm text-slate-400 mt-1 flex items-center gap-1">
                                                <ArrowRight className="w-3 h-3" />
                                                {action.impact}
                                            </div>
                                        </div>
                                        <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 rounded-lg">
                                            Execute
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Projected Outcomes */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4">Projected Outcomes</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
                                <div className="text-sm text-slate-400 mb-1">Best Case</div>
                                <div className="text-xl font-bold text-emerald-400">$850K - $1.2M</div>
                                <div className="text-xs text-slate-500">Full satisfaction</div>
                            </div>
                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-center">
                                <div className="text-sm text-slate-400 mb-1">Likely Case</div>
                                <div className="text-xl font-bold text-amber-400">$500K - $700K</div>
                                <div className="text-xs text-slate-500">60-75% recovery</div>
                            </div>
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                                <div className="text-sm text-slate-400 mb-1">Worst Case</div>
                                <div className="text-xl font-bold text-red-400">$200K - $300K</div>
                                <div className="text-xs text-slate-500">Debtor files BK</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'analytics' && (
                <div className="space-y-6">
                    {/* Recovery Probability Breakdown */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-400" />
                            Recovery Probability Factors
                        </h3>

                        <div className="space-y-4">
                            {[
                                { label: 'Asset Coverage', score: 75, desc: 'Known assets exceed 50% of judgment' },
                                { label: 'Liquidity', score: 45, desc: 'Limited liquid assets, mostly real estate' },
                                { label: 'Cooperation', score: 20, desc: 'Non-responsive, ignored 3 demands' },
                                { label: 'Legal Exposure', score: 85, desc: 'Multiple enforcement options available' },
                                { label: 'Business Viability', score: 60, desc: 'Active operations, declining revenue' }
                            ].map((factor, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-white">{factor.label}</span>
                                        <span className="text-sm text-slate-400">{factor.score}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-1">
                                        <div
                                            className={`h-full rounded-full ${factor.score >= 70 ? 'bg-emerald-500' :
                                                    factor.score >= 40 ? 'bg-amber-500' :
                                                        'bg-red-500'
                                                }`}
                                            style={{ width: `${factor.score}%` }}
                                        />
                                    </div>
                                    <div className="text-xs text-slate-500">{factor.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Similar Case Outcomes */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4">Similar Case Outcomes</h3>
                        <div className="space-y-4">
                            {[
                                { caseType: '$1.8M vs LLC with retail business', strategy: 'Aggressive seizure', outcome: '67%', time: '5 months' },
                                { caseType: '$3.1M vs LLC with service business', strategy: 'Negotiated settlement', outcome: '61%', time: '2 months' },
                                { caseType: '$2.5M vs LLC with real estate', strategy: 'Surgical strike', outcome: '96%', time: '8 months' }
                            ].map((c, i) => (
                                <div key={i} className="bg-slate-800 rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="text-white font-medium">{c.caseType}</div>
                                        <span className="text-emerald-400 font-bold">{c.outcome}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <span>Strategy: {c.strategy}</span>
                                        <span>Timeline: {c.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-slate-400">
                            <strong className="text-blue-400">Insight:</strong> Cases with commercial real estate recovered an average of 73% when aggressive enforcement was used.
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'automation' && (
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-purple-400" />
                            Enforcement Automation Rules
                        </h3>

                        <div className="space-y-4">
                            {[
                                { name: 'Daily Interest Updates', desc: 'Recalculate interest accrual at midnight', status: 'active' },
                                { name: 'Payment Plan Reminders', desc: 'Send reminder 3 days before due date', status: 'active' },
                                { name: 'PACER Bankruptcy Check', desc: 'Check for new filings every 4 hours', status: 'active' },
                                { name: 'Lien Expiration Alerts', desc: 'Alert at 365, 180, 90, 60, 30 days', status: 'active' },
                                { name: 'Asset Transfer Monitoring', desc: 'Weekly property record scan', status: 'active' },
                                { name: 'Auto-Escalation', desc: 'Escalate enforcement after 30 days non-response', status: 'paused' }
                            ].map((rule, i) => (
                                <div key={i} className="flex items-center justify-between bg-slate-800 rounded-lg p-4">
                                    <div>
                                        <div className="text-white font-medium">{rule.name}</div>
                                        <div className="text-sm text-slate-400">{rule.desc}</div>
                                    </div>
                                    <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${rule.status === 'active'
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : 'bg-slate-700 text-slate-400'
                                        }`}>
                                        {rule.status === 'active' ? (
                                            <><Play className="w-4 h-4" /> Active</>
                                        ) : (
                                            <><Pause className="w-4 h-4" /> Paused</>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <Brain className="w-8 h-8 text-purple-400 flex-shrink-0" />
                            <div>
                                <h3 className="text-purple-400 font-semibold mb-2">AI-Powered Automation</h3>
                                <p className="text-sm text-slate-400 mb-4">
                                    The automation engine continuously monitors your case and takes action based on pre-defined rules.
                                    All automated actions require attorney approval before execution.
                                </p>
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg">
                                        Configure Rules
                                    </button>
                                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg">
                                        View Automation Log
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
