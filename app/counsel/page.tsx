'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import { Modal } from '@/components/ui/Modal';
import { Counsel, Jurisdiction, CounselStatus } from '@/lib/types';
import { Mail, Phone, FileText, User, Plus, Search, MoreVertical } from 'lucide-react';

export default function CounselPage() {
    const { counsel, tasks, emails, addCounsel, updateCounsel, deleteCounsel } = useData();
    const [selectedCounsel, setSelectedCounsel] = useState<Counsel | null>(null);
    const [showNewModal, setShowNewModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<CounselStatus | 'ALL'>('ALL');
    const [stateFilter, setStateFilter] = useState<Jurisdiction | 'ALL'>('ALL');

    const filteredCounsel = counsel.filter(c => {
        const matchesSearch = !searchTerm ||
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.firm.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
        const matchesState = stateFilter === 'ALL' || c.state === stateFilter;
        return matchesSearch && matchesStatus && matchesState;
    });

    const getAssignedTasks = (c: Counsel) => tasks.filter(t => c.tasksAssigned.includes(t.id));
    const getCounselEmails = (c: Counsel) => emails.filter(e => c.emailLog.includes(e.id));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Counsel Directory</h1>
                    <p className="text-slate-400 mt-1">Manage attorneys and vendors across jurisdictions</p>
                </div>

                <button
                    onClick={() => setShowNewModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Counsel
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search name or firm..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <select
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value as Jurisdiction | 'ALL')}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="ALL">All States</option>
                    <option value="FL">Florida</option>
                    <option value="TN">Tennessee</option>
                    <option value="IN">Indiana</option>
                    <option value="CO">Colorado</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as CounselStatus | 'ALL')}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="ALL">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            {/* Counsel List */}
            <div className="space-y-4">
                {filteredCounsel.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 text-center">
                        <User className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400">No counsel found</p>
                        <button
                            onClick={() => setShowNewModal(true)}
                            className="mt-4 text-blue-400 hover:text-blue-300"
                        >
                            Add your first counsel
                        </button>
                    </div>
                ) : (
                    filteredCounsel.map((c) => {
                        const assignedTasks = getAssignedTasks(c);
                        const counselEmails = getCounselEmails(c);

                        return (
                            <div
                                key={c.id}
                                className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-colors"
                            >
                                <div className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-semibold text-white">{c.name}</h3>
                                                <span className={`text-xs px-2 py-0.5 rounded ${c.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' :
                                                        c.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' :
                                                            'bg-slate-500/20 text-slate-400'
                                                    }`}>
                                                    {c.status}
                                                </span>
                                            </div>
                                            <p className="text-slate-400">{c.firm}</p>

                                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-400">
                                                {c.address && <span>{c.address}</span>}
                                                <JurisdictionBadge jurisdiction={c.state} size="sm" />
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                                                <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {c.email}
                                                </a>
                                                {c.phone && (
                                                    <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-slate-400 hover:text-white">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        {c.phone}
                                                    </a>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                                                {c.caseNumber && <span>Case: {c.caseNumber}</span>}
                                                <span>Tasks: {assignedTasks.length}</span>
                                                <span>Emails: {counselEmails.length}</span>
                                                <span>Last Contact: {new Date(c.lastContact).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-800 px-5 py-3 bg-slate-800/30 flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedCounsel(c)}
                                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                    >
                                        <User className="w-3.5 h-3.5" />
                                        View Profile
                                    </button>
                                    <button className="text-sm text-slate-400 hover:text-white flex items-center gap-1">
                                        <Mail className="w-3.5 h-3.5" />
                                        Email History
                                    </button>
                                    <button className="text-sm text-slate-400 hover:text-white flex items-center gap-1">
                                        <FileText className="w-3.5 h-3.5" />
                                        Notes
                                    </button>
                                    <button
                                        onClick={() => updateCounsel(c.id, { status: c.status === 'Active' ? 'Inactive' : 'Active' })}
                                        className="text-sm text-slate-400 hover:text-white ml-auto"
                                    >
                                        {c.status === 'Active' ? 'Set Inactive' : 'Set Active'}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* New Counsel Modal */}
            <NewCounselModal
                isOpen={showNewModal}
                onClose={() => setShowNewModal(false)}
                onSave={(counsel) => {
                    addCounsel(counsel);
                    setShowNewModal(false);
                }}
            />

            {/* Counsel Detail Modal */}
            {selectedCounsel && (
                <CounselDetailModal
                    counsel={selectedCounsel}
                    onClose={() => setSelectedCounsel(null)}
                    tasks={getAssignedTasks(selectedCounsel)}
                    emails={getCounselEmails(selectedCounsel)}
                />
            )}
        </div>
    );
}

interface NewCounselModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (counsel: Omit<Counsel, 'id' | 'createdAt' | 'updatedAt' | 'tasksAssigned' | 'emailLog'>) => void;
}

function NewCounselModal({ isOpen, onClose, onSave }: NewCounselModalProps) {
    const [name, setName] = useState('');
    const [firm, setFirm] = useState('');
    const [address, setAddress] = useState('');
    const [state, setState] = useState<Jurisdiction>('FL');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [caseNumber, setCaseNumber] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !firm.trim() || !email.trim()) return;

        onSave({
            name: name.trim(),
            firm: firm.trim(),
            address: address.trim() || undefined,
            state,
            email: email.trim(),
            phone: phone.trim() || undefined,
            status: 'Pending',
            caseNumber: caseNumber.trim() || undefined,
            lastContact: new Date().toISOString().split('T')[0],
            notes: ''
        });

        setName(''); setFirm(''); setAddress(''); setEmail(''); setPhone(''); setCaseNumber('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Counsel" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium text-slate-300 mb-1">Name *</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" required />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium text-slate-300 mb-1">Firm *</label>
                        <input type="text" value={firm} onChange={(e) => setFirm(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" required />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email *</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">State</label>
                        <select value={state} onChange={(e) => setState(e.target.value as Jurisdiction)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
                            <option value="FL">Florida</option>
                            <option value="TN">Tennessee</option>
                            <option value="IN">Indiana</option>
                            <option value="CO">Colorado</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Case Number</label>
                        <input type="text" value={caseNumber} onChange={(e) => setCaseNumber(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                        Add Counsel
                    </button>
                </div>
            </form>
        </Modal>
    );
}

interface CounselDetailModalProps {
    counsel: Counsel;
    onClose: () => void;
    tasks: { id: string; title: string }[];
    emails: { id: string; subject: string; date: string }[];
}

function CounselDetailModal({ counsel, onClose, tasks, emails }: CounselDetailModalProps) {
    return (
        <Modal isOpen={true} onClose={onClose} title={counsel.name} size="lg">
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-slate-400">Firm</p>
                        <p className="text-white">{counsel.firm}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">State</p>
                        <JurisdictionBadge jurisdiction={counsel.state} showFull />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Email</p>
                        <a href={`mailto:${counsel.email}`} className="text-blue-400">{counsel.email}</a>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Phone</p>
                        <p className="text-white">{counsel.phone || 'N/A'}</p>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-slate-400 uppercase mb-2">Assigned Tasks ({tasks.length})</h4>
                    {tasks.length > 0 ? (
                        <div className="space-y-2">
                            {tasks.map(t => (
                                <div key={t.id} className="bg-slate-800 rounded-lg p-3 text-white text-sm">{t.title}</div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm">No tasks assigned</p>
                    )}
                </div>

                <div>
                    <h4 className="text-sm font-medium text-slate-400 uppercase mb-2">Email History ({emails.length})</h4>
                    {emails.length > 0 ? (
                        <div className="space-y-2">
                            {emails.map(e => (
                                <div key={e.id} className="bg-slate-800 rounded-lg p-3 flex justify-between">
                                    <span className="text-white text-sm">{e.subject}</span>
                                    <span className="text-slate-500 text-xs">{new Date(e.date).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm">No email history</p>
                    )}
                </div>

                {counsel.notes && (
                    <div>
                        <h4 className="text-sm font-medium text-slate-400 uppercase mb-2">Notes</h4>
                        <p className="text-white bg-slate-800 rounded-lg p-3">{counsel.notes}</p>
                    </div>
                )}
            </div>
        </Modal>
    );
}
