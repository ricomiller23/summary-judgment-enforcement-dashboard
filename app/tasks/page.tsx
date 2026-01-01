'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { TaskCard } from '@/components/ui/TaskCard';
import { Modal } from '@/components/ui/Modal';
import { Task, TaskStatus, TaskCategory, Jurisdiction, Priority } from '@/lib/types';

const statusColumns: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'BACKLOG', label: 'Backlog', color: 'border-slate-600' },
    { status: 'THIS_WEEK', label: 'This Week', color: 'border-blue-500' },
    { status: 'IN_PROGRESS', label: 'In Progress', color: 'border-amber-500' },
    { status: 'WAITING', label: 'Waiting', color: 'border-purple-500' },
    { status: 'DONE', label: 'Done', color: 'border-emerald-500' },
];

export default function TasksPage() {
    const { tasks, updateTaskStatus, addTask } = useData();
    const [draggedTask, setDraggedTask] = useState<string | null>(null);
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const [filter, setFilter] = useState<Jurisdiction | 'ALL'>('ALL');

    const filteredTasks = filter === 'ALL' ? tasks : tasks.filter(t => t.jurisdiction === filter);

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        setDraggedTask(taskId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
        e.preventDefault();
        if (draggedTask) {
            updateTaskStatus(draggedTask, status);
            setDraggedTask(null);
        }
    };

    const handleDragEnd = () => {
        setDraggedTask(null);
    };

    return (
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tasks</h1>
                    <p className="text-slate-400 mt-1">Drag tasks between columns to update status</p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as Jurisdiction | 'ALL')}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ALL">All Jurisdictions</option>
                        <option value="FL">Florida</option>
                        <option value="TN">Tennessee</option>
                        <option value="IN">Indiana</option>
                        <option value="CO">Colorado</option>
                    </select>

                    <button
                        onClick={() => setShowNewTaskModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Task
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex gap-4 overflow-x-auto pb-4">
                {statusColumns.map((column) => {
                    const columnTasks = filteredTasks.filter(t => t.status === column.status);

                    return (
                        <div
                            key={column.status}
                            className="flex-shrink-0 w-72"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, column.status)}
                        >
                            {/* Column Header */}
                            <div className={`bg-slate-900 border-t-2 ${column.color} border-x border-slate-700 rounded-t-xl p-3`}>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-white font-medium">{column.label}</h3>
                                    <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full">
                                        {columnTasks.length}
                                    </span>
                                </div>
                            </div>

                            {/* Column Body */}
                            <div
                                className={`bg-slate-900/50 border-x border-b border-slate-700 rounded-b-xl p-3 min-h-[500px] space-y-3 transition-colors ${draggedTask ? 'border-dashed border-2' : ''
                                    }`}
                            >
                                {columnTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        onDragEnd={handleDragEnd}
                                        className={draggedTask === task.id ? 'opacity-50' : ''}
                                    >
                                        <TaskCard
                                            task={task}
                                            onDragStart={handleDragStart}
                                            compact
                                        />
                                    </div>
                                ))}

                                {columnTasks.length === 0 && (
                                    <div className="text-center py-8 text-slate-500 text-sm">
                                        Drop tasks here
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* New Task Modal */}
            <NewTaskModal
                isOpen={showNewTaskModal}
                onClose={() => setShowNewTaskModal(false)}
                onSave={(task) => {
                    addTask(task);
                    setShowNewTaskModal(false);
                }}
            />
        </div>
    );
}

interface NewTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

function NewTaskModal({ isOpen, onClose, onSave }: NewTaskModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('FL');
    const [category, setCategory] = useState<TaskCategory>('MOTION');
    const [priority, setPriority] = useState<Priority>('MEDIUM');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        onSave({
            title: title.trim(),
            description: description.trim() || undefined,
            jurisdiction,
            category,
            status: 'BACKLOG',
            priority,
            dueDate: dueDate || undefined,
        });

        // Reset form
        setTitle('');
        setDescription('');
        setJurisdiction('FL');
        setCategory('MOTION');
        setPriority('MEDIUM');
        setDueDate('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="New Task" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter task title..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                        placeholder="Enter task description..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Jurisdiction</label>
                        <select
                            value={jurisdiction}
                            onChange={(e) => setJurisdiction(e.target.value as Jurisdiction)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="FL">Florida</option>
                            <option value="TN">Tennessee</option>
                            <option value="IN">Indiana</option>
                            <option value="CO">Colorado</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as TaskCategory)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="DOMESTICATION">Domestication</option>
                            <option value="DISCOVERY">Discovery</option>
                            <option value="MOTION">Motion</option>
                            <option value="EXECUTION">Execution</option>
                            <option value="RESEARCH">Research</option>
                            <option value="COMMUNICATION">Communication</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as Priority)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Create Task
                    </button>
                </div>
            </form>
        </Modal>
    );
}
