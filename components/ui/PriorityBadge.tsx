import { Priority } from '@/lib/types';

const priorityColors: Record<Priority, { bg: string; text: string; dot: string }> = {
    HIGH: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
    MEDIUM: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    LOW: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
};

interface PriorityBadgeProps {
    priority: Priority;
    size?: 'sm' | 'md';
}

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
    const colors = priorityColors[priority];
    const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

    return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${colors.bg} ${colors.text} ${sizeClasses}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
            {priority}
        </span>
    );
}
