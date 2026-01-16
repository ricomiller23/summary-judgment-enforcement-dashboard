import { Jurisdiction } from '@/lib/types';

const jurisdictionColors: Record<Jurisdiction, { bg: string; text: string; border: string }> = {
    FL: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
    TN: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    IN: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    CO: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
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
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
    };

    return (
        <span className={`inline-flex items-center font-semibold rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses[size]}`}>
            {showFull ? jurisdictionLabels[jurisdiction] : jurisdiction}
        </span>
    );
}
