'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import { Modal } from '@/components/ui/Modal';
import { EmailLog, EmailType, Jurisdiction } from '@/lib/types';

const emailTypeColors: Record<EmailType, { bg: string; text: string }> = {
    CLIENT: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    OPPOSING_COUNSEL: { bg: 'bg-red-500/20', text: 'text-red-400' },
    COURT: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
    VENDOR: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
    OTHER: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
};

export default function EmailsPage() {
    const { emails, tasks, files, addEmail } = useData();
    const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);
    const [jurisdictionFilter, setJurisdictionFilter] = useState<Jurisdiction | 'ALL'>('ALL');
    const [typeFilter, setTypeFilter] = useState<EmailType | 'ALL'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewEmailModal, setShowNewEmailModal] = useState(false);

    // Filter emails
    const filteredEmails = emails.filter(e => {
        const matchesJurisdiction = jurisdictionFilter === 'ALL' || e.jurisdiction === jurisdictionFilter;
        const matchesType = typeFilter === 'ALL' || e.type === typeFilter;
        const matchesSearch = !searchTerm ||
            e.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.from.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesJurisdiction && matchesType && matchesSearch;
    });

    const getLinkedItems = (email: EmailLog) => {
        const linkedTasks = tasks.filter(t => email.linkedTaskIds?.includes(t.id));
        const linkedFiles = files.filter(f => email.linkedFileIds?.includes(f.id));
        return { linkedTasks, linkedFiles };
    };

    const emailTypes: EmailType[] = ['CLIENT', 'OPPOSING_COUNSEL', 'COURT', 'VENDOR', 'OTHER'];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Email Log</h1>
                    <p className="text-slate-400 mt-1">Track case-related correspondence</p>
                </div>

                <button
                    onClick={() => setShowNewEmailModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Log Email
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="relative flex-1 min-w-[200px]">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search emails..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <select
                    value={jurisdictionFilter}
                    onChange={(e) => setJurisdictionFilter(e.target.value as Jurisdiction | 'ALL')}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="ALL">All Jurisdictions</option>
                    <option value="FL">Florida</option>
                    <option value="TN">Tennessee</option>
                    <option value="IN">Indiana</option>
                    <option value="CO">Colorado</option>
                </select>

                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as EmailType | 'ALL')}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="ALL">All Types</option>
                    {emailTypes.map(t => (
                        <option key={t} value={t}>{t.replace('_', ' ')}</option>
                    ))}
                </select>
            </div>

            {/* Email Table */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-800/50">
                        <tr>
                            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Subject</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">From</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Date</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Type</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Links</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filteredEmails.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                    No emails found
                                </td>
                            </tr>
                        ) : (
                            filteredEmails.map((email) => {
                                const { linkedTasks, linkedFiles } = getLinkedItems(email);
                                const totalLinks = linkedTasks.length + linkedFiles.length;
                                const typeColor = emailTypeColors[email.type];

                                return (
                                    <tr
                                        key={email.id}
                                        onClick={() => setSelectedEmail(email)}
                                        className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-medium">{email.subject}</span>
                                                {email.jurisdiction && (
                                                    <JurisdictionBadge jurisdiction={email.jurisdiction} size="sm" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-slate-400 text-sm">{email.from}</td>
                                        <td className="px-4 py-4 text-slate-400 text-sm">
                                            {new Date(email.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`${typeColor.bg} ${typeColor.text} text-xs px-2 py-1 rounded`}>
                                                {email.type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            {totalLinks > 0 && (
                                                <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded">
                                                    {totalLinks} link{totalLinks !== 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Email Detail Drawer */}
            {selectedEmail && (
                <EmailDrawer
                    email={selectedEmail}
                    onClose={() => setSelectedEmail(null)}
                    linkedTasks={getLinkedItems(selectedEmail).linkedTasks}
                    linkedFiles={getLinkedItems(selectedEmail).linkedFiles}
                />
            )}

            {/* New Email Modal */}
            <NewEmailModal
                isOpen={showNewEmailModal}
                onClose={() => setShowNewEmailModal(false)}
                onSave={(email) => {
                    addEmail(email);
                    setShowNewEmailModal(false);
                }}
            />
        </div>
    );
}

interface EmailDrawerProps {
    email: EmailLog;
    onClose: () => void;
    linkedTasks: { id: string; title: string }[];
    linkedFiles: { id: string; title: string }[];
}

function EmailDrawer({ email, onClose, linkedTasks, linkedFiles }: EmailDrawerProps) {
    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-slate-900 border-l border-slate-700 h-full overflow-y-auto animate-in slide-in-from-right duration-200">
                {/* Header */}
                <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Email Details</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{email.subject}</h3>
                        <div className="flex items-center gap-2">
                            {email.jurisdiction && <JurisdictionBadge jurisdiction={email.jurisdiction} />}
                            <span className={`${emailTypeColors[email.type].bg} ${emailTypeColors[email.type].text} text-sm px-2 py-1 rounded`}>
                                {email.type.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-slate-400">From</span>
                            <span className="text-white">{email.from}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">To</span>
                            <span className="text-white">{email.to}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Date</span>
                            <span className="text-white">{new Date(email.date).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-2">Summary</h4>
                        <p className="text-white bg-slate-800 rounded-lg p-4">{email.summary}</p>
                    </div>

                    {linkedTasks.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-2">
                                Linked Tasks ({linkedTasks.length})
                            </h4>
                            <div className="space-y-2">
                                {linkedTasks.map(task => (
                                    <div key={task.id} className="bg-slate-800 rounded-lg p-3 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        <span className="text-white text-sm">{task.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {linkedFiles.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-2">
                                Linked Files ({linkedFiles.length})
                            </h4>
                            <div className="space-y-2">
                                {linkedFiles.map(file => (
                                    <div key={file.id} className="bg-slate-800 rounded-lg p-3 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="text-white text-sm">{file.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

interface NewEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (email: Omit<EmailLog, 'id'>) => void;
}

function NewEmailModal({ isOpen, onClose, onSave }: NewEmailModalProps) {
    const [subject, setSubject] = useState('');
    const [summary, setSummary] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<EmailType>('CLIENT');
    const [jurisdiction, setJurisdiction] = useState<Jurisdiction | ''>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !from.trim() || !to.trim() || !date) return;

        onSave({
            subject: subject.trim(),
            summary: summary.trim(),
            from: from.trim(),
            to: to.trim(),
            date,
            type,
            jurisdiction: jurisdiction || undefined,
        });

        // Reset form
        setSubject('');
        setSummary('');
        setFrom('');
        setTo('');
        setDate('');
        setType('CLIENT');
        setJurisdiction('');
    };

    const emailTypes: EmailType[] = ['CLIENT', 'OPPOSING_COUNSEL', 'COURT', 'VENDOR', 'OTHER'];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Log Email" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Subject *</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">From *</label>
                        <input
                            type="email"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">To *</label>
                        <input
                            type="email"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Summary</label>
                    <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Date *</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as EmailType)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {emailTypes.map(t => (
                                <option key={t} value={t}>{t.replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Jurisdiction</label>
                        <select
                            value={jurisdiction}
                            onChange={(e) => setJurisdiction(e.target.value as Jurisdiction | '')}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">None</option>
                            <option value="FL">Florida</option>
                            <option value="TN">Tennessee</option>
                            <option value="IN">Indiana</option>
                            <option value="CO">Colorado</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Log Email
                    </button>
                </div>
            </form>
        </Modal>
    );
}
