'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { Modal } from '@/components/ui/Modal';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import {
    Users, Calendar, FileText, Clock, CheckCircle, Plus,
    ChevronRight, Search, MessageSquare, AlertTriangle
} from 'lucide-react';

const seedExaminations = [
    {
        id: '1',
        debtorName: 'John McClung',
        relationship: 'Principal',
        jurisdiction: 'TN' as const,
        date: '2025-02-15',
        time: '10:00 AM',
        location: 'Davidson County Courthouse',
        status: 'scheduled' as const,
        notes: 'Focus on bank accounts and business interests',
    },
    {
        id: '2',
        debtorName: 'MSH Representative',
        relationship: 'Corporate Rep',
        jurisdiction: 'FL' as const,
        date: '2025-01-28',
        time: '2:00 PM',
        location: 'Brevard County Courthouse',
        status: 'completed' as const,
        notes: 'Confirmed real property ownership',
    },
];

const EXAM_TOPICS = [
    'Employment and income sources',
    'Bank accounts and financial institutions',
    'Real property holdings',
    'Vehicle ownership',
    'Business interests and investments',
    'Accounts receivable',
    'Life insurance policies',
    'Recent asset transfers',
];

export default function ExaminationPage() {
    const [showNewExamModal, setShowNewExamModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'scheduled' | 'completed'>('scheduled');

    const scheduledExams = seedExaminations.filter(e => e.status === 'scheduled');
    const completedExams = seedExaminations.filter(e => e.status === 'completed');

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#23313E] flex items-center gap-3">
                            <Users className="w-8 h-8 text-[#C7A252]" />
                            Debtor Examination
                        </h1>
                        <p className="text-[#5a6a7a] mt-1">Schedule and track Rule 1.977 examinations</p>
                    </div>
                    <button
                        onClick={() => setShowNewExamModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#C7A252] hover:bg-[#a88b43] text-[#23313E] rounded-lg font-medium transition-all shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Schedule Examination
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#C7A252]">{scheduledExams.length}</div>
                        <div className="text-sm text-[#8a95a3]">Scheduled</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#22C55E]">{completedExams.length}</div>
                        <div className="text-sm text-[#8a95a3]">Completed</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#3B82F6]">{EXAM_TOPICS.length}</div>
                        <div className="text-sm text-[#8a95a3]">Standard Topics</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#8B5CF6]">4</div>
                        <div className="text-sm text-[#8a95a3]">Jurisdictions</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-white border border-[#E5E7EB] rounded-xl p-1 shadow-sm">
                    <button
                        onClick={() => setActiveTab('scheduled')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${activeTab === 'scheduled'
                                ? 'bg-[#C7A252] text-[#23313E] shadow-sm'
                                : 'text-[#5a6a7a] hover:bg-[#F8F9FA]'
                            }`}
                    >
                        <Calendar className="w-4 h-4" />
                        Scheduled ({scheduledExams.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${activeTab === 'completed'
                                ? 'bg-[#C7A252] text-[#23313E] shadow-sm'
                                : 'text-[#5a6a7a] hover:bg-[#F8F9FA]'
                            }`}
                    >
                        <CheckCircle className="w-4 h-4" />
                        Completed ({completedExams.length})
                    </button>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {(activeTab === 'scheduled' ? scheduledExams : completedExams).map((exam) => (
                            <div key={exam.id} className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm hover:border-[#C7A252] transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#C7A252]/15 rounded-xl flex items-center justify-center">
                                            <Users className="w-6 h-6 text-[#C7A252]" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[#23313E]">{exam.debtorName}</h3>
                                            <p className="text-sm text-[#5a6a7a]">{exam.relationship}</p>
                                        </div>
                                    </div>
                                    <JurisdictionBadge jurisdiction={exam.jurisdiction} />
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-[#5a6a7a]">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(exam.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2 text-[#5a6a7a]">
                                        <Clock className="w-4 h-4" />
                                        {exam.time}
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-[#F8F9FA] rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <MessageSquare className="w-4 h-4 text-[#8a95a3] mt-0.5" />
                                        <span className="text-sm text-[#5a6a7a]">{exam.notes}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E5E7EB]">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${exam.status === 'scheduled' ? 'bg-[#C7A252]/20 text-[#C7A252]' : 'bg-emerald-100 text-emerald-700'
                                        }`}>{exam.status}</span>
                                    <span className="text-[#C7A252] text-sm font-medium flex items-center gap-1 cursor-pointer hover:underline">
                                        View Details <ChevronRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Topics Sidebar */}
                    <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden h-fit">
                        <div className="px-6 py-4 border-b border-[#E5E7EB]">
                            <h3 className="font-semibold text-[#23313E]">Examination Topics</h3>
                        </div>
                        <div className="p-4 space-y-2">
                            {EXAM_TOPICS.map((topic, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 hover:bg-[#F8F9FA] rounded-lg transition-colors">
                                    <div className="w-6 h-6 bg-[#F8F9FA] rounded-full flex items-center justify-center text-xs font-medium text-[#5a6a7a]">
                                        {i + 1}
                                    </div>
                                    <span className="text-sm text-[#23313E]">{topic}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* New Exam Modal */}
                <Modal isOpen={showNewExamModal} onClose={() => setShowNewExamModal(false)} title="Schedule Examination">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#23313E] mb-2">Deponent Name</label>
                            <input
                                type="text"
                                placeholder="Full name"
                                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E] focus:border-[#C7A252]"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#23313E] mb-2">Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E] focus:border-[#C7A252]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#23313E] mb-2">Time</label>
                                <input
                                    type="time"
                                    className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E] focus:border-[#C7A252]"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#23313E] mb-2">Jurisdiction</label>
                            <select className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E] focus:border-[#C7A252]">
                                <option value="FL">Florida</option>
                                <option value="TN">Tennessee</option>
                                <option value="IN">Indiana</option>
                                <option value="CO">Colorado</option>
                            </select>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => setShowNewExamModal(false)}
                                className="flex-1 px-4 py-2.5 bg-[#F8F9FA] text-[#5a6a7a] rounded-lg font-medium hover:bg-[#E5E7EB] transition-colors"
                            >
                                Cancel
                            </button>
                            <button className="flex-1 px-4 py-2.5 bg-[#C7A252] text-[#23313E] rounded-lg font-medium hover:bg-[#a88b43] transition-colors">
                                Schedule
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
