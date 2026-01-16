'use client';

import { useState, useMemo } from 'react';
import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import { Modal } from '@/components/ui/Modal';
import {
    Calendar,
    Clock,
    FileText,
    User,
    Users,
    Plus,
    CheckCircle,
    Circle,
    AlertTriangle,
    MessageSquare,
    ClipboardList,
    BookOpen,
    MapPin,
    Phone,
    ChevronRight,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    FileQuestion,
    Scale,
    Building2,
    Landmark,
    CreditCard,
    Briefcase,
    Car,
    Home
} from 'lucide-react';
import { Jurisdiction } from '@/lib/types';

// Examination types
interface Examination {
    id: string;
    debtorName: string;
    jurisdiction: Jurisdiction;
    date: string;
    time: string;
    location: string;
    courtReporter?: string;
    status: 'scheduled' | 'completed' | 'rescheduled' | 'cancelled' | 'no_show';
    representative?: string;
    notes: string;
    topicsCompleted: string[];
    documentsProduced: string[];
    findings: Finding[];
    createdAt: string;
}

interface Finding {
    id: string;
    category: 'asset' | 'income' | 'transfer' | 'discrepancy' | 'lead';
    description: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    actionable: boolean;
}

// Form 1.977 required topics
const EXAMINATION_TOPICS = [
    { id: 'employment', label: 'Current Employment & Income', icon: Briefcase, category: 'income' },
    { id: 'other_income', label: 'Other Sources of Income', icon: CreditCard, category: 'income' },
    { id: 'real_property', label: 'Real Property Owned', icon: Home, category: 'assets' },
    { id: 'bank_accounts', label: 'Bank Accounts', icon: Landmark, category: 'assets' },
    { id: 'vehicles', label: 'Vehicles & Personal Property', icon: Car, category: 'assets' },
    { id: 'business_interests', label: 'Business Interests', icon: Building2, category: 'assets' },
    { id: 'receivables', label: 'Accounts Receivable / Money Owed', icon: FileText, category: 'assets' },
    { id: 'transfers', label: 'Asset Transfers (Past 5 Years)', icon: AlertTriangle, category: 'transfers' },
    { id: 'judgments', label: 'Other Judgments & Liens', icon: Scale, category: 'liabilities' },
    { id: 'safe_deposit', label: 'Safe Deposit Boxes', icon: Briefcase, category: 'assets' },
    { id: 'trusts', label: 'Trusts & Beneficial Interests', icon: FileQuestion, category: 'assets' },
    { id: 'insurance', label: 'Insurance Policies (Cash Value)', icon: FileText, category: 'assets' },
];

// Form 1.977 required documents
const REQUIRED_DOCUMENTS = [
    { id: 'tax_returns', label: 'Tax Returns (Last 3 Years)', required: true },
    { id: 'bank_statements', label: 'Bank Statements (Last 12 Months)', required: true },
    { id: 'pay_stubs', label: 'Pay Stubs / Income Records', required: true },
    { id: 'deeds', label: 'Property Deeds', required: true },
    { id: 'vehicle_titles', label: 'Vehicle Titles & Registrations', required: true },
    { id: 'business_records', label: 'Business Formation Documents', required: false },
    { id: 'financial_statements', label: 'Financial Statements', required: false },
    { id: 'loan_docs', label: 'Loan Documents', required: false },
    { id: 'insurance_policies', label: 'Insurance Policy Declarations', required: false },
    { id: 'safe_deposit_records', label: 'Safe Deposit Box Records', required: false },
];

const statusColors: Record<Examination['status'], { bg: string; text: string; label: string }> = {
    scheduled: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Scheduled' },
    completed: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Completed' },
    rescheduled: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Rescheduled' },
    cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Cancelled' },
    no_show: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'No Show' },
};

// Seed examination data
const seedExaminations: Examination[] = [
    {
        id: 'exam1',
        debtorName: 'Management Services Holdings, LLC',
        jurisdiction: 'FL',
        date: '2026-02-15',
        time: '10:00 AM',
        location: 'Brevard County Courthouse, Room 3B',
        courtReporter: 'Veritext Legal Solutions',
        status: 'scheduled',
        representative: 'Corporate Representative TBD',
        notes: 'Initial Form 1.977 examination. Focus on identifying all bank accounts and recent asset transfers.',
        topicsCompleted: [],
        documentsProduced: [],
        findings: [],
        createdAt: new Date().toISOString()
    },
    {
        id: 'exam2',
        debtorName: 'MSH Properties, LLC (Transferee)',
        jurisdiction: 'TN',
        date: '2026-03-01',
        time: '2:00 PM',
        location: 'Davidson County Chancery Court',
        status: 'scheduled',
        notes: 'Examine regarding suspicious $1 transfer of 321 Warehouse Lane property.',
        topicsCompleted: [],
        documentsProduced: [],
        findings: [],
        createdAt: new Date().toISOString()
    }
];

export default function ExaminationPage() {
    const { assetIntelligence } = useData();
    const [examinations, setExaminations] = useState<Examination[]>(seedExaminations);
    const [selectedExam, setSelectedExam] = useState<Examination | null>(null);
    const [showNewExamModal, setShowNewExamModal] = useState(false);
    const [showExamDetailModal, setShowExamDetailModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'schedule' | 'topics' | 'documents' | 'findings'>('schedule');
    const [filterStatus, setFilterStatus] = useState<Examination['status'] | 'all'>('all');

    const filteredExams = useMemo(() => {
        if (filterStatus === 'all') return examinations;
        return examinations.filter(e => e.status === filterStatus);
    }, [examinations, filterStatus]);

    const upcomingExams = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return examinations.filter(e => e.date >= today && e.status === 'scheduled').length;
    }, [examinations]);

    const completedExams = useMemo(() => {
        return examinations.filter(e => e.status === 'completed').length;
    }, [examinations]);

    const handleToggleTopic = (examId: string, topicId: string) => {
        setExaminations(prev => prev.map(exam => {
            if (exam.id !== examId) return exam;
            const topics = exam.topicsCompleted.includes(topicId)
                ? exam.topicsCompleted.filter(t => t !== topicId)
                : [...exam.topicsCompleted, topicId];
            return { ...exam, topicsCompleted: topics };
        }));
    };

    const handleToggleDocument = (examId: string, docId: string) => {
        setExaminations(prev => prev.map(exam => {
            if (exam.id !== examId) return exam;
            const docs = exam.documentsProduced.includes(docId)
                ? exam.documentsProduced.filter(d => d !== docId)
                : [...exam.documentsProduced, docId];
            return { ...exam, documentsProduced: docs };
        }));
    };

    const handleAddFinding = (examId: string, finding: Omit<Finding, 'id'>) => {
        setExaminations(prev => prev.map(exam => {
            if (exam.id !== examId) return exam;
            return {
                ...exam,
                findings: [...exam.findings, { ...finding, id: `f${Date.now()}` }]
            };
        }));
    };

    const handleUpdateStatus = (examId: string, status: Examination['status']) => {
        setExaminations(prev => prev.map(exam =>
            exam.id === examId ? { ...exam, status } : exam
        ));
    };

    const handleUpdateNotes = (examId: string, notes: string) => {
        setExaminations(prev => prev.map(exam =>
            exam.id === examId ? { ...exam, notes } : exam
        ));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <ClipboardList className="w-7 h-7 text-purple-400" />
                        Debtor Examination Module
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Florida Form 1.977 proceedings and discovery management
                    </p>
                </div>
                <button
                    onClick={() => setShowNewExamModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Schedule Examination
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="text-2xl font-bold text-white">{upcomingExams}</span>
                    </div>
                    <div className="text-xs text-slate-500">Upcoming</div>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-2xl font-bold text-emerald-400">{completedExams}</span>
                    </div>
                    <div className="text-xs text-slate-500">Completed</div>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        <span className="text-2xl font-bold text-white">{EXAMINATION_TOPICS.length}</span>
                    </div>
                    <div className="text-xs text-slate-500">Topics to Cover</div>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-purple-400" />
                        <span className="text-2xl font-bold text-white">{REQUIRED_DOCUMENTS.filter(d => d.required).length}</span>
                    </div>
                    <div className="text-xs text-slate-500">Required Docs</div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 bg-slate-900 border border-slate-700 rounded-xl p-1 mb-6">
                {[
                    { id: 'schedule', label: 'Schedule', icon: Calendar },
                    { id: 'topics', label: 'Topic Checklist', icon: BookOpen },
                    { id: 'documents', label: 'Documents', icon: FileText },
                    { id: 'findings', label: 'Findings', icon: Search }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
                <div className="space-y-4">
                    {/* Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-500" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Examinations</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="rescheduled">Rescheduled</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="no_show">No Show</option>
                        </select>
                    </div>

                    {/* Examination Cards */}
                    <div className="grid gap-4">
                        {filteredExams.map(exam => (
                            <div
                                key={exam.id}
                                className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all cursor-pointer"
                                onClick={() => {
                                    setSelectedExam(exam);
                                    setShowExamDetailModal(true);
                                }}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <JurisdictionBadge jurisdiction={exam.jurisdiction} size="lg" showFull />
                                        <div>
                                            <h3 className="text-white font-semibold">{exam.debtorName}</h3>
                                            {exam.representative && (
                                                <p className="text-sm text-slate-400 flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {exam.representative}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[exam.status].bg} ${statusColors[exam.status].text}`}>
                                        {statusColors[exam.status].label}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <Calendar className="w-4 h-4 text-slate-500" />
                                        {new Date(exam.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <Clock className="w-4 h-4 text-slate-500" />
                                        {exam.time}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <MapPin className="w-4 h-4 text-slate-500" />
                                        <span className="truncate">{exam.location}</span>
                                    </div>
                                </div>

                                {exam.notes && (
                                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">{exam.notes}</p>
                                )}

                                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-slate-500">
                                            {exam.topicsCompleted.length}/{EXAMINATION_TOPICS.length} topics
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {exam.documentsProduced.length}/{REQUIRED_DOCUMENTS.length} docs
                                        </span>
                                        {exam.findings.length > 0 && (
                                            <span className="text-xs text-amber-400">
                                                {exam.findings.length} finding{exam.findings.length !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-500" />
                                </div>
                            </div>
                        ))}

                        {filteredExams.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No examinations found</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Topics Tab */}
            {activeTab === 'topics' && (
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-amber-400" />
                            Form 1.977 Examination Topics
                        </h3>
                        <span className="text-sm text-slate-400">
                            Standard topics for debtor examination
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {EXAMINATION_TOPICS.map(topic => (
                            <div
                                key={topic.id}
                                className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg"
                            >
                                <topic.icon className="w-5 h-5 text-blue-400" />
                                <span className="text-white">{topic.label}</span>
                                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${topic.category === 'income' ? 'bg-emerald-500/20 text-emerald-400' :
                                        topic.category === 'assets' ? 'bg-blue-500/20 text-blue-400' :
                                            topic.category === 'transfers' ? 'bg-amber-500/20 text-amber-400' :
                                                'bg-slate-600/50 text-slate-400'
                                    }`}>
                                    {topic.category}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <p className="text-sm text-amber-400">
                            <strong>Tip:</strong> Select an examination from the Schedule tab to track which topics have been covered during that specific proceeding.
                        </p>
                    </div>
                </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-purple-400" />
                            Document Production Checklist
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {REQUIRED_DOCUMENTS.map(doc => (
                            <div
                                key={doc.id}
                                className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg"
                            >
                                <Circle className="w-5 h-5 text-slate-600" />
                                <span className="text-white flex-1">{doc.label}</span>
                                {doc.required ? (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                                        Required
                                    </span>
                                ) : (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-600/50 text-slate-400">
                                        Optional
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-sm text-blue-400">
                            <strong>Note:</strong> Track document production for each examination by clicking on the examination card in the Schedule tab.
                        </p>
                    </div>
                </div>
            )}

            {/* Findings Tab */}
            {activeTab === 'findings' && (
                <div className="space-y-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                            <Search className="w-5 h-5 text-emerald-400" />
                            Examination Findings & Asset Leads
                        </h3>

                        {examinations.some(e => e.findings.length > 0) ? (
                            <div className="space-y-4">
                                {examinations.filter(e => e.findings.length > 0).map(exam => (
                                    <div key={exam.id}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <JurisdictionBadge jurisdiction={exam.jurisdiction} />
                                            <span className="text-sm font-medium text-white">{exam.debtorName}</span>
                                            <span className="text-xs text-slate-500">
                                                {new Date(exam.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="space-y-2 ml-4">
                                            {exam.findings.map(finding => (
                                                <div
                                                    key={finding.id}
                                                    className={`p-3 rounded-lg border ${finding.priority === 'HIGH' ? 'bg-red-500/10 border-red-500/30' :
                                                            finding.priority === 'MEDIUM' ? 'bg-amber-500/10 border-amber-500/30' :
                                                                'bg-slate-800 border-slate-700'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${finding.category === 'asset' ? 'bg-blue-500/20 text-blue-400' :
                                                                finding.category === 'income' ? 'bg-emerald-500/20 text-emerald-400' :
                                                                    finding.category === 'transfer' ? 'bg-amber-500/20 text-amber-400' :
                                                                        finding.category === 'discrepancy' ? 'bg-red-500/20 text-red-400' :
                                                                            'bg-purple-500/20 text-purple-400'
                                                            }`}>
                                                            {finding.category}
                                                        </span>
                                                        {finding.actionable && (
                                                            <span className="text-xs text-emerald-400">• Actionable</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-300">{finding.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                <p>No findings recorded yet</p>
                                <p className="text-xs mt-1">Complete examinations and add findings to track asset leads</p>
                            </div>
                        )}
                    </div>

                    {/* Asset Intelligence Summary */}
                    {assetIntelligence && (
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                                <Building2 className="w-5 h-5 text-blue-400" />
                                Known Assets Summary
                            </h3>
                            <p className="text-sm text-slate-400 mb-4">
                                Reference during examination to identify undisclosed assets
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="p-3 bg-slate-800 rounded-lg text-center">
                                    <div className="text-xl font-bold text-white">{assetIntelligence.realProperty.length}</div>
                                    <div className="text-xs text-slate-500">Properties</div>
                                </div>
                                <div className="p-3 bg-slate-800 rounded-lg text-center">
                                    <div className="text-xl font-bold text-white">{assetIntelligence.bankAccounts.length}</div>
                                    <div className="text-xs text-slate-500">Bank Accounts</div>
                                </div>
                                <div className="p-3 bg-slate-800 rounded-lg text-center">
                                    <div className="text-xl font-bold text-white">{assetIntelligence.vehicles.length}</div>
                                    <div className="text-xs text-slate-500">Vehicles</div>
                                </div>
                                <div className="p-3 bg-slate-800 rounded-lg text-center">
                                    <div className="text-xl font-bold text-white">{assetIntelligence.businessInterests.length}</div>
                                    <div className="text-xs text-slate-500">Businesses</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* New Examination Modal */}
            <NewExaminationModal
                isOpen={showNewExamModal}
                onClose={() => setShowNewExamModal(false)}
                onSave={(exam) => {
                    setExaminations(prev => [...prev, { ...exam, id: `exam${Date.now()}`, createdAt: new Date().toISOString() }]);
                    setShowNewExamModal(false);
                }}
            />

            {/* Examination Detail Modal */}
            {selectedExam && (
                <ExaminationDetailModal
                    exam={selectedExam}
                    isOpen={showExamDetailModal}
                    onClose={() => {
                        setShowExamDetailModal(false);
                        setSelectedExam(null);
                    }}
                    onToggleTopic={(topicId) => handleToggleTopic(selectedExam.id, topicId)}
                    onToggleDocument={(docId) => handleToggleDocument(selectedExam.id, docId)}
                    onAddFinding={(finding) => handleAddFinding(selectedExam.id, finding)}
                    onUpdateStatus={(status) => handleUpdateStatus(selectedExam.id, status)}
                    onUpdateNotes={(notes) => handleUpdateNotes(selectedExam.id, notes)}
                />
            )}
        </div>
    );
}

// New Examination Modal
interface NewExaminationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (exam: Omit<Examination, 'id' | 'createdAt'>) => void;
}

function NewExaminationModal({ isOpen, onClose, onSave }: NewExaminationModalProps) {
    const [debtorName, setDebtorName] = useState('');
    const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('FL');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('10:00 AM');
    const [location, setLocation] = useState('');
    const [courtReporter, setCourtReporter] = useState('');
    const [representative, setRepresentative] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            debtorName,
            jurisdiction,
            date,
            time,
            location,
            courtReporter: courtReporter || undefined,
            representative: representative || undefined,
            notes,
            status: 'scheduled',
            topicsCompleted: [],
            documentsProduced: [],
            findings: []
        });
        // Reset form
        setDebtorName('');
        setDate('');
        setTime('10:00 AM');
        setLocation('');
        setCourtReporter('');
        setRepresentative('');
        setNotes('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Schedule New Examination">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Debtor / Entity Name *</label>
                    <input
                        type="text"
                        value={debtorName}
                        onChange={(e) => setDebtorName(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Management Services Holdings, LLC"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Jurisdiction *</label>
                        <select
                            value={jurisdiction}
                            onChange={(e) => setJurisdiction(e.target.value as Jurisdiction)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="FL">Florida</option>
                            <option value="TN">Tennessee</option>
                            <option value="IN">Indiana</option>
                            <option value="CO">Colorado</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Representative</label>
                        <input
                            type="text"
                            value={representative}
                            onChange={(e) => setRepresentative(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Corporate Representative"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Date *</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Time *</label>
                        <input
                            type="text"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="10:00 AM"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Location *</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Brevard County Courthouse, Room 3B"
                    />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Court Reporter</label>
                    <input
                        type="text"
                        value={courtReporter}
                        onChange={(e) => setCourtReporter(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Veritext Legal Solutions"
                    />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Notes / Goals</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Key areas to focus on, questions to ask..."
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                    >
                        Schedule
                    </button>
                </div>
            </form>
        </Modal>
    );
}

// Examination Detail Modal
interface ExaminationDetailModalProps {
    exam: Examination;
    isOpen: boolean;
    onClose: () => void;
    onToggleTopic: (topicId: string) => void;
    onToggleDocument: (docId: string) => void;
    onAddFinding: (finding: Omit<Finding, 'id'>) => void;
    onUpdateStatus: (status: Examination['status']) => void;
    onUpdateNotes: (notes: string) => void;
}

function ExaminationDetailModal({
    exam,
    isOpen,
    onClose,
    onToggleTopic,
    onToggleDocument,
    onAddFinding,
    onUpdateStatus,
    onUpdateNotes
}: ExaminationDetailModalProps) {
    const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'topics' | 'documents' | 'findings'>('overview');
    const [notes, setNotes] = useState(exam.notes);
    const [showAddFinding, setShowAddFinding] = useState(false);
    const [newFinding, setNewFinding] = useState<Omit<Finding, 'id'>>({
        category: 'asset',
        description: '',
        priority: 'MEDIUM',
        actionable: false
    });

    const handleSaveNotes = () => {
        onUpdateNotes(notes);
    };

    const handleAddFinding = () => {
        if (newFinding.description.trim()) {
            onAddFinding(newFinding);
            setNewFinding({ category: 'asset', description: '', priority: 'MEDIUM', actionable: false });
            setShowAddFinding(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={exam.debtorName} size="lg">
            <div className="space-y-4">
                {/* Header Info */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <JurisdictionBadge jurisdiction={exam.jurisdiction} showFull />
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[exam.status].bg} ${statusColors[exam.status].text}`}>
                            {statusColors[exam.status].label}
                        </span>
                    </div>
                    <select
                        value={exam.status}
                        onChange={(e) => onUpdateStatus(e.target.value as Examination['status'])}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
                    >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="rescheduled">Rescheduled</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no_show">No Show</option>
                    </select>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {new Date(exam.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                        <Clock className="w-4 h-4 text-slate-500" />
                        {exam.time}
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span className="truncate">{exam.location}</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
                    {['overview', 'topics', 'documents', 'findings'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveDetailTab(tab as typeof activeDetailTab)}
                            className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors capitalize ${activeDetailTab === tab
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[300px]">
                    {activeDetailTab === 'overview' && (
                        <div className="space-y-4">
                            {exam.representative && (
                                <div>
                                    <label className="text-xs text-slate-500">Representative</label>
                                    <p className="text-white">{exam.representative}</p>
                                </div>
                            )}
                            {exam.courtReporter && (
                                <div>
                                    <label className="text-xs text-slate-500">Court Reporter</label>
                                    <p className="text-white">{exam.courtReporter}</p>
                                </div>
                            )}
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    onBlur={handleSaveNotes}
                                    rows={4}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {activeDetailTab === 'topics' && (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {EXAMINATION_TOPICS.map(topic => (
                                <button
                                    key={topic.id}
                                    onClick={() => onToggleTopic(topic.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${exam.topicsCompleted.includes(topic.id)
                                            ? 'bg-emerald-500/20 border border-emerald-500/30'
                                            : 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                                        }`}
                                >
                                    {exam.topicsCompleted.includes(topic.id) ? (
                                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-slate-600" />
                                    )}
                                    <topic.icon className="w-4 h-4 text-slate-400" />
                                    <span className="text-white text-sm">{topic.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {activeDetailTab === 'documents' && (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {REQUIRED_DOCUMENTS.map(doc => (
                                <button
                                    key={doc.id}
                                    onClick={() => onToggleDocument(doc.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${exam.documentsProduced.includes(doc.id)
                                            ? 'bg-emerald-500/20 border border-emerald-500/30'
                                            : 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                                        }`}
                                >
                                    {exam.documentsProduced.includes(doc.id) ? (
                                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-slate-600" />
                                    )}
                                    <span className="text-white text-sm flex-1">{doc.label}</span>
                                    {doc.required && !exam.documentsProduced.includes(doc.id) && (
                                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {activeDetailTab === 'findings' && (
                        <div className="space-y-3">
                            {exam.findings.map(finding => (
                                <div
                                    key={finding.id}
                                    className={`p-3 rounded-lg border ${finding.priority === 'HIGH' ? 'bg-red-500/10 border-red-500/30' :
                                            finding.priority === 'MEDIUM' ? 'bg-amber-500/10 border-amber-500/30' :
                                                'bg-slate-800 border-slate-700'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 capitalize">
                                            {finding.category}
                                        </span>
                                        <span className="text-xs text-slate-500 capitalize">{finding.priority}</span>
                                        {finding.actionable && (
                                            <span className="text-xs text-emerald-400">• Actionable</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-300">{finding.description}</p>
                                </div>
                            ))}

                            {!showAddFinding ? (
                                <button
                                    onClick={() => setShowAddFinding(true)}
                                    className="w-full p-3 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Finding
                                </button>
                            ) : (
                                <div className="p-4 bg-slate-800 rounded-lg space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <select
                                            value={newFinding.category}
                                            onChange={(e) => setNewFinding({ ...newFinding, category: e.target.value as Finding['category'] })}
                                            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                                        >
                                            <option value="asset">Asset</option>
                                            <option value="income">Income</option>
                                            <option value="transfer">Transfer</option>
                                            <option value="discrepancy">Discrepancy</option>
                                            <option value="lead">Lead</option>
                                        </select>
                                        <select
                                            value={newFinding.priority}
                                            onChange={(e) => setNewFinding({ ...newFinding, priority: e.target.value as Finding['priority'] })}
                                            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                                        >
                                            <option value="HIGH">High</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="LOW">Low</option>
                                        </select>
                                    </div>
                                    <textarea
                                        value={newFinding.description}
                                        onChange={(e) => setNewFinding({ ...newFinding, description: e.target.value })}
                                        placeholder="Describe the finding..."
                                        rows={2}
                                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm resize-none"
                                    />
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 text-sm text-slate-300">
                                            <input
                                                type="checkbox"
                                                checked={newFinding.actionable}
                                                onChange={(e) => setNewFinding({ ...newFinding, actionable: e.target.checked })}
                                                className="rounded"
                                            />
                                            Actionable
                                        </label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setShowAddFinding(false)}
                                                className="px-3 py-1 text-sm text-slate-400 hover:text-white"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleAddFinding}
                                                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="pt-4 border-t border-slate-700">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}
