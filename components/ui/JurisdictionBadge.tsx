import { Jurisdiction } from '@/lib/types';

const jurisdictionColors: Record<Jurisdiction, { bg: string; text: string; border: string }> = {
    FL: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
    TN: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    IN: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    CO: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
};

const jurisdictionLabels: Record<Jurisdiction, string> = {
    FL: 'Florida',
    TN: 'Tennessee',
    IN: 'Indiana',
    CO: 'Colorado',
};

interface JurisdictionBadgeProps {
    jurisdiction: Jurisdiction;
    size?: 'sm' | 'md' | 'lg';
    showFull?: boolean;
}

export function JurisdictionBadge({ jurisdiction, size = 'md', showFull = false }: JurisdictionBadgeProps) {
    const colors = jurisdictionColors[jurisdiction];
    const sizeClasses = {
        sm: 'px-1.5 py-0.5 text-xs',
        md: 'px-2 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
    };

    return (
        <span className={`inline-flex items-center font-medium rounded-md border ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses[size]}`}>
            {showFull ? jurisdictionLabels[jurisdiction] : jurisdiction}
        </span>
    );
}
