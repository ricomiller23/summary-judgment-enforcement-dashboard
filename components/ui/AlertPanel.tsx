'use client';

import { Alert, AlertPriority, AlertType } from '@/lib/types';
import {
    AlertTriangle,
    Scale,
    DollarSign,
    FileText,
    Settings,
    X,
    Clock,
    ChevronRight,
    Bell
} from 'lucide-react';
import Link from 'next/link';

interface AlertPanelProps {
    alerts: Alert[];
    onDismiss: (id: string) => void;
    onSnooze: (id: string, until: string) => void;
    maxAlerts?: number;
}

const priorityConfig: Record<AlertPriority, { color: string; bgColor: string; icon: string }> = {
    CRITICAL: {
        color: 'text-red-400',
        bgColor: 'bg-red-500/10 border-red-500/30',
        icon: '🔴'
    },
    IMPORTANT: {
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10 border-amber-500/30',
        icon: '🟡'
    },
    INFORMATIONAL: {
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10 border-blue-500/30',
        icon: '🔵'
    }
};

const typeIcons: Record<AlertType, React.ReactNode> = {
    COURT: <Scale className="w-4 h-4" />,
    COLLECTION: <DollarSign className="w-4 h-4" />,
    ASSET_INTEL: <AlertTriangle className="w-4 h-4" />,
    FINANCIAL: <DollarSign className="w-4 h-4" />,
    ADMINISTRATIVE: <Settings className="w-4 h-4" />
};

function getDaysUntil(dateStr?: string): string | null {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays}d`;
}

export function AlertPanel({ alerts, onDismiss, onSnooze, maxAlerts = 5 }: AlertPanelProps) {
    const activeAlerts = alerts
        .filter(a => a.status === 'ACTIVE')
        .sort((a, b) => {
            const priorityOrder = { CRITICAL: 0, IMPORTANT: 1, INFORMATIONAL: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        })
        .slice(0, maxAlerts);

    const criticalCount = alerts.filter(a => a.status === 'ACTIVE' && a.priority === 'CRITICAL').length;
    const importantCount = alerts.filter(a => a.status === 'ACTIVE' && a.priority === 'IMPORTANT').length;
    const infoCount = alerts.filter(a => a.status === 'ACTIVE' && a.priority === 'INFORMATIONAL').length;

    if (activeAlerts.length === 0) {
        return (
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Bell className="w-5 h-5 text-slate-400" />
                    <h3 className="text-lg font-semibold text-white">Alerts</h3>
                </div>
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell className="w-6 h-6 text-emerald-400" />
                    </div>
                    <p className="text-slate-400">No active alerts</p>
                    <p className="text-sm text-slate-500 mt-1">All caught up!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            {/* Header with counts */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-semibold text-white">Alerts</h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    {criticalCount > 0 && (
                        <span className="flex items-center gap-1 text-red-400">
                            🔴 {criticalCount}
                        </span>
                    )}
                    {importantCount > 0 && (
                        <span className="flex items-center gap-1 text-amber-400">
                            🟡 {importantCount}
                        </span>
                    )}
                    {infoCount > 0 && (
                        <span className="flex items-center gap-1 text-blue-400">
                            🔵 {infoCount}
                        </span>
                    )}
                </div>
            </div>

            {/* Alert list */}
            <div className="space-y-3">
                {activeAlerts.map((alert) => {
                    const config = priorityConfig[alert.priority];
                    const daysUntil = getDaysUntil(alert.dueDate);

                    return (
                        <div
                            key={alert.id}
                            className={`${config.bgColor} border rounded-lg p-4 relative group transition-all hover:border-opacity-60`}
                        >
                            {/* Dismiss button */}
                            <button
                                onClick={() => onDismiss(alert.id)}
                                className="absolute top-2 right-2 p-1 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Dismiss"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Alert content */}
                            <div className="flex items-start gap-3">
                                <div className={`${config.color} mt-0.5`}>
                                    {typeIcons[alert.type]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs">{config.icon}</span>
                                        <h4 className={`font-medium ${config.color} text-sm`}>
                                            {alert.title}
                                        </h4>
                                        {daysUntil && (
                                            <span className={`text-xs flex items-center gap-1 ${daysUntil.includes('overdue') ? 'text-red-400' : 'text-slate-400'
                                                }`}>
                                                <Clock className="w-3 h-3" />
                                                {daysUntil}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-400 line-clamp-2">
                                        {alert.description}
                                    </p>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-3 mt-3">
                                        {alert.actionHref && alert.actionLabel && (
                                            <Link
                                                href={alert.actionHref}
                                                className={`text-xs font-medium ${config.color} hover:underline flex items-center gap-1`}
                                            >
                                                {alert.actionLabel}
                                                <ChevronRight className="w-3 h-3" />
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                const tomorrow = new Date();
                                                tomorrow.setDate(tomorrow.getDate() + 1);
                                                onSnooze(alert.id, tomorrow.toISOString());
                                            }}
                                            className="text-xs text-slate-500 hover:text-slate-300"
                                        >
                                            Snooze 24h
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* View all link */}
            {alerts.filter(a => a.status === 'ACTIVE').length > maxAlerts && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                    <button className="text-sm text-blue-400 hover:text-blue-300 w-full text-center">
                        View all {alerts.filter(a => a.status === 'ACTIVE').length} alerts →
                    </button>
                </div>
            )}
        </div>
    );
}

// Compact version for dashboard sidebar
export function AlertSummary({ alerts }: { alerts: Alert[] }) {
    const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');
    const criticalCount = activeAlerts.filter(a => a.priority === 'CRITICAL').length;
    const importantCount = activeAlerts.filter(a => a.priority === 'IMPORTANT').length;
    const infoCount = activeAlerts.filter(a => a.priority === 'INFORMATIONAL').length;

    return (
        <div className="flex items-center gap-3">
            <Bell className={`w-5 h-5 ${criticalCount > 0 ? 'text-red-400' : 'text-slate-400'}`} />
            <div className="flex items-center gap-2 text-sm">
                {criticalCount > 0 && (
                    <span className="flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                        🔴 {criticalCount} Critical
                    </span>
                )}
                {importantCount > 0 && (
                    <span className="flex items-center gap-1 bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                        🟡 {importantCount}
                    </span>
                )}
                {infoCount > 0 && (
                    <span className="flex items-center gap-1 bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                        🔵 {infoCount}
                    </span>
                )}
                {activeAlerts.length === 0 && (
                    <span className="text-slate-500">No alerts</span>
                )}
            </div>
        </div>
    );
}
