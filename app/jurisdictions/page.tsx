'use client';

import { useState, useMemo } from 'react';
import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import {
    MapPin,
    Scale,
    DollarSign,
    Clock,
    FileText,
    Calculator,
    Users,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Building2,
    Info,
    Star,
    Briefcase
} from 'lucide-react';

// State requirements database
interface StateRequirements {
    code: string;
    name: string;
    domesticationMethod: 'UEFJA' | 'COMMON_LAW';
    filingFee: number;
    serviceFee: number;
    statuteOfLimitations: number; // years
    judgmentRenewalPeriod: number; // years
    interestRate: number; // percentage
    interestMethod: 'simple' | 'compound';
    wageGarnishmentLimit: string;
    homesteadExemption: string;
    vehicleExemption: number;
    bankExemption: number;
    headOfHouseholdProtection: boolean;
    averageProcessingDays: number;
    efficiencyRating: 'fast' | 'medium' | 'slow';
    notes: string[];
}

const STATE_DATABASE: StateRequirements[] = [
    {
        code: 'FL',
        name: 'Florida',
        domesticationMethod: 'UEFJA',
        filingFee: 400,
        serviceFee: 40,
        statuteOfLimitations: 20,
        judgmentRenewalPeriod: 20,
        interestRate: 5.52,
        interestMethod: 'simple',
        wageGarnishmentLimit: '25% of disposable earnings or amount exceeding 30x federal min wage',
        homesteadExemption: 'Unlimited (constitutional protection)',
        vehicleExemption: 1000,
        bankExemption: 1000,
        headOfHouseholdProtection: true,
        averageProcessingDays: 7,
        efficiencyRating: 'fast',
        notes: ['Head of household exemption waivable in writing', 'Strong judgment creditor state']
    },
    {
        code: 'TN',
        name: 'Tennessee',
        domesticationMethod: 'UEFJA',
        filingFee: 350,
        serviceFee: 50,
        statuteOfLimitations: 10,
        judgmentRenewalPeriod: 10,
        interestRate: 10,
        interestMethod: 'simple',
        wageGarnishmentLimit: '25% of disposable earnings or amount exceeding 30x federal min wage',
        homesteadExemption: '$5,000 individual / $7,500 joint',
        vehicleExemption: 0,
        bankExemption: 0,
        headOfHouseholdProtection: false,
        averageProcessingDays: 21,
        efficiencyRating: 'medium',
        notes: ['Must file in county where debtor resides or where property located', 'No head of household protection']
    },
    {
        code: 'IN',
        name: 'Indiana',
        domesticationMethod: 'UEFJA',
        filingFee: 275,
        serviceFee: 45,
        statuteOfLimitations: 20,
        judgmentRenewalPeriod: 20,
        interestRate: 8,
        interestMethod: 'simple',
        wageGarnishmentLimit: '25% of disposable earnings or amount exceeding 30x federal min wage',
        homesteadExemption: '$19,300',
        vehicleExemption: 10250,
        bankExemption: 400,
        headOfHouseholdProtection: false,
        averageProcessingDays: 14,
        efficiencyRating: 'medium',
        notes: ['Property exemption applies to real or personal property', 'Reasonable vehicle exemption']
    },
    {
        code: 'CO',
        name: 'Colorado',
        domesticationMethod: 'UEFJA',
        filingFee: 323,
        serviceFee: 65,
        statuteOfLimitations: 20,
        judgmentRenewalPeriod: 20,
        interestRate: 8,
        interestMethod: 'simple',
        wageGarnishmentLimit: '25% of disposable earnings, min 40x CO min wage protected',
        homesteadExemption: '$75,000 - $105,000',
        vehicleExemption: 15000,
        bankExemption: 0,
        headOfHouseholdProtection: false,
        averageProcessingDays: 28,
        efficiencyRating: 'slow',
        notes: ['Higher homestead but no head of household protection', 'Good vehicle exemption']
    },
    {
        code: 'CA',
        name: 'California',
        domesticationMethod: 'UEFJA',
        filingFee: 465,
        serviceFee: 75,
        statuteOfLimitations: 10,
        judgmentRenewalPeriod: 10,
        interestRate: 10,
        interestMethod: 'simple',
        wageGarnishmentLimit: '25% of disposable earnings, min 40x CA min wage protected',
        homesteadExemption: '$300,000 - $600,000',
        vehicleExemption: 3325,
        bankExemption: 1826,
        headOfHouseholdProtection: false,
        averageProcessingDays: 35,
        efficiencyRating: 'slow',
        notes: ['Very high homestead exemption', 'Complex local rules', 'Debtor-friendly state']
    },
    {
        code: 'TX',
        name: 'Texas',
        domesticationMethod: 'UEFJA',
        filingFee: 380,
        serviceFee: 85,
        statuteOfLimitations: 10,
        judgmentRenewalPeriod: 10,
        interestRate: 5,
        interestMethod: 'simple',
        wageGarnishmentLimit: 'No wage garnishment for most debts',
        homesteadExemption: 'Unlimited (up to 10 acres urban, 200 acres rural)',
        vehicleExemption: 60000,
        bankExemption: 0,
        headOfHouseholdProtection: true,
        averageProcessingDays: 30,
        efficiencyRating: 'slow',
        notes: ['NO WAGE GARNISHMENT for consumer debts', 'Extremely debtor-friendly', 'Unlimited homestead']
    },
    {
        code: 'NY',
        name: 'New York',
        domesticationMethod: 'UEFJA',
        filingFee: 420,
        serviceFee: 65,
        statuteOfLimitations: 20,
        judgmentRenewalPeriod: 20,
        interestRate: 9,
        interestMethod: 'simple',
        wageGarnishmentLimit: '10% of gross wages or 25% of disposable, whichever is less',
        homesteadExemption: '$165,550 - $331,100',
        vehicleExemption: 4550,
        bankExemption: 3600,
        headOfHouseholdProtection: false,
        averageProcessingDays: 21,
        efficiencyRating: 'medium',
        notes: ['Income execution (wage garnishment) has stricter limits', 'County-specific procedures']
    },
    {
        code: 'GA',
        name: 'Georgia',
        domesticationMethod: 'UEFJA',
        filingFee: 290,
        serviceFee: 50,
        statuteOfLimitations: 7,
        judgmentRenewalPeriod: 7,
        interestRate: 7,
        interestMethod: 'simple',
        wageGarnishmentLimit: '25% of disposable earnings or amount exceeding 30x federal min wage',
        homesteadExemption: '$21,500',
        vehicleExemption: 5000,
        bankExemption: 0,
        headOfHouseholdProtection: true,
        averageProcessingDays: 14,
        efficiencyRating: 'fast',
        notes: ['Shorter statute of limitations - renew early', 'Head of household protection available']
    }
];

export default function JurisdictionsPage() {
    const { caseConfig, calculateInterest, tasks, enforcementActions } = useData();
    const [selectedState, setSelectedState] = useState<string>('FL');
    const [compareStates, setCompareStates] = useState<string[]>(['FL', 'TN']);
    const [activeTab, setActiveTab] = useState<'requirements' | 'calculator' | 'compare' | 'counsel'>('requirements');

    const currentState = STATE_DATABASE.find(s => s.code === selectedState) || STATE_DATABASE[0];

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

    // Interest calculator
    const [calcDays, setCalcDays] = useState(365);
    const calculateStateInterest = (state: StateRequirements, days: number) => {
        const principal = caseConfig.judgmentAmount;
        const rate = state.interestRate / 100;
        return principal * rate * (days / 365);
    };

    // Get domestication tasks by state
    const getDomesticationProgress = (stateCode: string) => {
        const stateTasks = tasks.filter(t =>
            t.jurisdiction === stateCode &&
            t.category === 'DOMESTICATION'
        );
        const completed = stateTasks.filter(t => t.status === 'DONE').length;
        const total = stateTasks.length;
        return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <MapPin className="w-7 h-7 text-blue-400" />
                        Multi-Jurisdictional Enforcement
                    </h1>
                    <p className="text-slate-400 mt-1">
                        50-state enforcement playbook with requirements and exemptions
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-slate-700">
                {[
                    { id: 'requirements', label: 'State Requirements', icon: FileText },
                    { id: 'calculator', label: 'Interest Calculator', icon: Calculator },
                    { id: 'compare', label: 'Compare States', icon: Scale },
                    { id: 'counsel', label: 'Local Counsel', icon: Users }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                ? 'text-blue-400'
                                : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
                        )}
                    </button>
                ))}
            </div>

            {/* State Selector */}
            <div className="flex gap-3 mb-6">
                <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {STATE_DATABASE.map(state => (
                        <option key={state.code} value={state.code}>
                            {state.name} ({state.code})
                        </option>
                    ))}
                </select>
                {activeTab === 'requirements' && (
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${currentState.efficiencyRating === 'fast' ? 'bg-emerald-500/20 text-emerald-400' :
                                currentState.efficiencyRating === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                    'bg-red-500/20 text-red-400'
                            }`}>
                            {currentState.efficiencyRating.toUpperCase()} Court
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-sm text-slate-400">
                            ~{currentState.averageProcessingDays} days processing
                        </span>
                    </div>
                )}
            </div>

            {activeTab === 'requirements' && (
                <div className="space-y-6">
                    {/* Key Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Scale className="w-4 h-4 text-blue-400" />
                                <span className="text-xs text-slate-500">Domestication</span>
                            </div>
                            <div className="text-lg font-bold text-white">{currentState.domesticationMethod}</div>
                            <div className="text-xs text-slate-500">Method</div>
                        </div>
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs text-slate-500">Filing Fee</span>
                            </div>
                            <div className="text-lg font-bold text-emerald-400">{formatCurrency(currentState.filingFee)}</div>
                            <div className="text-xs text-slate-500">+ {formatCurrency(currentState.serviceFee)} service</div>
                        </div>
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-amber-400" />
                                <span className="text-xs text-slate-500">Interest Rate</span>
                            </div>
                            <div className="text-lg font-bold text-amber-400">{currentState.interestRate}%</div>
                            <div className="text-xs text-slate-500">{currentState.interestMethod} interest</div>
                        </div>
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-purple-400" />
                                <span className="text-xs text-slate-500">SOL / Renewal</span>
                            </div>
                            <div className="text-lg font-bold text-purple-400">{currentState.statuteOfLimitations} yrs</div>
                            <div className="text-xs text-slate-500">renew every {currentState.judgmentRenewalPeriod} yrs</div>
                        </div>
                    </div>

                    {/* Exemptions */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-700">
                            <h3 className="font-semibold text-white">Exemptions & Protections</h3>
                        </div>
                        <div className="divide-y divide-slate-800">
                            <div className="p-4 flex justify-between items-start">
                                <div>
                                    <div className="text-sm font-medium text-white">Wage Garnishment</div>
                                    <div className="text-xs text-slate-500 mt-1">{currentState.wageGarnishmentLimit}</div>
                                </div>
                                {currentState.code === 'TX' && (
                                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">NO GARNISHMENT</span>
                                )}
                            </div>
                            <div className="p-4 flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-medium text-white">Homestead Exemption</div>
                                    <div className="text-xs text-slate-500 mt-1">{currentState.homesteadExemption}</div>
                                </div>
                                {currentState.homesteadExemption.includes('Unlimited') && (
                                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">UNLIMITED</span>
                                )}
                            </div>
                            <div className="p-4 flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-medium text-white">Vehicle Exemption</div>
                                </div>
                                <span className="text-sm text-white">{formatCurrency(currentState.vehicleExemption)}</span>
                            </div>
                            <div className="p-4 flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-medium text-white">Bank Account Exemption</div>
                                </div>
                                <span className="text-sm text-white">{formatCurrency(currentState.bankExemption)}</span>
                            </div>
                            <div className="p-4 flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-medium text-white">Head of Household Protection</div>
                                </div>
                                {currentState.headOfHouseholdProtection ? (
                                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" /> YES
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> NO
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {currentState.notes.length > 0 && (
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                <Info className="w-4 h-4 text-blue-400" />
                                Important Notes for {currentState.name}
                            </h3>
                            <ul className="space-y-2">
                                {currentState.notes.map((note, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                                        <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                        {note}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'calculator' && (
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-blue-400" />
                            Post-Judgment Interest Calculator
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Principal Judgment Amount</label>
                                    <div className="text-2xl font-bold text-white">
                                        {formatCurrency(caseConfig.judgmentAmount)}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Days Since Judgment</label>
                                    <input
                                        type="number"
                                        value={calcDays}
                                        onChange={(e) => setCalcDays(parseInt(e.target.value) || 0)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">State Interest Rate</label>
                                    <div className="text-lg font-semibold text-amber-400">
                                        {currentState.interestRate}% per annum ({currentState.interestMethod})
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800 rounded-xl p-6">
                                <div className="text-sm text-slate-500 mb-2">Interest Accrued</div>
                                <div className="text-3xl font-bold text-emerald-400 mb-4">
                                    {formatCurrency(calculateStateInterest(currentState, calcDays))}
                                </div>

                                <div className="text-sm text-slate-500 mb-2">Total Amount Due</div>
                                <div className="text-3xl font-bold text-white">
                                    {formatCurrency(caseConfig.judgmentAmount + calculateStateInterest(currentState, calcDays))}
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-700">
                                    <div className="text-sm text-slate-500 mb-1">Daily Interest Accrual</div>
                                    <div className="text-lg font-semibold text-amber-400">
                                        +{formatCurrency(caseConfig.judgmentAmount * (currentState.interestRate / 100) / 365)}/day
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compare Interest by State */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4">Interest Comparison (After {calcDays} Days)</h3>
                        <div className="space-y-3">
                            {STATE_DATABASE.slice(0, 8).map(state => {
                                const interest = calculateStateInterest(state, calcDays);
                                const total = caseConfig.judgmentAmount + interest;
                                const maxTotal = caseConfig.judgmentAmount + calculateStateInterest(STATE_DATABASE.reduce((a, b) => a.interestRate > b.interestRate ? a : b), calcDays);
                                const percentage = (total / maxTotal) * 100;

                                return (
                                    <div key={state.code} className="flex items-center gap-4">
                                        <div className="w-8">
                                            <JurisdictionBadge jurisdiction={state.code as any} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm text-slate-400">{state.name}</span>
                                                <span className="text-sm text-white">{state.interestRate}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-600 to-emerald-400 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-32 text-right">
                                            <span className="text-sm font-semibold text-emerald-400">
                                                {formatCurrency(interest)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'compare' && (
                <div className="space-y-6">
                    {/* State Selector for Comparison */}
                    <div className="flex gap-3">
                        <select
                            value={compareStates[0]}
                            onChange={(e) => setCompareStates([e.target.value, compareStates[1]])}
                            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                        >
                            {STATE_DATABASE.map(s => (
                                <option key={s.code} value={s.code}>{s.name}</option>
                            ))}
                        </select>
                        <span className="text-slate-500 flex items-center">vs</span>
                        <select
                            value={compareStates[1]}
                            onChange={(e) => setCompareStates([compareStates[0], e.target.value])}
                            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                        >
                            {STATE_DATABASE.map(s => (
                                <option key={s.code} value={s.code}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Comparison Table */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left text-sm font-medium text-slate-400 p-4">Category</th>
                                    {compareStates.map(code => {
                                        const state = STATE_DATABASE.find(s => s.code === code)!;
                                        return (
                                            <th key={code} className="text-center text-sm font-medium text-white p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <JurisdictionBadge jurisdiction={code as any} />
                                                    {state.name}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {[
                                    { label: 'Filing Fee', key: 'filingFee', format: 'currency' },
                                    { label: 'Interest Rate', key: 'interestRate', format: 'percent' },
                                    { label: 'SOL (Years)', key: 'statuteOfLimitations', format: 'number' },
                                    { label: 'Processing Time', key: 'averageProcessingDays', format: 'days' },
                                    { label: 'Homestead', key: 'homesteadExemption', format: 'text' },
                                    { label: 'Vehicle Exemption', key: 'vehicleExemption', format: 'currency' },
                                    { label: 'Head of Household', key: 'headOfHouseholdProtection', format: 'boolean' },
                                    { label: 'Efficiency', key: 'efficiencyRating', format: 'text' }
                                ].map(row => (
                                    <tr key={row.key}>
                                        <td className="p-4 text-sm text-slate-400">{row.label}</td>
                                        {compareStates.map(code => {
                                            const state = STATE_DATABASE.find(s => s.code === code)!;
                                            const value = state[row.key as keyof StateRequirements];
                                            let displayValue: React.ReactNode;

                                            if (row.format === 'currency') {
                                                displayValue = formatCurrency(value as number);
                                            } else if (row.format === 'percent') {
                                                displayValue = `${value}%`;
                                            } else if (row.format === 'days') {
                                                displayValue = `${value} days`;
                                            } else if (row.format === 'boolean') {
                                                displayValue = value ? (
                                                    <span className="text-amber-400">Yes</span>
                                                ) : (
                                                    <span className="text-emerald-400">No</span>
                                                );
                                            } else {
                                                displayValue = String(value);
                                            }

                                            return (
                                                <td key={code} className="p-4 text-center text-sm text-white">
                                                    {displayValue}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'counsel' && (
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            Local Counsel Directory - {currentState.name}
                        </h3>

                        <div className="space-y-4">
                            {/* Sample counsel entries */}
                            {[
                                { name: 'Smith & Associates', specialty: 'Collections', rating: 4.8, cases: 127, fee: 'Contingency 33%' },
                                { name: 'Johnson Legal Group', specialty: 'Judgment Enforcement', rating: 4.5, cases: 89, fee: '$350/hr' },
                                { name: 'Williams Collection Law', specialty: 'Commercial Collections', rating: 4.7, cases: 203, fee: 'Contingency 30%' }
                            ].map((counsel, i) => (
                                <div key={i} className="bg-slate-800 rounded-xl p-4 hover:bg-slate-700/50 transition-colors cursor-pointer">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-medium text-white">{counsel.name}</h4>
                                            <p className="text-sm text-slate-400 mt-1">{counsel.specialty}</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="flex items-center gap-1 text-sm text-amber-400">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    {counsel.rating}
                                                </span>
                                                <span className="text-sm text-slate-500">{counsel.cases} cases</span>
                                                <span className="text-sm text-emerald-400">{counsel.fee}</span>
                                            </div>
                                        </div>
                                        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg">
                                            Contact
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 text-center">
                            <button className="text-blue-400 hover:text-blue-300 text-sm">
                                View all counsel in {currentState.name} →
                            </button>
                        </div>
                    </div>

                    {/* Filing Fee Calculator */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-emerald-400" />
                            Domestication Cost Estimate - {currentState.name}
                        </h3>

                        <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b border-slate-800">
                                <span className="text-slate-400">Filing Fee</span>
                                <span className="text-white">{formatCurrency(currentState.filingFee)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-800">
                                <span className="text-slate-400">Service of Process</span>
                                <span className="text-white">{formatCurrency(currentState.serviceFee)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-800">
                                <span className="text-slate-400">Certified Copy (Origin State)</span>
                                <span className="text-white">{formatCurrency(50)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-800">
                                <span className="text-slate-400">Local Counsel Retainer (Est.)</span>
                                <span className="text-white">{formatCurrency(1500)}</span>
                            </div>
                            <div className="flex justify-between py-3 font-semibold">
                                <span className="text-white">Total Estimated Cost</span>
                                <span className="text-emerald-400">
                                    {formatCurrency(currentState.filingFee + currentState.serviceFee + 50 + 1500)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
