'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import {
    ListTodo, Plus, Clock, CheckCircle, ChevronRight, Calendar
} from 'lucide-react';

export default function TasksPage() {
    const { tasks, updateTask } = useData();
    const [filter, setFilter] = useState<'all' | 'backlog' | 'in-progress' | 'done'>('all');

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'backlog') return task.status === 'BACKLOG' || task.status === 'THIS_WEEK';
        if (filter === 'in-progress') return task.status === 'IN_PROGRESS' || task.status === 'WAITING';
        if (filter === 'done') return task.status === 'DONE';
        return true;
    });

    const backlogCount = tasks.filter(t => t.status === 'BACKLOG' || t.status === 'THIS_WEEK').length;
    const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'WAITING').length;
    const doneCount = tasks.filter(t => t.status === 'DONE').length;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'BACKLOG': return 'bg-gray-100 text-gray-700';
            case 'THIS_WEEK': return 'bg-blue-100 text-blue-700';
            case 'IN_PROGRESS': return 'bg-[#C7A252]/20 text-[#C7A252]';
            case 'WAITING': return 'bg-amber-100 text-amber-700';
            case 'DONE': return 'bg-emerald-100 text-emerald-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#23313E] flex items-center gap-3">
                            <ListTodo className="w-8 h-8 text-[#C7A252]" />
                            Task Management
                        </h1>
                        <p className="text-[#5a6a7a] mt-1">Track and manage enforcement tasks</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#C7A252] hover:bg-[#a88b43] text-[#23313E] rounded-lg font-medium transition-all shadow-sm">
                        <Plus className="w-4 h-4" />
                        Add Task
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-gray-600">{backlogCount}</div>
                        <div className="text-sm text-[#8a95a3]">Backlog</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-[#C7A252]">{inProgressCount}</div>
                        <div className="text-sm text-[#8a95a3]">In Progress</div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                        <div className="text-2xl font-bold text-emerald-600">{doneCount}</div>
                        <div className="text-sm text-[#8a95a3]">Completed</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-1 mb-6 bg-white border border-[#E5E7EB] rounded-xl p-1 shadow-sm">
                    {[
                        { id: 'all', label: 'All Tasks' },
                        { id: 'backlog', label: 'Backlog' },
                        { id: 'in-progress', label: 'In Progress' },
                        { id: 'done', label: 'Done' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id as typeof filter)}
                            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 ${filter === tab.id
                                    ? 'bg-[#C7A252] text-[#23313E] shadow-sm'
                                    : 'text-[#5a6a7a] hover:bg-[#F8F9FA]'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Task List */}
                <div className="space-y-3">
                    {filteredTasks.map((task) => (
                        <div key={task.id} className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm hover:border-[#C7A252] transition-all">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                        {task.jurisdiction && <JurisdictionBadge jurisdiction={task.jurisdiction} size="sm" />}
                                        {task.priority && <PriorityBadge priority={task.priority} size="sm" />}
                                    </div>
                                    <h3 className="font-semibold text-[#23313E] mb-1">{task.title}</h3>
                                    {task.description && (
                                        <p className="text-sm text-[#5a6a7a] line-clamp-2">{task.description}</p>
                                    )}
                                    {task.dueDate && (
                                        <div className="flex items-center gap-2 mt-3 text-sm text-[#5a6a7a]">
                                            <Calendar className="w-4 h-4" />
                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {task.status !== 'DONE' && (
                                        <button
                                            onClick={() => updateTask(task.id, {
                                                status: task.status === 'BACKLOG' || task.status === 'THIS_WEEK' ? 'IN_PROGRESS' : 'DONE'
                                            })}
                                            className="px-3 py-1.5 text-sm font-medium text-[#C7A252] hover:bg-[#C7A252]/10 rounded-lg transition-colors"
                                        >
                                            {task.status === 'BACKLOG' || task.status === 'THIS_WEEK' ? 'Start' : 'Complete'}
                                        </button>
                                    )}
                                    <ChevronRight className="w-5 h-5 text-[#8a95a3]" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
