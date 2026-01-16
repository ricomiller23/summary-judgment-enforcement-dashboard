'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { Modal } from '@/components/ui/Modal';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import {
    Users, Plus, Mail, Phone, Briefcase, ChevronRight, Star
} from 'lucide-react';

export default function CounselPage() {
    const { counsel, addCounsel } = useData();
    const [showNewCounselModal, setShowNewCounselModal] = useState(false);

    const activeCounsel = counsel.filter(c => c.status === 'Active');

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#23313E] flex items-center gap-3">
                            <Users className="w-8 h-8 text-[#C7A252]" />
                            Local Counsel Directory
                        </h1>
                        <p className="text-[#5a6a7a] mt-1">Manage local counsel and contacts by jurisdiction</p>
                    </div>
                    <button
                        onClick={() => setShowNewCounselModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#C7A252] hover:bg-[#a88b43] text-[#23313E] rounded-lg font-medium transition-all shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Counsel
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#23313E]">{counsel.length}</div>
                        <div className="text-sm text-[#8a95a3]">Total Counsel</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#C7A252]">4</div>
                        <div className="text-sm text-[#8a95a3]">Jurisdictions Covered</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#22C55E]">{activeCounsel.length}</div>
                        <div className="text-sm text-[#8a95a3]">Active</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#3B82F6]">{counsel.filter(c => c.status === 'Pending').length}</div>
                        <div className="text-sm text-[#8a95a3]">Pending</div>
                    </div>
                </div>

                {/* Counsel List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {counsel.map((attorney) => (
                        <div key={attorney.id} className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm hover:border-[#C7A252] transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#C7A252]/15 rounded-xl flex items-center justify-center">
                                        <Briefcase className="w-6 h-6 text-[#C7A252]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#23313E]">{attorney.name}</h3>
                                        <p className="text-sm text-[#5a6a7a]">{attorney.firm}</p>
                                    </div>
                                </div>
                                <JurisdictionBadge jurisdiction={attorney.state} size="sm" />
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-[#5a6a7a]">
                                    <Mail className="w-4 h-4" />
                                    <span>{attorney.email}</span>
                                </div>
                                {attorney.phone && (
                                    <div className="flex items-center gap-2 text-[#5a6a7a]">
                                        <Phone className="w-4 h-4" />
                                        <span>{attorney.phone}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E5E7EB]">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${attorney.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                                        attorney.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                            'bg-gray-100 text-gray-600'
                                    }`}>
                                    {attorney.status}
                                </span>
                                <span className="text-[#C7A252] text-sm font-medium flex items-center gap-1 cursor-pointer hover:underline">
                                    View Details <ChevronRight className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* New Counsel Modal */}
                <Modal isOpen={showNewCounselModal} onClose={() => setShowNewCounselModal(false)} title="Add Local Counsel">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#23313E] mb-2">Attorney Name</label>
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E] focus:border-[#C7A252]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#23313E] mb-2">Firm</label>
                                <input
                                    type="text"
                                    placeholder="Law firm"
                                    className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E] focus:border-[#C7A252]"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#23313E] mb-2">Email</label>
                            <input
                                type="email"
                                placeholder="email@firm.com"
                                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E] focus:border-[#C7A252]"
                            />
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
                                onClick={() => setShowNewCounselModal(false)}
                                className="flex-1 px-4 py-2.5 bg-[#F8F9FA] text-[#5a6a7a] rounded-lg font-medium hover:bg-[#E5E7EB] transition-colors"
                            >
                                Cancel
                            </button>
                            <button className="flex-1 px-4 py-2.5 bg-[#C7A252] text-[#23313E] rounded-lg font-medium hover:bg-[#a88b43] transition-colors">
                                Add Counsel
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
