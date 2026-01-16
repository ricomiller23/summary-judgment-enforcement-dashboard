'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { Modal } from '@/components/ui/Modal';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import {
    FileText,
    Download,
    Mail,
    Send,
    Scale,
    DollarSign,
    Building2,
    User,
    AlertTriangle,
    FileCheck,
    Gavel,
    Briefcase,
    ClipboardList,
    CheckCircle,
    ChevronRight,
    Plus,
    Eye,
    Calendar,
    Phone,
    MapPin
} from 'lucide-react';
import { Jurisdiction } from '@/lib/types';

// Document template types
interface DocumentTemplate {
    id: string;
    name: string;
    category: 'demand' | 'interrogatory' | 'garnishment' | 'subpoena' | 'motion' | 'settlement' | 'lien' | 'domestication';
    description: string;
    icon: React.ReactNode;
    jurisdictions: Jurisdiction[] | 'all';
    fields: string[];
}

const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
    // Demand Letters
    {
        id: 'demand-initial',
        name: 'Initial Demand Letter',
        category: 'demand',
        description: 'Professional first contact assuming oversight, 15-day deadline',
        icon: <Mail className="w-5 h-5" />,
        jurisdictions: 'all',
        fields: ['debtor_name', 'debtor_address', 'judgment_amount', 'interest_accrued', 'deadline']
    },
    {
        id: 'demand-second',
        name: 'Second Demand Letter',
        category: 'demand',
        description: 'Firm tone citing judgment, 10-day deadline',
        icon: <Mail className="w-5 h-5" />,
        jurisdictions: 'all',
        fields: ['debtor_name', 'debtor_address', 'judgment_amount', 'interest_accrued', 'deadline', 'prior_letter_date']
    },
    {
        id: 'demand-final',
        name: 'Final Demand Letter',
        category: 'demand',
        description: 'Aggressive warning of immediate enforcement, 7-day deadline',
        icon: <AlertTriangle className="w-5 h-5" />,
        jurisdictions: 'all',
        fields: ['debtor_name', 'debtor_address', 'judgment_amount', 'interest_accrued', 'deadline', 'enforcement_actions']
    },
    {
        id: 'demand-settlement',
        name: 'Settlement Offer Letter',
        category: 'demand',
        description: 'Offer terms with discount and deadline',
        icon: <DollarSign className="w-5 h-5" />,
        jurisdictions: 'all',
        fields: ['debtor_name', 'debtor_address', 'settlement_amount', 'discount_percentage', 'deadline', 'terms']
    },
    // Interrogatories
    {
        id: 'interrogatory-fl',
        name: 'Florida Form 1.977 Interrogatories',
        category: 'interrogatory',
        description: 'Standard FL post-judgment interrogatories',
        icon: <ClipboardList className="w-5 h-5" />,
        jurisdictions: ['FL'],
        fields: ['debtor_name', 'case_number', 'court', 'judgment_date']
    },
    {
        id: 'interrogatory-tn',
        name: 'Tennessee Post-Judgment Interrogatories',
        category: 'interrogatory',
        description: 'TN standard interrogatories to judgment debtor',
        icon: <ClipboardList className="w-5 h-5" />,
        jurisdictions: ['TN'],
        fields: ['debtor_name', 'case_number', 'court', 'judgment_date']
    },
    {
        id: 'interrogatory-custom',
        name: 'Custom Interrogatories',
        category: 'interrogatory',
        description: 'Build custom questions for case-specific inquiries',
        icon: <Plus className="w-5 h-5" />,
        jurisdictions: 'all',
        fields: ['debtor_name', 'case_number', 'custom_questions']
    },
    // Garnishment Writs
    {
        id: 'garnishment-wage',
        name: 'Writ of Garnishment - Wages',
        category: 'garnishment',
        description: 'Continuous wage garnishment writ with employer instructions',
        icon: <Briefcase className="w-5 h-5" />,
        jurisdictions: 'all',
        fields: ['debtor_name', 'employer_name', 'employer_address', 'judgment_amount', 'interest', 'garnishment_amount']
    },
    {
        id: 'garnishment-bank',
        name: 'Writ of Garnishment - Bank Account',
        category: 'garnishment',
        description: 'Financial institution garnishment writ',
        icon: <Building2 className="w-5 h-5" />,
        jurisdictions: 'all',
        fields: ['debtor_name', 'bank_name', 'bank_address', 'judgment_amount', 'interest']
    },
    {
        id: 'garnishment-ar',
        name: 'Writ of Garnishment - Accounts Receivable',
        category: 'garnishment',
        description: 'Garnishment of debtor\'s customer payments',
        icon: <DollarSign className="w-5 h-5" />,
        jurisdictions: 'all',
        fields: ['debtor_name', 'customer_name', 'customer_address', 'judgment_amount']
    },
    // Subpoenas
    {
        id: 'subpoena-debtor',
        name: 'Subpoena for Debtor Examination',
        category: 'subpoena',
        description: 'Notice for debtor to appear for examination',
        icon: <User className="w-5 h-5" />,
        jurisdictions: 'all',
        fields: ['debtor_name', 'exam_date', 'exam_time', 'exam_location', 'documents_requested']
    },
    {
        id: 'subpoena-duces-tecum',
        name: 'Subpoena Duces Tecum',
        category: 'subpoena',
        description: 'Third-party subpoena for documents',
        icon: <FileText className="w-5 h-5" />,
        jurisdictions: 'all',
        fields: ['recipient_name', 'recipient_address', 'documents_requested', 'production_date']
    },
    {
        id: 'subpoena-bank',
        name: 'Bank Records Subpoena',
        category: 'subpoena',
        description: 'Request for bank statements and transaction history',
        icon: <Building2 className="w-5 h-5" />,
        jurisdictions: 'all',
        fields: ['bank_name', 'bank_address', 'account_holder', 'date_range']
    },
    // Motions
    {
        id: 'motion-contempt',
        name: 'Motion for Contempt',
        category: 'motion',
        description: 'Motion for court-ordered sanctions for non-compliance',
        icon: <Gavel className="w-5 h-5" />,
        jurisdictions: 'all',
        fields: ['debtor_name', 'violation_type', 'violation_date', 'sanctions_requested']
    },
    {
        id: 'motion-execution',
        name: 'Writ of Execution',
        category: 'motion',
        description: 'Writ for sheriff to levy and sell debtor property',
        icon: <Scale className="w-5 h-5" />,
        jurisdictions: 'all',
        fields: ['debtor_name', 'property_description', 'county', 'judgment_amount']
    },
    // Settlement
    {
        id: 'settlement-agreement',
        name: 'Settlement Agreement',
        category: 'settlement',
        description: 'Full settlement agreement with payment terms',
        icon: <FileCheck className="w-5 h-5" />,
        jurisdictions: 'all',
        fields: ['debtor_name', 'settlement_amount', 'payment_schedule', 'release_terms']
    },
    {
        id: 'settlement-stipulation',
        name: 'Stipulated Judgment',
        category: 'settlement',
        description: 'Court-approved payment plan with confession of judgment',
        icon: <Scale className="w-5 h-5" />,
        jurisdictions: 'all',
        fields: ['debtor_name', 'payment_terms', 'default_provisions']
    },
    {
        id: 'satisfaction-full',
        name: 'Satisfaction of Judgment',
        category: 'settlement',
        description: 'Full satisfaction document for court filing',
        icon: <CheckCircle className="w-5 h-5" />,
        jurisdictions: 'all',
        fields: ['debtor_name', 'case_number', 'satisfaction_date', 'amount_paid']
    },
    // Lien Documents
    {
        id: 'lien-judgment',
        name: 'Judgment Lien Certificate',
        category: 'lien',
        description: 'Certificate for recording judgment lien on property',
        icon: <FileText className="w-5 h-5" />,
        jurisdictions: 'all',
        fields: ['debtor_name', 'property_address', 'county', 'judgment_amount']
    },
    {
        id: 'lien-ucc1',
        name: 'UCC-1 Financing Statement',
        category: 'lien',
        description: 'UCC filing for personal property security interest',
        icon: <FileText className="w-5 h-5" />,
        jurisdictions: 'all',
        fields: ['debtor_name', 'collateral_description', 'filing_state']
    },
    // Domestication
    {
        id: 'domestication-tn',
        name: 'Tennessee Domestication Package',
        category: 'domestication',
        description: 'Complete package for domesticating FL judgment to TN',
        icon: <MapPin className="w-5 h-5" />,
        jurisdictions: ['TN'],
        fields: ['judgment_amount', 'judgment_date', 'fl_case_number', 'tn_county']
    },
    {
        id: 'domestication-in',
        name: 'Indiana Domestication Package',
        category: 'domestication',
        description: 'Complete package for domesticating FL judgment to IN',
        icon: <MapPin className="w-5 h-5" />,
        jurisdictions: ['IN'],
        fields: ['judgment_amount', 'judgment_date', 'fl_case_number', 'in_county']
    }
];

const CATEGORIES = [
    { id: 'all', label: 'All Documents', icon: FileText },
    { id: 'demand', label: 'Demand Letters', icon: Mail },
    { id: 'interrogatory', label: 'Interrogatories', icon: ClipboardList },
    { id: 'garnishment', label: 'Garnishment Writs', icon: Gavel },
    { id: 'subpoena', label: 'Subpoenas', icon: User },
    { id: 'motion', label: 'Motions', icon: Scale },
    { id: 'settlement', label: 'Settlement', icon: DollarSign },
    { id: 'lien', label: 'Liens', icon: FileText },
    { id: 'domestication', label: 'Domestication', icon: MapPin }
];

export default function DocumentsPage() {
    const { caseConfig, assetIntelligence, counsel, calculateInterest } = useData();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const filteredTemplates = selectedCategory === 'all'
        ? DOCUMENT_TEMPLATES
        : DOCUMENT_TEMPLATES.filter(t => t.category === selectedCategory);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);

    const handleGenerateDocument = (template: DocumentTemplate) => {
        setSelectedTemplate(template);
        setShowGenerateModal(true);
    };

    const generateDocumentContent = (template: DocumentTemplate, formData: Record<string, string>) => {
        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const interest = calculateInterest();
        const totalDue = caseConfig.judgmentAmount + interest;

        // Generate document based on template type
        switch (template.id) {
            case 'demand-initial':
                return `
DEMAND FOR PAYMENT

Date: ${today}

${formData.debtor_name || 'Management Services Holdings, LLC'}
${formData.debtor_address || '123 Commerce Way, Nashville, TN 37203'}

RE: Outstanding Judgment - Good Dogg Beverage Co. v. MSH
    Case No.: ${caseConfig.caseNumber || '05-2024-CA-050807'}
    Original Judgment: ${formatCurrency(caseConfig.judgmentAmount)}
    Interest Accrued: ${formatCurrency(interest)}
    TOTAL DUE: ${formatCurrency(totalDue)}

Dear Sir or Madam:

This office represents Good Dogg Beverage Co., LLC regarding the above-referenced judgment entered against you in the Circuit Court of Brevard County, Florida on ${new Date(caseConfig.judgmentDate).toLocaleDateString()}.

The judgment amount of ${formatCurrency(caseConfig.judgmentAmount)}, plus post-judgment interest at the statutory rate of ${caseConfig.interestRate}% per annum, currently totals ${formatCurrency(totalDue)} and continues to accrue daily.

DEMAND IS HEREBY MADE that you remit the full amount due within fifteen (15) days of the date of this letter to avoid further collection action.

If payment in full is not received, we will pursue all available legal remedies including, but not limited to:
• Wage garnishment
• Bank account levy
• Property liens and foreclosure
• Asset seizure and sale
• Debtor examination

Please contact this office immediately to discuss payment arrangements.

Sincerely,

_____________________________
Attorney for Plaintiff
Good Dogg Beverage Co., LLC
                `.trim();

            case 'demand-final':
                return `
FINAL DEMAND BEFORE ENFORCEMENT ACTION

Date: ${today}

VIA CERTIFIED MAIL - RETURN RECEIPT REQUESTED

${formData.debtor_name || 'Management Services Holdings, LLC'}
${formData.debtor_address || '123 Commerce Way, Nashville, TN 37203'}

RE: URGENT - Final Notice Before Enforcement
    Case No.: ${caseConfig.caseNumber || '05-2024-CA-050807'}
    TOTAL DUE: ${formatCurrency(totalDue)}

FINAL NOTICE:

Despite our previous correspondence, you have failed to satisfy the above-referenced judgment. This letter serves as your FINAL NOTICE before we commence aggressive enforcement action.

ENFORCEMENT ACTIONS TO BE INITIATED WITHIN SEVEN (7) DAYS:

1. WAGE GARNISHMENT - We will serve writs of garnishment on all known employers
2. BANK LEVY - All known bank accounts will be frozen and seized
3. PROPERTY LIENS - Judgment liens will be recorded against all real property
4. ASSET SEIZURE - The Sheriff will levy and sell business equipment and inventory
5. RECEIVERSHIP PETITION - We will seek appointment of a receiver over business operations
6. FRAUDULENT TRANSFER ACTION - Any asset transfers will be investigated and reversed

The total amount due is ${formatCurrency(totalDue)} and accrues at ${formatCurrency(interest / 365)} per day.

This is your FINAL opportunity to resolve this matter before we proceed with the above enforcement actions, which will significantly increase your costs and liability.

GOVERN YOURSELF ACCORDINGLY.

_____________________________
Attorney for Plaintiff
                `.trim();

            case 'garnishment-wage':
                return `
WRIT OF GARNISHMENT - WAGES

IN THE CIRCUIT COURT OF THE ${(formData.county || 'BREVARD').toUpperCase()} COUNTY, ${(formData.state || 'FLORIDA').toUpperCase()}

Case No.: ${caseConfig.caseNumber || '05-2024-CA-050807'}

GOOD DOGG BEVERAGE CO., LLC,
    Plaintiff/Judgment Creditor,

v.

MANAGEMENT SERVICES HOLDINGS, LLC,
    Defendant/Judgment Debtor.

${formData.employer_name || '[EMPLOYER NAME]'},
    Garnishee.
_____________________________________________/

WRIT OF GARNISHMENT

THE STATE OF FLORIDA TO: ${formData.employer_name || '[EMPLOYER NAME]'}
                         ${formData.employer_address || '[EMPLOYER ADDRESS]'}

YOU ARE COMMANDED to withhold from the earnings of:
    ${formData.debtor_name || 'Management Services Holdings, LLC'}

The amount of: ${formatCurrency(caseConfig.judgmentAmount + interest)}
Plus continuing interest at ${caseConfig.interestRate}% per annum

WITHHOLDING CALCULATION:
• 25% of disposable earnings, OR
• Amount by which weekly disposable earnings exceed 30 times federal minimum wage
• Whichever is LESS

You must begin withholding with the first pay period after service of this writ and continue until the judgment is satisfied or you receive further court order.

WITNESS my hand and seal this ${new Date().getDate()} day of ${new Date().toLocaleDateString('en-US', { month: 'long' })}, ${new Date().getFullYear()}.

_____________________________
CLERK OF COURT

By: ___________________________
    Deputy Clerk
                `.trim();

            case 'garnishment-bank':
                return `
WRIT OF GARNISHMENT - FINANCIAL INSTITUTION

IN THE CIRCUIT COURT OF BREVARD COUNTY, FLORIDA

Case No.: ${caseConfig.caseNumber || '05-2024-CA-050807'}

GOOD DOGG BEVERAGE CO., LLC,
    Plaintiff/Judgment Creditor,

v.

MANAGEMENT SERVICES HOLDINGS, LLC,
    Defendant/Judgment Debtor.

${formData.bank_name || '[BANK NAME]'},
    Garnishee.
_____________________________________________/

WRIT OF GARNISHMENT - BANK ACCOUNT

TO: ${formData.bank_name || '[BANK NAME]'}
    ${formData.bank_address || '[BANK ADDRESS]'}

YOU ARE COMMANDED:

1. Upon service of this writ, you shall freeze all accounts in the name of:
   ${formData.debtor_name || 'Management Services Holdings, LLC'}

2. Within 20 days, you shall file an answer with this Court stating:
   • Whether you hold any funds belonging to the judgment debtor
   • The amount of funds held
   • Any claims of exemption

3. The amount to be garnished is: ${formatCurrency(caseConfig.judgmentAmount + interest)}

4. You shall NOT release any funds to the judgment debtor until further order of this Court.

EXEMPTION NOTICE: Certain funds may be exempt from garnishment including Social Security benefits, VA benefits, and other protected deposits. A hearing may be requested.

WITNESS my hand and seal.

_____________________________
CLERK OF COURT
                `.trim();

            case 'motion-contempt':
                return `
MOTION FOR CONTEMPT AND SANCTIONS

IN THE CIRCUIT COURT OF BREVARD COUNTY, FLORIDA

Case No.: ${caseConfig.caseNumber || '05-2024-CA-050807'}

GOOD DOGG BEVERAGE CO., LLC,
    Plaintiff,

v.

MANAGEMENT SERVICES HOLDINGS, LLC,
    Defendant.
_____________________________________________/

PLAINTIFF'S MOTION FOR CONTEMPT AND SANCTIONS

Plaintiff, GOOD DOGG BEVERAGE CO., LLC, by and through undersigned counsel, moves this Court for an Order holding Defendant in contempt and imposing sanctions, and states:

1. On ${new Date(caseConfig.judgmentDate).toLocaleDateString()}, this Court entered a Final Judgment in favor of Plaintiff in the amount of ${formatCurrency(caseConfig.judgmentAmount)}.

2. Defendant was ordered to ${formData.violation_type || '[describe court order]'}.

3. On ${formData.violation_date || '[date]'}, Defendant failed to comply with this Court's Order by ${formData.violation_description || '[describe violation]'}.

4. Defendant's failure to comply is willful and without justification.

WHEREFORE, Plaintiff respectfully requests that this Court:

A. Find Defendant in contempt of Court;
B. Order Defendant to immediately comply;
C. Impose sanctions of ${formData.sanctions_requested || '$1,000.00'} per day until compliance;
D. Award Plaintiff attorney's fees and costs incurred in bringing this motion;
E. Issue a bench warrant for Defendant's representative if continued non-compliance; and
F. Grant such other relief as the Court deems just and proper.

CERTIFICATE OF SERVICE
I HEREBY CERTIFY that a true and correct copy of the foregoing was served via [email/mail] on ${today}.

_____________________________
Attorney for Plaintiff
                `.trim();

            case 'satisfaction-full':
                return `
SATISFACTION OF JUDGMENT

IN THE CIRCUIT COURT OF BREVARD COUNTY, FLORIDA

Case No.: ${caseConfig.caseNumber || '05-2024-CA-050807'}

GOOD DOGG BEVERAGE CO., LLC,
    Plaintiff,

v.

MANAGEMENT SERVICES HOLDINGS, LLC,
    Defendant.
_____________________________________________/

SATISFACTION OF JUDGMENT

GOOD DOGG BEVERAGE CO., LLC, the Judgment Creditor in the above-styled cause, hereby acknowledges:

1. A Final Judgment was entered in this cause on ${new Date(caseConfig.judgmentDate).toLocaleDateString()} in the original amount of ${formatCurrency(caseConfig.judgmentAmount)}.

2. The Judgment, together with all accrued interest, costs, and attorney's fees, has been FULLY SATISFIED.

3. The total amount received in satisfaction was: ${formData.amount_paid || formatCurrency(caseConfig.judgmentAmount + interest)}

4. This Satisfaction is filed as of: ${formData.satisfaction_date || today}

The Judgment Creditor hereby releases and discharges the Judgment Debtor from any and all further liability under said Judgment.

_____________________________
Plaintiff/Judgment Creditor
GOOD DOGG BEVERAGE CO., LLC

By: ___________________________

STATE OF FLORIDA
COUNTY OF BREVARD

Sworn to and subscribed before me this ____ day of ____________, 20___.

_____________________________
Notary Public
                `.trim();

            default:
                return `
DOCUMENT PREVIEW

Template: ${template.name}
Category: ${template.category}
Generated: ${today}

[This is a preview of the ${template.name} document. 
The full document will be generated with case-specific data.]

Case Number: ${caseConfig.caseNumber || '05-2024-CA-050807'}
Judgment Amount: ${formatCurrency(caseConfig.judgmentAmount)}
Interest Accrued: ${formatCurrency(interest)}
Total Due: ${formatCurrency(totalDue)}
                `.trim();
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FileText className="w-7 h-7 text-blue-400" />
                        Document Generation Suite
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Auto-generate legal documents with case data pre-populated
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">
                        {DOCUMENT_TEMPLATES.length} templates available
                    </span>
                </div>
            </div>

            {/* Category Filter */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-2 mb-6 overflow-x-auto">
                <div className="flex gap-1 min-w-max">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${selectedCategory === cat.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map(template => (
                    <div
                        key={template.id}
                        className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`p-2 rounded-lg ${template.category === 'demand' ? 'bg-amber-500/20 text-amber-400' :
                                    template.category === 'garnishment' ? 'bg-purple-500/20 text-purple-400' :
                                        template.category === 'motion' ? 'bg-red-500/20 text-red-400' :
                                            template.category === 'settlement' ? 'bg-emerald-500/20 text-emerald-400' :
                                                'bg-blue-500/20 text-blue-400'
                                }`}>
                                {template.icon}
                            </div>
                            {template.jurisdictions !== 'all' && (
                                <div className="flex gap-1">
                                    {template.jurisdictions.map(j => (
                                        <JurisdictionBadge key={j} jurisdiction={j} />
                                    ))}
                                </div>
                            )}
                        </div>

                        <h3 className="text-white font-semibold mb-2">{template.name}</h3>
                        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{template.description}</p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleGenerateDocument(template)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                Generate
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedTemplate(template);
                                    setGeneratedDoc(generateDocumentContent(template, {}));
                                    setShowPreview(true);
                                }}
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                                title="Preview"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Generation Stats */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{DOCUMENT_TEMPLATES.filter(t => t.category === 'demand').length}</div>
                    <div className="text-xs text-slate-500">Demand Letters</div>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{DOCUMENT_TEMPLATES.filter(t => t.category === 'garnishment').length}</div>
                    <div className="text-xs text-slate-500">Garnishment Writs</div>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{DOCUMENT_TEMPLATES.filter(t => t.category === 'motion').length}</div>
                    <div className="text-xs text-slate-500">Court Motions</div>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{DOCUMENT_TEMPLATES.filter(t => t.category === 'settlement').length}</div>
                    <div className="text-xs text-slate-500">Settlement Docs</div>
                </div>
            </div>

            {/* Generate Modal */}
            {selectedTemplate && (
                <GenerateDocumentModal
                    isOpen={showGenerateModal}
                    onClose={() => {
                        setShowGenerateModal(false);
                        setSelectedTemplate(null);
                    }}
                    template={selectedTemplate}
                    onGenerate={(formData) => {
                        const content = generateDocumentContent(selectedTemplate, formData);
                        setGeneratedDoc(content);
                        setShowGenerateModal(false);
                        setShowPreview(true);
                    }}
                />
            )}

            {/* Preview Modal */}
            {showPreview && generatedDoc && (
                <PreviewDocumentModal
                    isOpen={showPreview}
                    onClose={() => {
                        setShowPreview(false);
                        setGeneratedDoc(null);
                        setSelectedTemplate(null);
                    }}
                    content={generatedDoc}
                    templateName={selectedTemplate?.name || 'Document'}
                />
            )}
        </div>
    );
}

// Generate Document Modal
interface GenerateDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: DocumentTemplate;
    onGenerate: (formData: Record<string, string>) => void;
}

function GenerateDocumentModal({ isOpen, onClose, template, onGenerate }: GenerateDocumentModalProps) {
    const [formData, setFormData] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(formData);
    };

    const fieldLabels: Record<string, string> = {
        debtor_name: 'Debtor Name',
        debtor_address: 'Debtor Address',
        judgment_amount: 'Judgment Amount',
        interest_accrued: 'Interest Accrued',
        deadline: 'Payment Deadline (days)',
        prior_letter_date: 'Prior Letter Date',
        enforcement_actions: 'Enforcement Actions Planned',
        settlement_amount: 'Settlement Amount',
        discount_percentage: 'Discount Percentage',
        terms: 'Settlement Terms',
        case_number: 'Case Number',
        court: 'Court',
        judgment_date: 'Judgment Date',
        custom_questions: 'Custom Questions',
        employer_name: 'Employer Name',
        employer_address: 'Employer Address',
        garnishment_amount: 'Garnishment Amount',
        bank_name: 'Bank Name',
        bank_address: 'Bank Address',
        customer_name: 'Customer Name',
        customer_address: 'Customer Address',
        exam_date: 'Examination Date',
        exam_time: 'Examination Time',
        exam_location: 'Examination Location',
        documents_requested: 'Documents Requested',
        recipient_name: 'Recipient Name',
        recipient_address: 'Recipient Address',
        production_date: 'Production Date',
        account_holder: 'Account Holder',
        date_range: 'Date Range',
        violation_type: 'Violation Type',
        violation_date: 'Violation Date',
        violation_description: 'Violation Description',
        sanctions_requested: 'Sanctions Requested',
        property_description: 'Property Description',
        county: 'County',
        payment_schedule: 'Payment Schedule',
        release_terms: 'Release Terms',
        payment_terms: 'Payment Terms',
        default_provisions: 'Default Provisions',
        satisfaction_date: 'Satisfaction Date',
        amount_paid: 'Amount Paid',
        property_address: 'Property Address',
        collateral_description: 'Collateral Description',
        filing_state: 'Filing State',
        fl_case_number: 'Florida Case Number',
        tn_county: 'Tennessee County',
        in_county: 'Indiana County',
        state: 'State'
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Generate: ${template.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-slate-400 mb-4">
                    Fill in the fields below or leave blank to use default case data.
                </p>

                {template.fields.map(field => (
                    <div key={field}>
                        <label className="block text-sm text-slate-400 mb-1">
                            {fieldLabels[field] || field}
                        </label>
                        {field.includes('description') || field.includes('terms') || field.includes('questions') ? (
                            <textarea
                                value={formData[field] || ''}
                                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder={`Enter ${fieldLabels[field] || field}...`}
                            />
                        ) : (
                            <input
                                type={field.includes('date') ? 'date' : field.includes('amount') || field.includes('percentage') ? 'number' : 'text'}
                                value={formData[field] || ''}
                                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={`Enter ${fieldLabels[field] || field}...`}
                            />
                        )}
                    </div>
                ))}

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <FileText className="w-4 h-4" />
                        Generate Document
                    </button>
                </div>
            </form>
        </Modal>
    );
}

// Preview Document Modal
interface PreviewDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: string;
    templateName: string;
}

function PreviewDocumentModal({ isOpen, onClose, content, templateName }: PreviewDocumentModalProps) {
    const handleDownload = () => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${templateName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>${templateName}</title>
                        <style>
                            body { font-family: 'Times New Roman', serif; padding: 1in; line-height: 1.5; }
                            pre { white-space: pre-wrap; font-family: 'Times New Roman', serif; }
                        </style>
                    </head>
                    <body>
                        <pre>${content}</pre>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Preview: ${templateName}`} size="lg">
            <div className="space-y-4">
                <div className="bg-white text-black rounded-lg p-6 max-h-[60vh] overflow-y-auto font-mono text-sm">
                    <pre className="whitespace-pre-wrap">{content}</pre>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleDownload}
                        className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <FileText className="w-4 h-4" />
                        Print
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}
