'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { Modal } from '@/components/ui/Modal';
import {
    DollarSign, Plus, ChevronRight, Calculator, Calendar
} from 'lucide-react';

export default function SettlePage() {
    const { settlements, caseConfig, calculateInterest, getBestOffer, addSettlement } = useData();
    const [showNewOfferModal, setShowNewOfferModal] = useState(false);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

    const totalDue = caseConfig.judgmentAmount + calculateInterest();
    const bestOfferAmount = getBestOffer || 0;
    const percentOffer = bestOfferAmount ? ((bestOfferAmount / totalDue) * 100).toFixed(1) : 0;

    const reviewOffers = settlements.filter(s => s.status === 'Review');
    const acceptedOffers = settlements.filter(s => s.status === 'Accepted');

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#23313E] flex items-center gap-3">
                            <DollarSign className="w-8 h-8 text-[#C7A252]" />
                            Settlement Tracker
                        </h1>
                        <p className="text-[#5a6a7a] mt-1">Manage settlement negotiations and payment plans</p>
                    </div>
                    <button
                        onClick={() => setShowNewOfferModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#C7A252] hover:bg-[#a88b43] text-[#23313E] rounded-lg font-medium transition-all shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        New Offer
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#23313E]">{formatCurrency(totalDue)}</div>
                        <div className="text-sm text-[#8a95a3]">Total Due</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#C7A252]">{formatCurrency(bestOfferAmount)}</div>
                        <div className="text-sm text-[#8a95a3]">Best Offer ({percentOffer}%)</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#3B82F6]">{reviewOffers.length}</div>
                        <div className="text-sm text-[#8a95a3]">Under Review</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#22C55E]">{acceptedOffers.length}</div>
                        <div className="text-sm text-[#8a95a3]">Accepted</div>
                    </div>
                </div>

                {/* Settlement Calculator */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm mb-6">
                    <h3 className="font-semibold text-[#23313E] mb-4 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-[#C7A252]" />
                        Settlement Calculator
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        <div className="text-center p-4 bg-[#F8F9FA] rounded-xl">
                            <div className="text-sm text-[#8a95a3] mb-1">50% Settlement</div>
                            <div className="text-lg font-bold text-[#23313E]">{formatCurrency(totalDue * 0.5)}</div>
                        </div>
                        <div className="text-center p-4 bg-[#F8F9FA] rounded-xl">
                            <div className="text-sm text-[#8a95a3] mb-1">60% Settlement</div>
                            <div className="text-lg font-bold text-[#23313E]">{formatCurrency(totalDue * 0.6)}</div>
                        </div>
                        <div className="text-center p-4 bg-[#C7A252]/15 rounded-xl">
                            <div className="text-sm text-[#8a95a3] mb-1">70% Settlement</div>
                            <div className="text-lg font-bold text-[#C7A252]">{formatCurrency(totalDue * 0.7)}</div>
                        </div>
                        <div className="text-center p-4 bg-[#F8F9FA] rounded-xl">
                            <div className="text-sm text-[#8a95a3] mb-1">80% Settlement</div>
                            <div className="text-lg font-bold text-[#23313E]">{formatCurrency(totalDue * 0.8)}</div>
                        </div>
                        <div className="text-center p-4 bg-[#F8F9FA] rounded-xl">
                            <div className="text-sm text-[#8a95a3] mb-1">90% Settlement</div>
                            <div className="text-lg font-bold text-[#23313E]">{formatCurrency(totalDue * 0.9)}</div>
                        </div>
                    </div>
                </div>

                {/* Settlement History */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E5E7EB]">
                        <h3 className="font-semibold text-[#23313E]">Settlement Offers</h3>
                    </div>
                    {settlements.length === 0 ? (
                        <div className="p-8 text-center">
                            <DollarSign className="w-12 h-12 text-[#8a95a3] mx-auto mb-4" />
                            <p className="text-[#5a6a7a]">No settlement offers recorded yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#E5E7EB]">
                            {settlements.map((settlement) => (
                                <div key={settlement.id} className="p-5 hover:bg-[#F8F9FA] transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-semibold text-[#23313E]">{formatCurrency(settlement.amount)}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${settlement.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' :
                                                    settlement.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                        settlement.status === 'Review' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {settlement.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-[#5a6a7a]">
                                                <span>{((settlement.amount / totalDue) * 100).toFixed(1)}% of total</span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(settlement.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-[#8a95a3]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* New Offer Modal */}
                <Modal isOpen={showNewOfferModal} onClose={() => setShowNewOfferModal(false)} title="Record Settlement Offer">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#23313E] mb-2">Offer Amount</label>
                            <input
                                type="number"
                                placeholder="Enter amount"
                                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E] focus:border-[#C7A252]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#23313E] mb-2">Proposed By</label>
                            <select className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E] focus:border-[#C7A252]">
                                <option>Creditor</option>
                                <option>Debtor</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#23313E] mb-2">Notes</label>
                            <textarea
                                rows={3}
                                placeholder="Additional details..."
                                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E] focus:border-[#C7A252]"
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => setShowNewOfferModal(false)}
                                className="flex-1 px-4 py-2.5 bg-[#F8F9FA] text-[#5a6a7a] rounded-lg font-medium hover:bg-[#E5E7EB] transition-colors"
                            >
                                Cancel
                            </button>
                            <button className="flex-1 px-4 py-2.5 bg-[#C7A252] text-[#23313E] rounded-lg font-medium hover:bg-[#a88b43] transition-colors">
                                Record Offer
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
