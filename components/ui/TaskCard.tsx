'use client';

import { Task } from '@/lib/types';
import { JurisdictionBadge } from './JurisdictionBadge';
import { PriorityBadge } from './PriorityBadge';

interface TaskCardProps {
    task: Task;
    onClick?: () => void;
    onDragStart?: (e: React.DragEvent, taskId: string) => void;
    compact?: boolean;
}

export function TaskCard({ task, onClick, onDragStart, compact = false }: TaskCardProps) {
    const handleDragStart = (e: React.DragEvent) => {
        if (onDragStart) {
            onDragStart(e, task.id);
            e.dataTransfer.effectAllowed = 'move';
        }
    };

    if (compact) {
        return (
            <div
                draggable={!!onDragStart}
                onDragStart={handleDragStart}
                onClick={onClick}
                className="bg-slate-800 border border-slate-700 rounded-lg p-3 cursor-pointer hover:border-blue-500/50 hover:bg-slate-750 transition-all group"
            >
                <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-white font-medium line-clamp-2">{task.title}</p>
                    <svg className="w-4 h-4 text-slate-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    {task.jurisdiction && <JurisdictionBadge jurisdiction={task.jurisdiction} size="sm" />}
                    {task.priority && <PriorityBadge priority={task.priority} size="sm" />}
                </div>
            </div>
        );
    }

    return (
        <div
            draggable={!!onDragStart}
            onDragStart={handleDragStart}
            onClick={onClick}
            className="bg-slate-800 border border-slate-700 rounded-xl p-4 cursor-pointer hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold line-clamp-2">{task.title}</h3>
                    {task.description && (
                        <p className="text-slate-400 text-sm mt-1 line-clamp-2">{task.description}</p>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
                {task.jurisdiction && <JurisdictionBadge jurisdiction={task.jurisdiction} />}
                {task.priority && <PriorityBadge priority={task.priority} />}
                {task.dueDate && (
                    <span className="text-xs text-slate-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                )}
            </div>

            {(task.linkedFileIds?.length || task.linkedPartyIds?.length) && (
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-700">
                    {task.linkedFileIds && task.linkedFileIds.length > 0 && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {task.linkedFileIds.length} file{task.linkedFileIds.length !== 1 ? 's' : ''}
                        </span>
                    )}
                    {task.linkedPartyIds && task.linkedPartyIds.length > 0 && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            {task.linkedPartyIds.length} part{task.linkedPartyIds.length !== 1 ? 'ies' : 'y'}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
