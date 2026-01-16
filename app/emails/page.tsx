'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { Modal } from '@/components/ui/Modal';
import {
    Mail, Plus, Send, Inbox, Clock, ChevronRight
} from 'lucide-react';

export default function EmailsPage() {
    const { emails, addEmail } = useData();
    const [showComposeModal, setShowComposeModal] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#23313E] flex items-center gap-3">
                            <Mail className="w-8 h-8 text-[#C7A252]" />
                            Email Communications
                        </h1>
                        <p className="text-[#5a6a7a] mt-1">Track case-related email correspondence</p>
                    </div>
                    <button
                        onClick={() => setShowComposeModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#C7A252] hover:bg-[#a88b43] text-[#23313E] rounded-lg font-medium transition-all shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Log Email
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#23313E]">{emails.length}</div>
                        <div className="text-sm text-[#8a95a3]">Total Emails</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#C7A252]">{emails.filter(e => e.type === 'CLIENT').length}</div>
                        <div className="text-sm text-[#8a95a3]">Client</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#3B82F6]">{emails.filter(e => e.type === 'COURT').length}</div>
                        <div className="text-sm text-[#8a95a3]">Court</div>
                    </div>
                </div>

                {/* Email List */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E5E7EB]">
                        <h3 className="font-semibold text-[#23313E]">Email Log</h3>
                    </div>
                    {emails.length === 0 ? (
                        <div className="p-8 text-center">
                            <Mail className="w-12 h-12 text-[#8a95a3] mx-auto mb-4" />
                            <p className="text-[#5a6a7a]">No emails recorded yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#E5E7EB]">
                            {emails.map((email) => (
                                <div key={email.id} className="p-5 hover:bg-[#F8F9FA] transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-10 h-10 bg-[#C7A252]/15 rounded-xl flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-[#C7A252]" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-[#23313E] mb-1">{email.subject}</h4>
                                                <div className="text-sm text-[#5a6a7a]">
                                                    From: {email.from} → To: {email.to}
                                                </div>
                                                {email.summary && (
                                                    <p className="text-sm text-[#8a95a3] mt-2 line-clamp-2">{email.summary}</p>
                                                )}
                                                <div className="flex items-center gap-2 mt-2 text-xs text-[#8a95a3]">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(email.date).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${email.type === 'CLIENT' ? 'bg-[#C7A252]/20 text-[#C7A252]' :
                                                    email.type === 'COURT' ? 'bg-purple-100 text-purple-700' :
                                                        email.type === 'OPPOSING_COUNSEL' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-600'
                                                }`}>
                                                {email.type}
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-[#8a95a3]" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Compose Modal */}
                <Modal isOpen={showComposeModal} onClose={() => setShowComposeModal(false)} title="Log Email" size="lg">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#23313E] mb-2">Subject</label>
                            <input
                                type="text"
                                placeholder="Re: Case #05-2024-CA-050807"
                                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E] focus:border-[#C7A252]"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#23313E] mb-2">From</label>
                                <input
                                    type="email"
                                    placeholder="sender@example.com"
                                    className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E] focus:border-[#C7A252]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#23313E] mb-2">To</label>
                                <input
                                    type="email"
                                    placeholder="recipient@example.com"
                                    className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E] focus:border-[#C7A252]"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#23313E] mb-2">Type</label>
                            <select className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E] focus:border-[#C7A252]">
                                <option value="CLIENT">Client</option>
                                <option value="OPPOSING_COUNSEL">Opposing Counsel</option>
                                <option value="COURT">Court</option>
                                <option value="VENDOR">Vendor</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#23313E] mb-2">Summary</label>
                            <textarea
                                rows={4}
                                placeholder="Brief summary of the email..."
                                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E] focus:border-[#C7A252] resize-none"
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => setShowComposeModal(false)}
                                className="flex-1 px-4 py-2.5 bg-[#F8F9FA] text-[#5a6a7a] rounded-lg font-medium hover:bg-[#E5E7EB] transition-colors"
                            >
                                Cancel
                            </button>
                            <button className="flex-1 px-4 py-2.5 bg-[#C7A252] text-[#23313E] rounded-lg font-medium hover:bg-[#a88b43] transition-colors flex items-center justify-center gap-2">
                                <Send className="w-4 h-4" />
                                Log Email
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
