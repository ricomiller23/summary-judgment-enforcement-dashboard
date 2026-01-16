'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { Modal } from '@/components/ui/Modal';
import {
    Shield,
    AlertTriangle,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    Scale,
    DollarSign,
    Calendar,
    User,
    Building2,
    TrendingDown,
    Eye,
    Download,
    Bell,
    Pause,
    Play,
    AlertCircle,
    Target,
    ChevronRight
} from 'lucide-react';

// Types
interface BankruptcyCase {
    id: string;
    debtorName: string;
    caseNumber: string;
    chapter: 7 | 11 | 13;
    filingDate: string;
    court: string;
    judge: string;
    trustee: {
        name: string;
        email: string;
        phone: string;
    };
    meeting341Date: string;
    claimsBarDate: string;
    status: 'active' | 'dismissed' | 'discharged' | 'closed';
}

interface ProofOfClaim {
    id: string;
    claimNumber: string;
    amountClaimed: number;
    classification: 'secured' | 'priority_unsecured' | 'general_unsecured';
    filedDate: string;
    status: 'pending' | 'allowed' | 'objected' | 'disallowed';
}

// NO active bankruptcy - monitoring status
const DEBTOR_BANKRUPTCY_RISK = {
    score: 35,
    lastUpdated: new Date().toISOString(),
    factors: [
        { name: 'Multiple creditor lawsuits', impact: 'high', score: 25 },
        { name: 'Business revenue declining', impact: 'medium', score: 15 },
        { name: 'Asset transfers detected', impact: 'high', score: 20 },
        { name: 'Non-responsive to demands', impact: 'medium', score: 10 },
        { name: 'No prior bankruptcy history', impact: 'low_positive', score: -15 },
        { name: 'Active business operations', impact: 'low_positive', score: -20 }
    ]
};

export default function BankruptcyPage() {
    const { caseConfig, calculateInterest } = useData();
    const [activeTab, setActiveTab] = useState<'monitoring' | 'claims' | 'defense' | 'tools'>('monitoring');
    const [alertsEnabled, setAlertsEnabled] = useState(true);
    const [showProofOfClaimModal, setShowProofOfClaimModal] = useState(false);
    const [showAdversaryModal, setShowAdversaryModal] = useState(false);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

    const getRiskColor = (score: number) => {
        if (score <= 25) return { text: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'LOW RISK' };
        if (score <= 50) return { text: 'text-amber-400', bg: 'bg-amber-500/20', label: 'MODERATE RISK' };
        if (score <= 75) return { text: 'text-orange-400', bg: 'bg-orange-500/20', label: 'HIGH RISK' };
        return { text: 'text-red-400', bg: 'bg-red-500/20', label: 'CRITICAL' };
    };

    const riskStatus = getRiskColor(DEBTOR_BANKRUPTCY_RISK.score);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Shield className="w-7 h-7 text-blue-400" />
                        Bankruptcy Defense System
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Monitor for filings, prepare claims, and protect recovery
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setAlertsEnabled(!alertsEnabled)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${alertsEnabled
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                    >
                        {alertsEnabled ? <Bell className="w-4 h-4" /> : <Bell className="w-4 h-4 opacity-50" />}
                        PACER Alerts {alertsEnabled ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>

            {/* Status Banner - No Active Bankruptcy */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                    <div>
                        <div className="text-emerald-400 font-semibold">No Active Bankruptcy Filing</div>
                        <div className="text-sm text-slate-400">Debtor has not filed for bankruptcy protection. Continue enforcement actions.</div>
                    </div>
                </div>
            </div>

            {/* Risk Score Card */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                            <TrendingDown className="w-5 h-5 text-blue-400" />
                            Bankruptcy Risk Assessment
                        </h3>
                        <p className="text-sm text-slate-400 mb-4">
                            AI-powered analysis of debtor's likelihood to file bankruptcy
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${riskStatus.bg}`}>
                        <div className={`text-2xl font-bold ${riskStatus.text}`}>{DEBTOR_BANKRUPTCY_RISK.score}%</div>
                        <div className={`text-xs ${riskStatus.text}`}>{riskStatus.label}</div>
                    </div>
                </div>

                {/* Risk Meter */}
                <div className="mb-6">
                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 rounded-full transition-all"
                            style={{ width: `${DEBTOR_BANKRUPTCY_RISK.score}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>Low Risk</span>
                        <span>Moderate</span>
                        <span>High</span>
                        <span>Critical</span>
                    </div>
                </div>

                {/* Risk Factors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {DEBTOR_BANKRUPTCY_RISK.factors.map((factor, i) => (
                        <div
                            key={i}
                            className={`flex items-center justify-between p-3 rounded-lg ${factor.score > 0 ? 'bg-red-500/10' : 'bg-emerald-500/10'
                                }`}
                        >
                            <span className="text-sm text-slate-300">{factor.name}</span>
                            <span className={`text-sm font-semibold ${factor.score > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                {factor.score > 0 ? '+' : ''}{factor.score}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-slate-700">
                {[
                    { id: 'monitoring', label: 'PACER Monitoring', icon: Eye },
                    { id: 'claims', label: 'Proof of Claim', icon: FileText },
                    { id: 'defense', label: 'Non-Discharge', icon: Scale },
                    { id: 'tools', label: 'Chapter Tools', icon: Target }
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

            {activeTab === 'monitoring' && (
                <div className="space-y-6">
                    {/* Monitoring Status */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-blue-400" />
                            PACER Monitoring Configuration
                        </h3>

                        <div className="space-y-4">
                            {[
                                { name: 'Management Services Holdings, LLC', status: 'active', lastCheck: '2 hours ago' },
                                { name: 'MSH Properties, LLC', status: 'active', lastCheck: '2 hours ago' },
                                { name: 'John Doe (Individual)', status: 'active', lastCheck: '2 hours ago' }
                            ].map((debtor, i) => (
                                <div key={i} className="flex items-center justify-between bg-slate-800 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                        <div>
                                            <div className="text-white font-medium">{debtor.name}</div>
                                            <div className="text-xs text-slate-500">Last checked: {debtor.lastCheck}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">
                                            NO FILINGS
                                        </span>
                                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                                            <Pause className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Bell className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-blue-400 font-medium">Alert Configuration</div>
                                    <div className="text-sm text-slate-400 mt-1">
                                        You'll receive immediate alerts via email and SMS when any monitored debtor files for bankruptcy protection.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* What Happens If They File */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                            If Bankruptcy Is Filed
                        </h3>

                        <div className="space-y-3">
                            {[
                                { step: '1', title: 'STOP ALL COLLECTION', desc: 'Automatic stay takes effect immediately - no garnishments, levies, or contact', urgent: true },
                                { step: '2', title: 'File Proof of Claim', desc: 'Submit claim before bar date (typically 70-90 days after filing)', urgent: false },
                                { step: '3', title: 'Attend 341 Meeting', desc: 'Optional but recommended - chance to question debtor under oath', urgent: false },
                                { step: '4', title: 'Evaluate Non-Discharge', desc: 'Determine if debt qualifies for non-dischargeability under §523', urgent: false },
                                { step: '5', title: 'Monitor Distribution', desc: 'Track trustee distributions and plan payments', urgent: false }
                            ].map((item) => (
                                <div
                                    key={item.step}
                                    className={`flex items-start gap-4 p-4 rounded-lg ${item.urgent ? 'bg-red-500/10 border border-red-500/30' : 'bg-slate-800'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${item.urgent ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'
                                        }`}>
                                        {item.step}
                                    </div>
                                    <div>
                                        <div className={`font-medium ${item.urgent ? 'text-red-400' : 'text-white'}`}>
                                            {item.title}
                                        </div>
                                        <div className="text-sm text-slate-400">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'claims' && (
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-400" />
                                Proof of Claim Generator (Form 410)
                            </h3>
                            <button
                                onClick={() => setShowProofOfClaimModal(true)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg"
                            >
                                Prepare Claim
                            </button>
                        </div>

                        <div className="bg-slate-800 rounded-xl p-5">
                            <h4 className="text-white font-medium mb-4">Claim Amount Calculation</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-slate-700">
                                    <span className="text-slate-400">Original Judgment</span>
                                    <span className="text-white">{formatCurrency(caseConfig.judgmentAmount)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-700">
                                    <span className="text-slate-400">Post-Judgment Interest</span>
                                    <span className="text-white">{formatCurrency(calculateInterest())}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-700">
                                    <span className="text-slate-400">Costs & Attorney Fees</span>
                                    <span className="text-white">{formatCurrency(15000)}</span>
                                </div>
                                <div className="flex justify-between py-3 font-semibold text-lg">
                                    <span className="text-white">Total Claim Amount</span>
                                    <span className="text-emerald-400">
                                        {formatCurrency(caseConfig.judgmentAmount + calculateInterest() + 15000)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-700">
                                <div className="text-sm text-slate-400 mb-2">Claim Classification</div>
                                <div className="flex gap-3">
                                    <span className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-sm rounded-lg">
                                        General Unsecured (if no collateral)
                                    </span>
                                    <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-sm rounded-lg">
                                        Secured (to extent of lien value)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-amber-400 font-medium">Claims Bar Date Reminder</div>
                                    <div className="text-sm text-slate-400 mt-1">
                                        When bankruptcy is filed, you'll have a limited time to submit your proof of claim (typically 70-90 days). Missing this deadline could result in loss of your claim.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Required Documents */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4">Supporting Documentation Checklist</h3>
                        <div className="space-y-2">
                            {[
                                { doc: 'Certified Copy of Judgment', status: 'ready' },
                                { doc: 'Interest Calculation Statement', status: 'ready' },
                                { doc: 'Lien Documentation', status: 'ready' },
                                { doc: 'Affidavit of Claim Amount', status: 'pending' },
                                { doc: 'Attorney Fee Statement', status: 'pending' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between bg-slate-800 rounded-lg p-3">
                                    <span className="text-sm text-white">{item.doc}</span>
                                    {item.status === 'ready' ? (
                                        <span className="flex items-center gap-1 text-emerald-400 text-sm">
                                            <CheckCircle className="w-4 h-4" /> Ready
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-amber-400 text-sm">
                                            <Clock className="w-4 h-4" /> Prepare
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'defense' && (
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Scale className="w-5 h-5 text-purple-400" />
                            Non-Dischargeability Analysis (§523)
                        </h3>

                        <p className="text-slate-400 mb-6 text-sm">
                            Certain debts cannot be discharged in bankruptcy. Evaluate if your claim qualifies for non-dischargeability.
                        </p>

                        <div className="space-y-4">
                            {[
                                {
                                    section: '§523(a)(2)',
                                    title: 'Fraud, False Pretenses, False Representations',
                                    applicability: 'low',
                                    description: 'Debt obtained through fraud or material misrepresentation'
                                },
                                {
                                    section: '§523(a)(4)',
                                    title: 'Embezzlement, Larceny, Breach of Fiduciary Duty',
                                    applicability: 'medium',
                                    description: 'Debt arising from breach of trust or fiduciary relationship'
                                },
                                {
                                    section: '§523(a)(6)',
                                    title: 'Willful and Malicious Injury',
                                    applicability: 'medium',
                                    description: 'Intentional tort causing injury to person or property'
                                }
                            ].map((item) => (
                                <div key={item.section} className="bg-slate-800 rounded-xl p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="text-white font-medium">{item.section}: {item.title}</div>
                                            <div className="text-sm text-slate-400 mt-1">{item.description}</div>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs ${item.applicability === 'high' ? 'bg-emerald-500/20 text-emerald-400' :
                                                item.applicability === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                                    'bg-slate-600/20 text-slate-400'
                                            }`}>
                                            {item.applicability.toUpperCase()} APPLICABILITY
                                        </span>
                                    </div>
                                    <button className="mt-3 text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1">
                                        Evaluate for this case <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => setShowAdversaryModal(true)}
                                className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg flex items-center justify-center gap-2"
                            >
                                <Scale className="w-5 h-5" />
                                Generate Adversary Proceeding Complaint
                            </button>
                        </div>
                    </div>

                    {/* Deadline Calculator */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-400" />
                            Adversary Proceeding Deadline Calculator
                        </h3>

                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-amber-400 font-medium">Critical Deadline</div>
                                    <div className="text-sm text-slate-400 mt-1">
                                        Non-dischargeability complaints must typically be filed within <strong className="text-white">60 days</strong> of the first date set for the 341 meeting. Missing this deadline bars the complaint.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'tools' && (
                <div className="space-y-6">
                    {/* Chapter 7 */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4">Chapter 7 - Liquidation</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Trustee liquidates non-exempt assets and distributes proceeds to creditors.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800 rounded-lg p-4">
                                <div className="text-sm text-slate-500 mb-1">Typical Duration</div>
                                <div className="text-white font-semibold">3-6 months</div>
                            </div>
                            <div className="bg-slate-800 rounded-lg p-4">
                                <div className="text-sm text-slate-500 mb-1">Recovery Rate</div>
                                <div className="text-amber-400 font-semibold">5-15% (typical)</div>
                            </div>
                        </div>
                        <button className="mt-4 text-blue-400 hover:text-blue-300 text-sm">
                            Chapter 7 Recovery Calculator →
                        </button>
                    </div>

                    {/* Chapter 11 */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4">Chapter 11 - Reorganization</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Business continues operations while reorganizing debts under court supervision.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800 rounded-lg p-4">
                                <div className="text-sm text-slate-500 mb-1">Typical Duration</div>
                                <div className="text-white font-semibold">1-3 years</div>
                            </div>
                            <div className="bg-slate-800 rounded-lg p-4">
                                <div className="text-sm text-slate-500 mb-1">Recovery Rate</div>
                                <div className="text-amber-400 font-semibold">20-50% (varies)</div>
                            </div>
                        </div>
                        <button className="mt-4 text-blue-400 hover:text-blue-300 text-sm">
                            Plan Analysis Tools →
                        </button>
                    </div>

                    {/* Chapter 13 */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4">Chapter 13 - Individual Repayment</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Individual debtors repay debts over 3-5 year plan based on disposable income.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800 rounded-lg p-4">
                                <div className="text-sm text-slate-500 mb-1">Typical Duration</div>
                                <div className="text-white font-semibold">3-5 years</div>
                            </div>
                            <div className="bg-slate-800 rounded-lg p-4">
                                <div className="text-sm text-slate-500 mb-1">Recovery Rate</div>
                                <div className="text-emerald-400 font-semibold">25-100% (plan varies)</div>
                            </div>
                        </div>
                        <button className="mt-4 text-blue-400 hover:text-blue-300 text-sm">
                            Payment Plan Analyzer →
                        </button>
                    </div>
                </div>
            )}

            {/* Proof of Claim Modal */}
            <Modal isOpen={showProofOfClaimModal} onClose={() => setShowProofOfClaimModal(false)} title="Generate Proof of Claim (Form 410)">
                <div className="space-y-4">
                    <p className="text-sm text-slate-400">
                        This will generate a completed Proof of Claim form with your judgment information pre-filled.
                    </p>

                    <div className="bg-slate-800 rounded-lg p-4">
                        <div className="text-sm text-slate-500 mb-1">Case Information</div>
                        <div className="text-white font-medium">{caseConfig.caseNumber}</div>
                    </div>

                    <div className="bg-slate-800 rounded-lg p-4">
                        <div className="text-sm text-slate-500 mb-1">Claim Amount</div>
                        <div className="text-emerald-400 font-bold text-xl">
                            {formatCurrency(caseConfig.judgmentAmount + calculateInterest() + 15000)}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowProofOfClaimModal(false)}
                            className="flex-1 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" />
                            Generate Form 410
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Adversary Modal */}
            <Modal isOpen={showAdversaryModal} onClose={() => setShowAdversaryModal(false)} title="Adversary Proceeding Complaint">
                <div className="space-y-4">
                    <p className="text-sm text-slate-400">
                        Generate a complaint for a non-dischargeability adversary proceeding.
                    </p>

                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Select Grounds</label>
                        <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                            <option value="">Select §523 basis...</option>
                            <option value="523a2">§523(a)(2) - Fraud</option>
                            <option value="523a4">§523(a)(4) - Embezzlement/Fiduciary</option>
                            <option value="523a6">§523(a)(6) - Willful/Malicious</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Factual Basis</label>
                        <textarea
                            rows={4}
                            placeholder="Describe the facts supporting non-dischargeability..."
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowAdversaryModal(false)}
                            className="flex-1 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg">
                            Generate Complaint
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
