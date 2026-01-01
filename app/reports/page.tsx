'use client';

import { useMemo } from 'react';
import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import { generateClientReport, generateTasksReport } from '@/lib/pdf-export';
import { FileText, Download, Share, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function ReportsPage() {
    const { tasks, files, counsel, settlements, caseConfig, calculateInterest, getJurisdictionStats } = useData();

    const interest = useMemo(() => calculateInterest(), [calculateInterest]);
    const jurisdictionStats = getJurisdictionStats();

    const openTasks = tasks.filter(t => t.status !== 'DONE').length;
    const thisWeekTasks = tasks.filter(t => t.status === 'THIS_WEEK').length;
    const doneTasks = tasks.filter(t => t.status === 'DONE').length;
    const completionRate = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;

    const bestOffer = settlements.length > 0
        ? Math.max(...settlements.filter(s => s.status !== 'Rejected').map(s => s.amount))
        : 0;

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const handleExportTasks = () => {
        const data = tasks.map(t => ({
            Title: t.title,
            Status: t.status,
            Priority: t.priority || 'MEDIUM',
            Jurisdiction: t.jurisdiction || 'N/A',
            Category: t.category,
            DueDate: t.dueDate || 'N/A',
            AssignedCounsel: counsel.find(c => c.id === t.assignedCounselId)?.name || 'Unassigned'
        }));
        downloadCSV(data, 'tasks_export.csv');
    };

    const handleExportCounsel = () => {
        const data = counsel.map(c => ({
            Name: c.name,
            Firm: c.firm,
            State: c.state,
            Email: c.email,
            Phone: c.phone || 'N/A',
            Status: c.status,
            TasksAssigned: c.tasksAssigned.length,
            LastContact: c.lastContact
        }));
        downloadCSV(data, 'counsel_export.csv');
    };

    const handleExportSettlements = () => {
        const data = settlements.map(s => ({
            Date: s.date,
            Party: s.party,
            Amount: s.amount,
            Terms: s.terms,
            Status: s.status,
            CounterAmount: s.counterAmount || 'N/A',
            Notes: s.notes || ''
        }));
        downloadCSV(data, 'settlements_export.csv');
    };

    const downloadCSV = (data: Record<string, unknown>[], filename: string) => {
        if (data.length === 0) {
            alert('No data to export');
            return;
        }
        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => headers.map(h => `"${row[h]}"`).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    };

    const handleGeneratePDF = () => {
        generateClientReport({
            caseConfig,
            interest,
            tasks,
            counsel,
            settlements,
            jurisdictionStats
        });
    };

    const handleGenerateTasksPDF = () => {
        generateTasksReport(tasks);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-white mb-6">Reports & Exports</h1>

            {/* Executive Summary Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 mb-8">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Executive Summary
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    <div>
                        <p className="text-slate-400 text-sm">Total Judgment</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(caseConfig.judgmentAmount)}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Interest to Date</p>
                        <p className="text-2xl font-bold text-amber-400">+{formatCurrency(interest)}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Best Offer</p>
                        <p className="text-2xl font-bold text-emerald-400">{formatCurrency(bestOffer)}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Completion</p>
                        <p className="text-2xl font-bold text-blue-400">{completionRate}%</p>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    {jurisdictionStats.map(j => (
                        <div key={j.jurisdiction} className="flex items-center gap-2">
                            <JurisdictionBadge jurisdiction={j.jurisdiction} size="sm" />
                            <span className={`w-3 h-3 rounded-full ${j.openTasks === 0 ? 'bg-emerald-500' : j.phase === 'Active' ? 'bg-amber-500' : 'bg-slate-500'}`} />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <div>
                            <p className="text-white font-medium">{doneTasks}</p>
                            <p className="text-slate-400 text-xs">Completed</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-400" />
                        <div>
                            <p className="text-white font-medium">{thisWeekTasks}</p>
                            <p className="text-slate-400 text-xs">This Week</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        <div>
                            <p className="text-white font-medium">{openTasks}</p>
                            <p className="text-slate-400 text-xs">Open Tasks</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Export Options */}
            <h2 className="text-lg font-semibold text-white mb-4">Export Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                    onClick={handleExportTasks}
                    className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition-colors text-left group"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Download className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-medium">Tasks CSV</h3>
                            <p className="text-slate-500 text-sm">Export all tasks with status, deadlines</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={handleGenerateTasksPDF}
                    className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition-colors text-left group"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-medium">Tasks PDF</h3>
                            <p className="text-slate-500 text-sm">Formatted PDF task report</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={handleExportCounsel}
                    className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition-colors text-left group"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Download className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-medium">Counsel Export</h3>
                            <p className="text-slate-500 text-sm">CSV with counsel directory</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={handleExportSettlements}
                    className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition-colors text-left group"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <Download className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-medium">Settlement History</h3>
                            <p className="text-slate-500 text-sm">CSV with all offers & status</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={handleGeneratePDF}
                    className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-red-500/50 transition-colors text-left group"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-medium">Client Status Report (PDF)</h3>
                            <p className="text-slate-500 text-sm">Professional PDF with charts</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => {
                        const url = window.location.origin;
                        navigator.clipboard.writeText(url);
                        alert('Dashboard URL copied to clipboard!');
                    }}
                    className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition-colors text-left group"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                            <Share className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-medium">Share Dashboard</h3>
                            <p className="text-slate-500 text-sm">Copy shareable link</p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}
