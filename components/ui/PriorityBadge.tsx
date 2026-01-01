import { Priority } from '@/lib/types';

const priorityColors: Record<Priority, { bg: string; text: string; dot: string }> = {
    HIGH: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-500' },
    MEDIUM: { bg: 'bg-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-500' },
    LOW: { bg: 'bg-slate-500/20', text: 'text-slate-400', dot: 'bg-slate-500' },
};

interface PriorityBadgeProps {
    priority: Priority;
    size?: 'sm' | 'md';
}

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
    const colors = priorityColors[priority];
    const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs';

    return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md ${colors.bg} ${colors.text} ${sizeClasses}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
            {priority}
        </span>
    );
}
