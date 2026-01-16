'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import {
    FileText, Download, BarChart3, PieChart, TrendingUp, Calendar,
    DollarSign, Target, CheckCircle
} from 'lucide-react';

export default function ReportsPage() {
    const {
        tasks, caseConfig, calculateInterest, getAmountCollected,
        enforcementActions, getRecoveryProbability
    } = useData();
    const [selectedReport, setSelectedReport] = useState<string>('summary');

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

    const totalDue = caseConfig.judgmentAmount + calculateInterest();
    const collectionRate = totalDue > 0 ? ((getAmountCollected / totalDue) * 100).toFixed(1) : 0;

    const reports = [
        { id: 'summary', name: 'Case Summary', icon: FileText },
        { id: 'financial', name: 'Financial Report', icon: DollarSign },
        { id: 'enforcement', name: 'Enforcement Activity', icon: Target },
        { id: 'timeline', name: 'Timeline Report', icon: Calendar },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#23313E] flex items-center gap-3">
                            <BarChart3 className="w-8 h-8 text-[#C7A252]" />
                            Reports & Analytics
                        </h1>
                        <p className="text-[#5a6a7a] mt-1">Generate and export case reports</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#C7A252] hover:bg-[#a88b43] text-[#23313E] rounded-lg font-medium transition-all shadow-sm">
                        <Download className="w-4 h-4" />
                        Export PDF
                    </button>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#23313E]">{formatCurrency(totalDue)}</div>
                        <div className="text-sm text-[#8a95a3]">Total Due</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#22C55E]">{formatCurrency(getAmountCollected)}</div>
                        <div className="text-sm text-[#8a95a3]">Collected ({collectionRate}%)</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#C7A252]">{getRecoveryProbability}%</div>
                        <div className="text-sm text-[#8a95a3]">Recovery Probability</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#3B82F6]">{enforcementActions.length}</div>
                        <div className="text-sm text-[#8a95a3]">Enforcement Actions</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Report Selector */}
                    <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden h-fit">
                        <div className="px-6 py-4 border-b border-[#E5E7EB]">
                            <h3 className="font-semibold text-[#23313E]">Report Types</h3>
                        </div>
                        <div className="p-2">
                            {reports.map((report) => (
                                <button
                                    key={report.id}
                                    onClick={() => setSelectedReport(report.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${selectedReport === report.id
                                        ? 'bg-[#C7A252]/20 text-[#C7A252]'
                                        : 'hover:bg-[#F8F9FA] text-[#23313E]'
                                        }`}
                                >
                                    <report.icon className="w-5 h-5" />
                                    <span className="font-medium">{report.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Report Content */}
                    <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                            <h3 className="font-semibold text-[#23313E]">
                                {reports.find(r => r.id === selectedReport)?.name}
                            </h3>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 text-sm bg-[#F8F9FA] text-[#5a6a7a] rounded-lg hover:bg-[#E5E7EB]">
                                    CSV
                                </button>
                                <button className="px-3 py-1.5 text-sm bg-[#F8F9FA] text-[#5a6a7a] rounded-lg hover:bg-[#E5E7EB]">
                                    PDF
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {selectedReport === 'summary' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-sm font-medium text-[#8a95a3] uppercase tracking-wide mb-3">Case Information</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                                                    <span className="text-[#5a6a7a]">Case Number</span>
                                                    <span className="text-[#23313E] font-mono">{caseConfig.caseNumber}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                                                    <span className="text-[#5a6a7a]">Judgment Date</span>
                                                    <span className="text-[#23313E]">{new Date(caseConfig.judgmentDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                                                    <span className="text-[#5a6a7a]">Interest Rate</span>
                                                    <span className="text-[#23313E]">{caseConfig.interestRate}%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-[#8a95a3] uppercase tracking-wide mb-3">Financial Summary</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                                                    <span className="text-[#5a6a7a]">Principal</span>
                                                    <span className="text-[#23313E]">{formatCurrency(caseConfig.judgmentAmount)}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                                                    <span className="text-[#5a6a7a]">Accrued Interest</span>
                                                    <span className="text-[#C7A252]">{formatCurrency(calculateInterest())}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                                                    <span className="text-[#5a6a7a] font-semibold">Total Due</span>
                                                    <span className="text-[#23313E] font-bold">{formatCurrency(totalDue)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-[#8a95a3] uppercase tracking-wide mb-3">Task Status</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="p-4 bg-[#F8F9FA] rounded-xl text-center">
                                                <div className="text-2xl font-bold text-gray-600">
                                                    {tasks.filter(t => t.status === 'BACKLOG' || t.status === 'THIS_WEEK').length}
                                                </div>
                                                <div className="text-sm text-[#8a95a3]">Backlog</div>
                                            </div>
                                            <div className="p-4 bg-[#C7A252]/15 rounded-xl text-center">
                                                <div className="text-2xl font-bold text-[#C7A252]">
                                                    {tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'WAITING').length}
                                                </div>
                                                <div className="text-sm text-[#8a95a3]">In Progress</div>
                                            </div>
                                            <div className="p-4 bg-emerald-50 rounded-xl text-center">
                                                <div className="text-2xl font-bold text-emerald-600">
                                                    {tasks.filter(t => t.status === 'DONE').length}
                                                </div>
                                                <div className="text-sm text-[#8a95a3]">Completed</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedReport === 'financial' && (
                                <div className="text-center py-8">
                                    <PieChart className="w-16 h-16 text-[#8a95a3] mx-auto mb-4" />
                                    <h4 className="text-lg font-semibold text-[#23313E] mb-2">Financial Report</h4>
                                    <p className="text-[#5a6a7a]">Detailed financial breakdown and collection history</p>
                                </div>
                            )}

                            {selectedReport === 'enforcement' && (
                                <div className="text-center py-8">
                                    <Target className="w-16 h-16 text-[#8a95a3] mx-auto mb-4" />
                                    <h4 className="text-lg font-semibold text-[#23313E] mb-2">Enforcement Activity</h4>
                                    <p className="text-[#5a6a7a]">Summary of all enforcement actions and results</p>
                                </div>
                            )}

                            {selectedReport === 'timeline' && (
                                <div className="text-center py-8">
                                    <Calendar className="w-16 h-16 text-[#8a95a3] mx-auto mb-4" />
                                    <h4 className="text-lg font-semibold text-[#23313E] mb-2">Timeline Report</h4>
                                    <p className="text-[#5a6a7a]">Chronological case history and milestones</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
