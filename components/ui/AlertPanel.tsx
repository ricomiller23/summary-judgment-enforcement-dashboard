'use client';

import { Alert } from '@/lib/types';
import { AlertTriangle, Bell, CheckCircle, Clock, X, ChevronRight, DollarSign, FileText, Building2 } from 'lucide-react';

interface AlertPanelProps {
    alerts: Alert[];
    onDismiss: (id: string) => void;
    onSnooze: (id: string, until: string) => void;
    maxAlerts?: number;
    showSummary?: boolean;
}

const alertTypeConfig = {
    COURT: { icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    COLLECTION: { icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    ASSET_INTEL: { icon: AlertTriangle, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    FINANCIAL: { icon: DollarSign, color: 'text-[#C7A252]', bg: 'bg-[#C7A252]/10', border: 'border-[#C7A252]/30' },
    ADMINISTRATIVE: { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
};

const priorityConfig = {
    CRITICAL: { dot: 'bg-red-500', label: 'text-red-600', bg: 'bg-red-50' },
    IMPORTANT: { dot: 'bg-amber-500', label: 'text-amber-600', bg: 'bg-amber-50' },
    INFORMATIONAL: { dot: 'bg-blue-400', label: 'text-blue-600', bg: 'bg-blue-50' },
};

export function AlertPanel({ alerts, onDismiss, onSnooze, maxAlerts = 5, showSummary = false }: AlertPanelProps) {
    const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');
    const displayAlerts = activeAlerts.slice(0, maxAlerts);

    if (showSummary) {
        const criticalCount = activeAlerts.filter(a => a.priority === 'CRITICAL').length;
        const importantCount = activeAlerts.filter(a => a.priority === 'IMPORTANT').length;

        return (
            <div className="space-y-2">
                {criticalCount > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-red-600 font-semibold">{criticalCount} Critical</span>
                    </div>
                )}
                {importantCount > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-amber-600 font-semibold">{importantCount} Important</span>
                    </div>
                )}
                <div className="text-xs text-[#8a95a3]">{activeAlerts.length} total alerts</div>
            </div>
        );
    }

    if (displayAlerts.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-[#5a6a7a] font-medium">All caught up!</p>
                <p className="text-sm text-[#8a95a3]">No pending alerts</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {displayAlerts.map((alert) => {
                const typeConfig = alertTypeConfig[alert.type];
                const prioConfig = priorityConfig[alert.priority];
                const Icon = typeConfig.icon;

                return (
                    <div
                        key={alert.id}
                        className={`relative p-4 rounded-xl border ${typeConfig.border} ${typeConfig.bg} transition-all hover:shadow-md`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white shadow-sm`}>
                                <Icon className={`w-5 h-5 ${typeConfig.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`w-2 h-2 rounded-full ${prioConfig.dot}`} />
                                    <span className={`text-xs font-semibold uppercase tracking-wide ${prioConfig.label}`}>
                                        {alert.priority}
                                    </span>
                                </div>
                                <h4 className="font-semibold text-[#23313E] mb-1">{alert.title}</h4>
                                <p className="text-sm text-[#5a6a7a] line-clamp-2">{alert.description}</p>
                            </div>
                            <button
                                onClick={() => onDismiss(alert.id)}
                                className="p-1.5 hover:bg-white/80 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4 text-[#8a95a3]" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/50">
                            <button
                                onClick={() => onSnooze(alert.id, new Date(Date.now() + 60 * 60 * 1000).toISOString())}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#5a6a7a] hover:bg-white/80 rounded-lg transition-colors"
                            >
                                <Clock className="w-3 h-3" />
                                Snooze 1h
                            </button>
                            {alert.actionHref && (
                                <a
                                    href={alert.actionHref}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#C7A252] hover:bg-white/80 rounded-lg transition-colors ml-auto"
                                >
                                    {alert.actionLabel || 'View'} <ChevronRight className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                    </div>
                );
            })}

            {activeAlerts.length > maxAlerts && (
                <div className="text-center pt-2">
                    <button className="text-sm text-[#C7A252] hover:text-[#a88b43] font-medium">
                        View {activeAlerts.length - maxAlerts} more alerts
                    </button>
                </div>
            )}
        </div>
    );
}
