'use client';

import { useState, useMemo } from 'react';
import { useData } from '@/lib/hooks/useData';
import { Modal } from '@/components/ui/Modal';
import { SettlementOffer, SettlementStatus } from '@/lib/types';
import { DollarSign, TrendingUp, Plus, FileSpreadsheet, FileText, Download } from 'lucide-react';

export default function SettlePage() {
    const { caseConfig, settlements, addSettlement, updateSettlement, calculateInterest } = useData();
    const [showNewModal, setShowNewModal] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<SettlementOffer | null>(null);

    const interest = useMemo(() => calculateInterest(), [calculateInterest]);
    const totalOwed = caseConfig.judgmentAmount + interest;
    const bestOffer = useMemo(() => {
        const offers = settlements.filter(s => s.status !== 'Rejected');
        return offers.length > 0 ? Math.max(...offers.map(s => s.amount)) : 0;
    }, [settlements]);
    const recoveryPercent = bestOffer > 0 ? ((bestOffer / caseConfig.judgmentAmount) * 100).toFixed(1) : '0';

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const statusColors: Record<SettlementStatus, string> = {
        Review: 'bg-blue-500/20 text-blue-400',
        Countered: 'bg-amber-500/20 text-amber-400',
        Accepted: 'bg-emerald-500/20 text-emerald-400',
        Rejected: 'bg-red-500/20 text-red-400'
    };

    const handleExportExcel = () => {
        const data = settlements.map(s => ({
            Date: s.date,
            Party: s.party,
            Amount: s.amount,
            Terms: s.terms,
            Status: s.status,
            Notes: s.notes || ''
        }));

        // Create CSV
        const headers = Object.keys(data[0] || { Date: '', Party: '', Amount: '', Terms: '', Status: '', Notes: '' });
        const csv = [
            headers.join(','),
            ...data.map(row => headers.map(h => `"${(row as Record<string, unknown>)[h]}"`).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'settlement_history.csv';
        a.click();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-4">
                    <p className="text-blue-400 text-sm font-medium">Target Judgment</p>
                    <p className="text-2xl font-bold text-white mt-1">{formatCurrency(caseConfig.judgmentAmount)}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-500/30 rounded-xl p-4">
                    <p className="text-amber-400 text-sm font-medium">Interest Accrued</p>
                    <p className="text-2xl font-bold text-white mt-1">+{formatCurrency(interest)}</p>
                    <p className="text-xs text-amber-400/70 mt-1">{caseConfig.interestRate}% FL statutory rate</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/30 rounded-xl p-4">
                    <p className="text-emerald-400 text-sm font-medium">Best Offer</p>
                    <p className="text-2xl font-bold text-white mt-1">{formatCurrency(bestOffer)}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-4">
                    <p className="text-purple-400 text-sm font-medium">Recovery %</p>
                    <p className="text-2xl font-bold text-white mt-1">{recoveryPercent}%</p>
                    <p className="text-xs text-purple-400/70 mt-1">Floor: {formatCurrency(caseConfig.floorAmount)}</p>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-white">Settlement Tracker</h1>

                <div className="flex gap-2">
                    <button
                        onClick={handleExportExcel}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        Export CSV
                    </button>
                    <button
                        onClick={() => setShowNewModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Log Offer
                    </button>
                </div>
            </div>

            {/* Settlement Table */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-800/50">
                        <tr>
                            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Date</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Party</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Amount</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Terms</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Status</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {settlements.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center">
                                    <DollarSign className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                    <p className="text-slate-400">No settlement offers logged yet</p>
                                    <button onClick={() => setShowNewModal(true)} className="mt-2 text-blue-400 hover:text-blue-300 text-sm">
                                        Log your first offer
                                    </button>
                                </td>
                            </tr>
                        ) : (
                            settlements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((offer) => (
                                <tr key={offer.id} className="hover:bg-slate-800/50">
                                    <td className="px-4 py-4 text-white">{new Date(offer.date).toLocaleDateString()}</td>
                                    <td className="px-4 py-4 text-white">{offer.party}</td>
                                    <td className="px-4 py-4 text-emerald-400 font-medium">{formatCurrency(offer.amount)}</td>
                                    <td className="px-4 py-4 text-slate-400 text-sm max-w-xs truncate">{offer.terms}</td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-1 rounded text-xs ${statusColors[offer.status]}`}>
                                            {offer.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedOffer(offer)}
                                                className="text-blue-400 hover:text-blue-300 text-sm"
                                            >
                                                Edit
                                            </button>
                                            {offer.status === 'Review' && (
                                                <>
                                                    <button
                                                        onClick={() => updateSettlement(offer.id, { status: 'Accepted' })}
                                                        className="text-emerald-400 hover:text-emerald-300 text-sm"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => updateSettlement(offer.id, { status: 'Rejected' })}
                                                        className="text-red-400 hover:text-red-300 text-sm"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* New Offer Modal */}
            <NewOfferModal
                isOpen={showNewModal}
                onClose={() => setShowNewModal(false)}
                onSave={(offer) => {
                    addSettlement(offer);
                    setShowNewModal(false);
                }}
            />

            {/* Edit Offer Modal */}
            {selectedOffer && (
                <EditOfferModal
                    offer={selectedOffer}
                    onClose={() => setSelectedOffer(null)}
                    onSave={(updates) => {
                        updateSettlement(selectedOffer.id, updates);
                        setSelectedOffer(null);
                    }}
                />
            )}
        </div>
    );
}

interface NewOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (offer: Omit<SettlementOffer, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

function NewOfferModal({ isOpen, onClose, onSave }: NewOfferModalProps) {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [party, setParty] = useState('MSH');
    const [amount, setAmount] = useState('');
    const [terms, setTerms] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !party) return;

        onSave({
            date,
            party,
            amount: parseFloat(amount),
            terms,
            status: 'Review',
            notes: notes || undefined
        });

        setAmount(''); setTerms(''); setNotes('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Log Settlement Offer" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Party</label>
                        <input type="text" value={party} onChange={(e) => setParty(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Amount *</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-white" required />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Terms</label>
                    <input type="text" value={terms} onChange={(e) => setTerms(e.target.value)}
                        placeholder="e.g., 6 monthly installments"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white h-20 resize-none" />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                        Log Offer
                    </button>
                </div>
            </form>
        </Modal>
    );
}

interface EditOfferModalProps {
    offer: SettlementOffer;
    onClose: () => void;
    onSave: (updates: Partial<SettlementOffer>) => void;
}

function EditOfferModal({ offer, onClose, onSave }: EditOfferModalProps) {
    const [status, setStatus] = useState<SettlementStatus>(offer.status);
    const [counterAmount, setCounterAmount] = useState(offer.counterAmount?.toString() || '');
    const [notes, setNotes] = useState(offer.notes || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            status,
            counterAmount: counterAmount ? parseFloat(counterAmount) : undefined,
            notes: notes || undefined
        });
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Edit Offer" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value as SettlementStatus)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
                        <option value="Review">Review</option>
                        <option value="Countered">Countered</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                {status === 'Countered' && (
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Counter Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                            <input type="number" value={counterAmount} onChange={(e) => setCounterAmount(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-white" />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white h-20 resize-none" />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                        Save Changes
                    </button>
                </div>
            </form>
        </Modal>
    );
}
