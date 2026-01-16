'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { Modal } from '@/components/ui/Modal';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import { Gavel, DollarSign, Target, TrendingUp, Plus, ChevronRight, Clock } from 'lucide-react';

export default function EnforcementPage() {
    const { enforcementActions, getRecoveryProbability } = useData();
    const [showNewActionModal, setShowNewActionModal] = useState(false);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

    const activeActions = enforcementActions.filter(a => a.status === 'filed' || a.status === 'served' || a.status === 'pending_response');
    const totalExpectedRecovery = activeActions.reduce((sum, a) => sum + a.expectedRecovery, 0);
    const totalCollected = enforcementActions.reduce((sum, a) => sum + a.amountCollected, 0);

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#23313E] flex items-center gap-3">
                            <Gavel className="w-8 h-8 text-[#C7A252]" />
                            Enforcement Command Center
                        </h1>
                        <p className="text-[#5a6a7a] mt-1">Coordinate and track all enforcement actions</p>
                    </div>
                    <button onClick={() => setShowNewActionModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#C7A252] hover:bg-[#a88b43] text-[#23313E] rounded-lg font-medium">
                        <Plus className="w-4 h-4" /> New Action
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <Target className="w-6 h-6 text-[#C7A252] mb-2" />
                        <div className="text-2xl font-bold text-[#23313E]">{activeActions.length}</div>
                        <div className="text-sm text-[#8a95a3]">Active Actions</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <TrendingUp className="w-6 h-6 text-[#3B82F6] mb-2" />
                        <div className="text-2xl font-bold text-[#3B82F6]">{formatCurrency(totalExpectedRecovery)}</div>
                        <div className="text-sm text-[#8a95a3]">Expected Recovery</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <DollarSign className="w-6 h-6 text-[#22C55E] mb-2" />
                        <div className="text-2xl font-bold text-[#22C55E]">{formatCurrency(totalCollected)}</div>
                        <div className="text-sm text-[#8a95a3]">Collected</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <Clock className="w-6 h-6 text-[#8B5CF6] mb-2" />
                        <div className="text-2xl font-bold text-[#8B5CF6]">{getRecoveryProbability}%</div>
                        <div className="text-sm text-[#8a95a3]">Recovery Rate</div>
                    </div>
                </div>

                <div className="space-y-4">
                    {enforcementActions.map((action) => (
                        <div key={action.id} className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm hover:border-[#C7A252] transition-all">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#C7A252]/15 rounded-xl flex items-center justify-center">
                                        <Gavel className="w-6 h-6 text-[#C7A252]" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-[#23313E]">{action.actionType}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${action.status === 'collected' ? 'bg-emerald-100 text-emerald-700' :
                                                    action.status === 'served' || action.status === 'filed' ? 'bg-blue-100 text-blue-700' :
                                                        action.status === 'pending_response' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-gray-100 text-gray-600'
                                                }`}>{action.status}</span>
                                        </div>
                                        <p className="text-sm text-[#5a6a7a]">{action.target?.name || 'Target'}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <JurisdictionBadge jurisdiction={action.jurisdiction} size="sm" />
                                            <span className="text-xs text-[#8a95a3]">Filed: {new Date(action.dateInitiated).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-[#C7A252]">{formatCurrency(action.expectedRecovery)}</div>
                                        <div className="text-xs text-[#8a95a3]">Expected</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-[#22C55E]">{formatCurrency(action.amountCollected)}</div>
                                        <div className="text-xs text-[#8a95a3]">Collected</div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[#8a95a3]" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Modal isOpen={showNewActionModal} onClose={() => setShowNewActionModal(false)} title="Initiate Enforcement Action">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#23313E] mb-2">Action Type</label>
                            <select className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E]">
                                <option>wage_garnishment</option>
                                <option>bank_levy</option>
                                <option>writ_of_execution</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#23313E] mb-2">Jurisdiction</label>
                            <select className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E]">
                                <option value="FL">Florida</option>
                                <option value="TN">Tennessee</option>
                                <option value="IN">Indiana</option>
                                <option value="CO">Colorado</option>
                            </select>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button onClick={() => setShowNewActionModal(false)}
                                className="flex-1 px-4 py-2.5 bg-[#F8F9FA] text-[#5a6a7a] rounded-lg font-medium">Cancel</button>
                            <button className="flex-1 px-4 py-2.5 bg-[#C7A252] text-[#23313E] rounded-lg font-medium">Create</button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
