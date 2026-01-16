'use client';

import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import {
    Building2,
    Landmark,
    Car,
    Briefcase,
    Users,
    Globe,
    TrendingUp,
    AlertTriangle,
    MapPin,
    Phone,
    Mail,
    Calendar,
    DollarSign,
    ArrowRight,
    ExternalLink,
    Shield,
    Target
} from 'lucide-react';

export default function AssetsPage() {
    const {
        assetIntelligence,
        getRecoveryProbability,
        getTotalKnownAssets,
        caseConfig
    } = useData();

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

    const getProbabilityColor = (score: number) => {
        if (score >= 70) return 'text-emerald-400';
        if (score >= 40) return 'text-amber-400';
        return 'text-red-400';
    };

    const getProbabilityBgColor = (score: number) => {
        if (score >= 70) return 'bg-emerald-500';
        if (score >= 40) return 'bg-amber-500';
        return 'bg-red-500';
    };

    if (!assetIntelligence) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-20">
                    <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">No Asset Intelligence Data</h2>
                    <p className="text-slate-400">Asset discovery has not been initiated for this case.</p>
                </div>
            </div>
        );
    }

    const ai = assetIntelligence;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Target className="w-7 h-7 text-blue-400" />
                        Asset Intelligence Hub
                    </h1>
                    <p className="text-slate-400 mt-1">Comprehensive debtor asset tracking and investigation</p>
                </div>
                <div className="text-xs text-slate-500">
                    Last updated: {new Date(ai.lastUpdated).toLocaleString()}
                </div>
            </div>

            {/* Recovery Probability + Key Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* Recovery Probability Gauge */}
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-sm font-medium text-slate-400 mb-4">Recovery Probability</h3>
                    <div className="relative w-32 h-32 mx-auto">
                        <svg className="w-32 h-32 transform -rotate-90">
                            <circle cx="64" cy="64" r="56" strokeWidth="10" fill="none" className="stroke-slate-700" />
                            <circle
                                cx="64" cy="64" r="56" strokeWidth="10" fill="none"
                                className={`stroke-current ${getProbabilityColor(ai.recoveryProbability.score)}`}
                                strokeLinecap="round"
                                strokeDasharray={`${ai.recoveryProbability.score * 3.52} 352`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className={`text-3xl font-bold ${getProbabilityColor(ai.recoveryProbability.score)}`}>
                                {ai.recoveryProbability.score}%
                            </span>
                            <span className="text-xs text-slate-500">{ai.recoveryProbability.confidence} confidence</span>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Asset Score</span>
                            <span className="text-white">{ai.recoveryProbability.factors.assetScore}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Liquidity</span>
                            <span className="text-white">{ai.recoveryProbability.factors.liquidityScore}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Cooperation</span>
                            <span className="text-white">{ai.recoveryProbability.factors.cooperationScore}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Legal Exposure</span>
                            <span className="text-white">{ai.recoveryProbability.factors.legalExposureScore}%</span>
                        </div>
                    </div>
                </div>

                {/* Key Stats */}
                <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                        <Building2 className="w-5 h-5 text-blue-400 mb-2" />
                        <div className="text-2xl font-bold text-white">{formatCurrency(getTotalKnownAssets)}</div>
                        <div className="text-xs text-slate-500">Total Known Assets</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                        <Landmark className="w-5 h-5 text-emerald-400 mb-2" />
                        <div className="text-2xl font-bold text-white">{ai.realProperty.length}</div>
                        <div className="text-xs text-slate-500">Properties Found</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                        <DollarSign className="w-5 h-5 text-amber-400 mb-2" />
                        <div className="text-2xl font-bold text-white">{ai.bankAccounts.length}</div>
                        <div className="text-xs text-slate-500">Bank Accounts</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                        <Briefcase className="w-5 h-5 text-purple-400 mb-2" />
                        <div className="text-2xl font-bold text-white">{ai.businessInterests.length}</div>
                        <div className="text-xs text-slate-500">Business Interests</div>
                    </div>
                </div>
            </div>

            {/* Debtor Profile */}
            <section className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-8">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Debtor Profile
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">{ai.debtorName}</h3>
                        {ai.ein && <p className="text-sm text-slate-400">EIN: {ai.ein}</p>}
                        <div className="mt-4 space-y-2">
                            {ai.currentAddress && (
                                <div className="flex items-start gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                                    <span className="text-slate-300">{ai.currentAddress}</span>
                                </div>
                            )}
                            {ai.phones.length > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-slate-500" />
                                    <span className="text-slate-300">{ai.phones[0]}</span>
                                </div>
                            )}
                            {ai.emails.length > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="w-4 h-4 text-slate-500" />
                                    <span className="text-slate-300">{ai.emails[0]}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-3">Known Associates</h4>
                        <ul className="space-y-2">
                            {ai.knownAssociates.map((associate, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                                    <Users className="w-3 h-3 text-slate-500" />
                                    {associate}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-3">Address History</h4>
                        <ul className="space-y-2">
                            {ai.addresses.slice(0, 3).map((addr, idx) => (
                                <li key={idx} className="text-sm">
                                    <div className="flex items-start gap-2">
                                        <MapPin className={`w-3 h-3 mt-0.5 ${addr.isCurrent ? 'text-emerald-400' : 'text-slate-500'}`} />
                                        <div>
                                            <span className="text-slate-300">{addr.address}, {addr.city}, {addr.state} {addr.zip}</span>
                                            {addr.verifiedDate && (
                                                <span className="text-xs text-slate-500 ml-2">
                                                    Verified: {addr.verifiedDate}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Real Property */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-emerald-400" />
                        Real Property
                    </h2>
                    <span className="text-sm text-slate-400">
                        Total Equity: {formatCurrency(ai.realProperty.reduce((sum, p) => sum + p.equity, 0))}
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ai.realProperty.map((property) => (
                        <div key={property.id} className="bg-slate-900 border border-slate-700 rounded-xl p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-medium text-white">{property.address}</h3>
                                    <p className="text-sm text-slate-400">{property.county} County, {property.state}</p>
                                </div>
                                <JurisdictionBadge jurisdiction={property.state} />
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div>
                                    <div className="text-xs text-slate-500">Assessed Value</div>
                                    <div className="text-lg font-semibold text-white">{formatCurrency(property.assessedValue)}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500">Mortgage</div>
                                    <div className="text-lg font-semibold text-red-400">-{formatCurrency(property.mortgageBalance)}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500">Equity</div>
                                    <div className="text-lg font-semibold text-emerald-400">{formatCurrency(property.equity)}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs">
                                {property.homesteadExemption ? (
                                    <span className="flex items-center gap-1 text-amber-400">
                                        <Shield className="w-3 h-3" />
                                        Homestead Exempt
                                    </span>
                                ) : (
                                    <span className="text-slate-500">No Homestead</span>
                                )}
                                {property.lienFiled ? (
                                    <span className="flex items-center gap-1 text-emerald-400">
                                        ✓ Lien Filed {property.lienFileDate}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-red-400">
                                        ⚠ No Lien Filed
                                    </span>
                                )}
                            </div>

                            {property.transferHistory.length > 0 && (
                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <div className="flex items-center gap-2 text-red-400 text-sm mb-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span className="font-medium">Suspicious Transfer Detected</span>
                                    </div>
                                    {property.transferHistory.filter(t => t.suspicious).map((transfer, idx) => (
                                        <div key={idx} className="text-xs text-slate-400">
                                            Transferred to {transfer.toWhom} on {transfer.date} for ${transfer.consideration}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button className="mt-4 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                File Judgment Lien <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bank Accounts */}
            <section className="mb-8">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    Bank Accounts
                </h2>
                <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left text-xs font-medium text-slate-400 p-4">Institution</th>
                                <th className="text-left text-xs font-medium text-slate-400 p-4">Type</th>
                                <th className="text-left text-xs font-medium text-slate-400 p-4">Status</th>
                                <th className="text-right text-xs font-medium text-slate-400 p-4">Balance</th>
                                <th className="text-right text-xs font-medium text-slate-400 p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ai.bankAccounts.map((account) => {
                                const statusColors: Record<string, string> = {
                                    confirmed: 'bg-emerald-500/20 text-emerald-400',
                                    suspected: 'bg-amber-500/20 text-amber-400',
                                    garnished: 'bg-blue-500/20 text-blue-400',
                                    closed: 'bg-slate-500/20 text-slate-400'
                                };
                                return (
                                    <tr key={account.id} className="border-b border-slate-800">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{account.institution}</div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-400 capitalize">{account.accountType}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs capitalize ${statusColors[account.status]}`}>
                                                {account.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {account.lastKnownBalance ? (
                                                <span className="font-semibold text-white">
                                                    {formatCurrency(account.lastKnownBalance)}
                                                </span>
                                            ) : (
                                                <span className="text-slate-500">Unknown</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-sm text-blue-400 hover:text-blue-300">
                                                Issue Levy
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Vehicles */}
            <section className="mb-8">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <Car className="w-5 h-5 text-blue-400" />
                    Vehicles & Equipment
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ai.vehicles.map((vehicle) => (
                        <div key={vehicle.id} className="bg-slate-900 border border-slate-700 rounded-xl p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-medium text-white">{vehicle.year} {vehicle.makeModel}</h3>
                                    <p className="text-xs text-slate-500 font-mono">VIN: {vehicle.vin}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs capitalize ${vehicle.status === 'located' ? 'bg-emerald-500/20 text-emerald-400' :
                                        vehicle.status === 'seized' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-slate-500/20 text-slate-400'
                                    }`}>
                                    {vehicle.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div>
                                    <div className="text-xs text-slate-500">Value</div>
                                    <div className="font-semibold text-white">{formatCurrency(vehicle.estimatedValue)}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500">Loan</div>
                                    <div className="font-semibold text-red-400">
                                        {vehicle.loanBalance > 0 ? `-${formatCurrency(vehicle.loanBalance)}` : '$0'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500">Equity</div>
                                    <div className="font-semibold text-emerald-400">
                                        {formatCurrency(vehicle.estimatedValue - vehicle.loanBalance)}
                                    </div>
                                </div>
                            </div>
                            {vehicle.lienholder && (
                                <div className="mt-3 text-xs text-slate-500">
                                    Lienholder: {vehicle.lienholder}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Business Interests */}
            <section className="mb-8">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <Briefcase className="w-5 h-5 text-purple-400" />
                    Business Interests
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ai.businessInterests.map((business) => (
                        <div key={business.id} className="bg-slate-900 border border-slate-700 rounded-xl p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-medium text-white">{business.entityName}</h3>
                                    <p className="text-sm text-slate-400">{business.entityType} • {business.stateOfFormation}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs capitalize ${business.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                                        'bg-red-500/20 text-red-400'
                                    }`}>
                                    {business.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div>
                                    <div className="text-xs text-slate-500">Ownership</div>
                                    <div className="font-semibold text-white">{business.ownershipPct}%</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500">Est. Revenue</div>
                                    <div className="font-semibold text-white">
                                        {business.annualRevenueEstimate
                                            ? formatCurrency(business.annualRevenueEstimate)
                                            : 'Unknown'}
                                    </div>
                                </div>
                            </div>
                            {business.keyCustomers.length > 0 && (
                                <div>
                                    <div className="text-xs text-slate-500 mb-2">Key Customers (A/R Garnishment Targets)</div>
                                    <div className="flex flex-wrap gap-2">
                                        {business.keyCustomers.map((customer, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">
                                                {customer}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <button className="mt-4 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                File Charging Order <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Other Creditors */}
            <section className="mb-8">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-red-400" />
                    Other Creditors (Lien Priority)
                </h2>
                <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left text-xs font-medium text-slate-400 p-4">Priority</th>
                                <th className="text-left text-xs font-medium text-slate-400 p-4">Creditor</th>
                                <th className="text-left text-xs font-medium text-slate-400 p-4">Lien Date</th>
                                <th className="text-left text-xs font-medium text-slate-400 p-4">Secured By</th>
                                <th className="text-right text-xs font-medium text-slate-400 p-4">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ai.otherCreditors.sort((a, b) => a.priorityPosition - b.priorityPosition).map((creditor) => (
                                <tr key={creditor.id} className="border-b border-slate-800">
                                    <td className="p-4">
                                        <span className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-xs text-slate-400">
                                            {creditor.priorityPosition}
                                        </span>
                                    </td>
                                    <td className="p-4 font-medium text-white">{creditor.creditorName}</td>
                                    <td className="p-4 text-sm text-slate-400">{creditor.lienDate}</td>
                                    <td className="p-4 text-sm text-slate-400">{creditor.securedBy}</td>
                                    <td className="p-4 text-right font-semibold text-white">{formatCurrency(creditor.amount)}</td>
                                </tr>
                            ))}
                            <tr className="bg-blue-500/10">
                                <td className="p-4">
                                    <span className="w-6 h-6 bg-blue-500/30 rounded-full flex items-center justify-center text-xs text-blue-400">
                                        {ai.otherCreditors.length + 1}
                                    </span>
                                </td>
                                <td className="p-4 font-medium text-blue-400">Good Dogg Beverage Co. (You)</td>
                                <td className="p-4 text-sm text-blue-400">Pending</td>
                                <td className="p-4 text-sm text-blue-400">—</td>
                                <td className="p-4 text-right font-semibold text-blue-400">{formatCurrency(caseConfig.judgmentAmount)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    ⚠️ Filing judgment liens now will improve your priority position for future recoveries.
                </p>
            </section>

            {/* Social Intelligence */}
            <section>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-pink-400" />
                    Social Media Intelligence
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ai.socialIntel.map((intel) => (
                        <div key={intel.id} className="bg-slate-900 border border-slate-700 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-medium text-white">{intel.platform}</span>
                                <span className={`px-2 py-1 rounded text-xs ${intel.relevance === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                                        intel.relevance === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                                            'bg-slate-500/20 text-slate-400'
                                    }`}>
                                    {intel.relevance}
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 mb-3">{intel.notes}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">{intel.datePosted}</span>
                                <a
                                    href={intel.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                >
                                    View <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
