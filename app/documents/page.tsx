'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { Modal } from '@/components/ui/Modal';
import { generateDocument, DocumentData } from '@/lib/documentGenerator';
import {
    FileText, Download, Mail, FileCheck, Gavel, DollarSign, Search, ChevronRight, CheckCircle, Loader2
} from 'lucide-react';

const DOCUMENT_CATEGORIES = [
    { id: 'demand', label: 'Demand Letters', icon: Mail, count: 4 },
    { id: 'garnishment', label: 'Garnishment Writs', icon: Gavel, count: 5 },
    { id: 'subpoena', label: 'Subpoenas', icon: Search, count: 4 },
    { id: 'motion', label: 'Motions', icon: FileCheck, count: 3 },
    { id: 'settlement', label: 'Settlement', icon: DollarSign, count: 3 },
    { id: 'lien', label: 'Lien Documents', icon: FileText, count: 3 },
];

const TEMPLATES = [
    { id: '1', name: 'Initial Demand Letter', category: 'demand', description: 'First formal demand for payment' },
    { id: '2', name: 'Final Demand Letter', category: 'demand', description: '10-day notice before enforcement' },
    { id: '3', name: 'Wage Garnishment Writ', category: 'garnishment', description: 'Continuing wage garnishment' },
    { id: '4', name: 'Bank Account Levy', category: 'garnishment', description: 'Single account levy order' },
    { id: '5', name: 'A/R Garnishment', category: 'garnishment', description: 'Accounts receivable garnishment' },
    { id: '6', name: 'Debtor Examination Subpoena', category: 'subpoena', description: 'Form 1.977 examination notice' },
    { id: '7', name: 'Bank Records Subpoena', category: 'subpoena', description: 'Third-party bank records request' },
    { id: '8', name: 'Motion for Contempt', category: 'motion', description: 'Non-compliance contempt motion' },
    { id: '9', name: 'Settlement Agreement', category: 'settlement', description: 'Payment plan agreement' },
    { id: '10', name: 'Satisfaction of Judgment', category: 'settlement', description: 'Full payment release' },
    { id: '11', name: 'Notice of Lien', category: 'lien', description: 'Real property lien filing' },
    { id: '12', name: 'UCC-1 Financing Statement', category: 'lien', description: 'Personal property security interest' },
];

export default function DocumentsPage() {
    const { caseConfig, calculateInterest } = useData();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<typeof TEMPLATES[0] | null>(null);
    const [selectedJurisdiction, setSelectedJurisdiction] = useState('FL');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationSuccess, setGenerationSuccess] = useState(false);

    const filteredTemplates = selectedCategory === 'all'
        ? TEMPLATES
        : TEMPLATES.filter(t => t.category === selectedCategory);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

    const handleGenerateDocument = () => {
        if (!selectedTemplate) return;

        setIsGenerating(true);

        const documentData: DocumentData = {
            templateName: selectedTemplate.name,
            templateId: selectedTemplate.id,
            caseNumber: caseConfig.caseNumber,
            judgmentAmount: caseConfig.judgmentAmount,
            interestAccrued: calculateInterest(),
            totalDue: caseConfig.judgmentAmount + calculateInterest(),
            judgmentDate: caseConfig.judgmentDate,
            jurisdiction: selectedJurisdiction,
        };

        // Small delay for UX feedback
        setTimeout(() => {
            generateDocument(documentData);
            setIsGenerating(false);
            setGenerationSuccess(true);

            // Reset success state after 3 seconds
            setTimeout(() => {
                setGenerationSuccess(false);
            }, 3000);
        }, 500);
    };

    const closeModal = () => {
        setShowGenerateModal(false);
        setSelectedTemplate(null);
        setGenerationSuccess(false);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#23313E] flex items-center gap-3">
                            <FileText className="w-8 h-8 text-[#C7A252]" />
                            Document Generation Suite
                        </h1>
                        <p className="text-[#5a6a7a] mt-1">Auto-generate legal documents with case data pre-populated</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
                        <div className="text-2xl font-bold text-[#23313E]">{TEMPLATES.length}</div>
                        <div className="text-sm text-[#8a95a3]">Templates Available</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
                        <div className="text-2xl font-bold text-[#C7A252]">{formatCurrency(caseConfig.judgmentAmount)}</div>
                        <div className="text-sm text-[#8a95a3]">Judgment Amount</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
                        <div className="text-2xl font-bold text-[#22C55E]">+{formatCurrency(calculateInterest())}</div>
                        <div className="text-sm text-[#8a95a3]">Interest Accrued</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
                        <div className="text-2xl font-bold text-[#3B82F6]">4</div>
                        <div className="text-sm text-[#8a95a3]">Jurisdictions</div>
                    </div>
                </div>

                {/* Categories */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-2 mb-6 shadow-sm">
                    <div className="flex gap-2 overflow-x-auto">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === 'all'
                                ? 'bg-[#C7A252] text-[#23313E]'
                                : 'text-[#5a6a7a] hover:bg-[#F8F9FA]'
                                }`}
                        >
                            All Templates
                        </button>
                        {DOCUMENT_CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id
                                    ? 'bg-[#C7A252] text-[#23313E]'
                                    : 'text-[#5a6a7a] hover:bg-[#F8F9FA]'
                                    }`}
                            >
                                <cat.icon className="w-4 h-4" />
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTemplates.map((template) => {
                        const category = DOCUMENT_CATEGORIES.find(c => c.id === template.category);
                        const Icon = category?.icon || FileText;

                        return (
                            <div
                                key={template.id}
                                className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm hover:border-[#C7A252] transition-all cursor-pointer group"
                                onClick={() => {
                                    setSelectedTemplate(template);
                                    setShowGenerateModal(true);
                                }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#C7A252]/15 rounded-xl flex items-center justify-center group-hover:bg-[#C7A252]/25 transition-colors">
                                        <Icon className="w-6 h-6 text-[#C7A252]" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-[#23313E] mb-1">{template.name}</h3>
                                        <p className="text-sm text-[#5a6a7a]">{template.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E5E7EB]">
                                    <span className="text-xs text-[#8a95a3] uppercase font-medium">{category?.label}</span>
                                    <span className="text-[#C7A252] text-sm font-medium flex items-center gap-1">
                                        Generate <ChevronRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Generate Modal */}
                <Modal
                    isOpen={showGenerateModal}
                    onClose={closeModal}
                    title={`Generate: ${selectedTemplate?.name || 'Document'}`}
                    size="lg"
                >
                    <div className="space-y-4">
                        <p className="text-[#5a6a7a]">{selectedTemplate?.description}</p>

                        {generationSuccess && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-emerald-600" />
                                <div>
                                    <div className="font-medium text-emerald-800">Document Generated!</div>
                                    <div className="text-sm text-emerald-600">Use your browser's print dialog to save as PDF</div>
                                </div>
                            </div>
                        )}

                        <div className="bg-[#F8F9FA] rounded-xl p-4">
                            <h4 className="font-medium text-[#23313E] mb-3">Case Information (Auto-filled)</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-[#8a95a3]">Case Number:</span>
                                    <span className="text-[#23313E] ml-2 font-mono">{caseConfig.caseNumber || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-[#8a95a3]">Judgment:</span>
                                    <span className="text-[#23313E] ml-2">{formatCurrency(caseConfig.judgmentAmount)}</span>
                                </div>
                                <div>
                                    <span className="text-[#8a95a3]">Interest:</span>
                                    <span className="text-[#23313E] ml-2">{formatCurrency(calculateInterest())}</span>
                                </div>
                                <div>
                                    <span className="text-[#8a95a3]">Total Due:</span>
                                    <span className="text-[#C7A252] ml-2 font-semibold">{formatCurrency(caseConfig.judgmentAmount + calculateInterest())}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#23313E] mb-2">Target Jurisdiction</label>
                            <select
                                value={selectedJurisdiction}
                                onChange={(e) => setSelectedJurisdiction(e.target.value)}
                                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E] focus:border-[#C7A252]"
                            >
                                <option value="FL">Florida</option>
                                <option value="TN">Tennessee</option>
                                <option value="IN">Indiana</option>
                                <option value="CO">Colorado</option>
                            </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={closeModal}
                                className="flex-1 px-4 py-2.5 bg-[#F8F9FA] text-[#5a6a7a] rounded-lg font-medium hover:bg-[#E5E7EB] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerateDocument}
                                disabled={isGenerating}
                                className="flex-1 px-4 py-2.5 bg-[#C7A252] text-[#23313E] rounded-lg font-medium hover:bg-[#a88b43] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        Generate Document
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
