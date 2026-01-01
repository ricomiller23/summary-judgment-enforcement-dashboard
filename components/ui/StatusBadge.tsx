import { TaskStatus } from '@/lib/types';

const statusConfig: Record<TaskStatus, { bg: string; text: string; label: string }> = {
    BACKLOG: { bg: 'bg-slate-600/30', text: 'text-slate-400', label: 'Backlog' },
    THIS_WEEK: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'This Week' },
    IN_PROGRESS: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'In Progress' },
    WAITING: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Waiting' },
    DONE: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Done' },
};

interface StatusBadgeProps {
    status: TaskStatus;
    size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const config = statusConfig[status];
    const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs';

    return (
        <span className={`inline-flex items-center font-medium rounded-md ${config.bg} ${config.text} ${sizeClasses}`}>
            {config.label}
        </span>
    );
}
