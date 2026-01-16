'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import {
    MapPin, Scale, DollarSign, Clock, CheckCircle, Building2,
    ChevronRight, Calculator, Users, FileText, AlertTriangle
} from 'lucide-react';
import { Jurisdiction } from '@/lib/types';

const STATE_DATA: Record<string, {
    name: string;
    interestRate: number;
    homesteadExemption: string;
    wageExemption: string;
    processingTime: string;
    domesticationFee: string;
}> = {
    FL: { name: 'Florida', interestRate: 5.52, homesteadExemption: 'Unlimited', wageExemption: 'Head of household - 100%', processingTime: '7 days', domesticationFee: '$42' },
    TN: { name: 'Tennessee', interestRate: 10.00, homesteadExemption: '$5,000', wageExemption: '75% of wages', processingTime: '21 days', domesticationFee: '$150' },
    IN: { name: 'Indiana', interestRate: 8.00, homesteadExemption: '$22,750', wageExemption: '75% of wages', processingTime: '14 days', domesticationFee: '$75' },
    CO: { name: 'Colorado', interestRate: 8.00, homesteadExemption: '$105,000', wageExemption: '75% of wages', processingTime: '30 days', domesticationFee: '$100' },
};

export default function JurisdictionsPage() {
    const { caseConfig, calculateInterest } = useData();
    const [selectedState, setSelectedState] = useState<string>('FL');
    const [calculatorPrincipal, setCalculatorPrincipal] = useState(caseConfig.judgmentAmount);
    const [calculatorDays, setCalculatorDays] = useState(30);

    const calculateStateInterest = (state: string, principal: number, days: number) => {
        const rate = STATE_DATA[state].interestRate / 100;
        return (principal * rate * days) / 365;
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-[#23313E] flex items-center gap-3">
                        <MapPin className="w-8 h-8 text-[#C7A252]" />
                        Multi-Jurisdictional Enforcement
                    </h1>
                    <p className="text-[#5a6a7a] mt-1">State-specific requirements and enforcement rules</p>
                </div>

                {/* State Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {Object.entries(STATE_DATA).map(([code, data]) => (
                        <button
                            key={code}
                            onClick={() => setSelectedState(code)}
                            className={`p-4 rounded-xl border transition-all ${selectedState === code
                                    ? 'bg-[#C7A252] border-[#C7A252] text-[#23313E]'
                                    : 'bg-white border-[#E5E7EB] text-[#23313E] hover:border-[#C7A252]'
                                }`}
                        >
                            <div className="text-xl font-bold">{code}</div>
                            <div className={`text-sm ${selectedState === code ? 'text-[#23313E]/70' : 'text-[#5a6a7a]'}`}>{data.name}</div>
                            <div className={`text-lg font-semibold mt-1 ${selectedState === code ? '' : 'text-[#C7A252]'}`}>{data.interestRate}%</div>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* State Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Key Requirements */}
                        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#E5E7EB]">
                                <h3 className="font-semibold text-[#23313E] flex items-center gap-2">
                                    <Scale className="w-5 h-5 text-[#C7A252]" />
                                    {STATE_DATA[selectedState].name} Requirements
                                </h3>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-6">
                                <div className="p-4 bg-[#F8F9FA] rounded-xl">
                                    <div className="text-sm text-[#8a95a3] mb-1">Post-Judgment Interest Rate</div>
                                    <div className="text-2xl font-bold text-[#C7A252]">{STATE_DATA[selectedState].interestRate}%</div>
                                    <div className="text-xs text-[#5a6a7a] mt-1">Per annum</div>
                                </div>
                                <div className="p-4 bg-[#F8F9FA] rounded-xl">
                                    <div className="text-sm text-[#8a95a3] mb-1">Homestead Exemption</div>
                                    <div className="text-2xl font-bold text-[#23313E]">{STATE_DATA[selectedState].homesteadExemption}</div>
                                </div>
                                <div className="p-4 bg-[#F8F9FA] rounded-xl">
                                    <div className="text-sm text-[#8a95a3] mb-1">Wage Garnishment</div>
                                    <div className="text-lg font-semibold text-[#23313E]">{STATE_DATA[selectedState].wageExemption}</div>
                                </div>
                                <div className="p-4 bg-[#F8F9FA] rounded-xl">
                                    <div className="text-sm text-[#8a95a3] mb-1">Processing Time</div>
                                    <div className="text-lg font-semibold text-[#23313E]">{STATE_DATA[selectedState].processingTime}</div>
                                </div>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#E5E7EB]">
                                <h3 className="font-semibold text-[#23313E]">State Comparison</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-[#F8F9FA]">
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-[#8a95a3] uppercase tracking-wide">State</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-[#8a95a3] uppercase tracking-wide">Interest</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-[#8a95a3] uppercase tracking-wide">Homestead</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-[#8a95a3] uppercase tracking-wide">Dom. Fee</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(STATE_DATA).map(([code, data]) => (
                                            <tr
                                                key={code}
                                                className={`border-t border-[#E5E7EB] ${selectedState === code ? 'bg-[#C7A252]/10' : 'hover:bg-[#F8F9FA]'}`}
                                            >
                                                <td className="px-6 py-4">
                                                    <JurisdictionBadge jurisdiction={code as Jurisdiction} showFull />
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-[#C7A252]">{data.interestRate}%</td>
                                                <td className="px-6 py-4 text-[#23313E]">{data.homesteadExemption}</td>
                                                <td className="px-6 py-4 text-[#23313E]">{data.domesticationFee}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Calculator & Tools */}
                    <div className="space-y-6">
                        {/* Interest Calculator */}
                        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#E5E7EB]">
                                <h3 className="font-semibold text-[#23313E] flex items-center gap-2">
                                    <Calculator className="w-5 h-5 text-[#C7A252]" />
                                    Interest Calculator
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#23313E] mb-2">Principal Amount</label>
                                    <input
                                        type="number"
                                        value={calculatorPrincipal}
                                        onChange={(e) => setCalculatorPrincipal(Number(e.target.value))}
                                        className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E] focus:border-[#C7A252]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#23313E] mb-2">Days</label>
                                    <input
                                        type="number"
                                        value={calculatorDays}
                                        onChange={(e) => setCalculatorDays(Number(e.target.value))}
                                        className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[#23313E] focus:border-[#C7A252]"
                                    />
                                </div>
                                <div className="p-4 bg-[#C7A252]/15 rounded-xl">
                                    <div className="text-sm text-[#5a6a7a] mb-1">Interest ({STATE_DATA[selectedState].name})</div>
                                    <div className="text-2xl font-bold text-[#C7A252]">
                                        {formatCurrency(calculateStateInterest(selectedState, calculatorPrincipal, calculatorDays))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-[#23313E] rounded-xl overflow-hidden shadow-lg">
                            <div className="px-6 py-4 border-b border-[#2d3e4d]">
                                <h3 className="font-semibold text-white">Quick Actions</h3>
                            </div>
                            <div className="p-4 space-y-2">
                                <button className="w-full flex items-center gap-3 p-3 hover:bg-[#2d3e4d] rounded-lg transition-colors text-left">
                                    <FileText className="w-5 h-5 text-[#C7A252]" />
                                    <span className="text-white">Generate Domestication Package</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 hover:bg-[#2d3e4d] rounded-lg transition-colors text-left">
                                    <Users className="w-5 h-5 text-[#C7A252]" />
                                    <span className="text-white">Find Local Counsel</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
