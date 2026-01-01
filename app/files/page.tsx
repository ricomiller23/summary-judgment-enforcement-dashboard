'use client';

import { useState, useEffect, useRef } from 'react';
import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import { CaseFile, Jurisdiction, FileType } from '@/lib/types';

const fileTypeIcons: Record<FileType, string> = {
    COMPLAINT: '📋',
    ORDER: '⚖️',
    JUDGMENT: '🏛️',
    AFFIDAVIT: '📝',
    LETTER: '✉️',
    NOTICE: '📢',
    EMAIL_EXPORT: '📧',
    OTHER: '📄',
};

export default function FilesPage() {
    const { files, updateFile, tasks } = useData();
    const [selectedFile, setSelectedFile] = useState<CaseFile | null>(null);
    const [jurisdictionFilter, setJurisdictionFilter] = useState<Jurisdiction | 'ALL'>('ALL');
    const [typeFilter, setTypeFilter] = useState<FileType | 'ALL'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [notes, setNotes] = useState('');
    const notesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Filter files
    const filteredFiles = files.filter(f => {
        const matchesJurisdiction = jurisdictionFilter === 'ALL' || f.jurisdiction === jurisdictionFilter;
        const matchesType = typeFilter === 'ALL' || f.fileType === typeFilter;
        const matchesSearch = !searchTerm ||
            f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.notes?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesJurisdiction && matchesType && matchesSearch;
    });

    // Auto-select first file if none selected
    useEffect(() => {
        if (!selectedFile && filteredFiles.length > 0) {
            setSelectedFile(filteredFiles[0]);
        }
    }, [filteredFiles, selectedFile]);

    // Update notes when selected file changes
    useEffect(() => {
        if (selectedFile) {
            setNotes(selectedFile.notes || '');
        }
    }, [selectedFile?.id]);

    // Autosave notes with debounce
    useEffect(() => {
        if (selectedFile && notes !== selectedFile.notes) {
            if (notesTimeoutRef.current) {
                clearTimeout(notesTimeoutRef.current);
            }
            notesTimeoutRef.current = setTimeout(() => {
                updateFile(selectedFile.id, { notes });
            }, 500);
        }

        return () => {
            if (notesTimeoutRef.current) {
                clearTimeout(notesTimeoutRef.current);
            }
        };
    }, [notes, selectedFile, updateFile]);

    const getLinkedTasks = (file: CaseFile) => {
        return tasks.filter(t => t.linkedFileIds?.includes(file.id));
    };

    const fileTypes: FileType[] = ['COMPLAINT', 'ORDER', 'JUDGMENT', 'AFFIDAVIT', 'LETTER', 'NOTICE', 'EMAIL_EXPORT', 'OTHER'];

    return (
        <div className="h-[calc(100vh-4rem)] flex">
            {/* Left Panel - File List */}
            <div className="w-96 border-r border-slate-700 flex flex-col bg-slate-900/50">
                {/* Search & Filters */}
                <div className="p-4 border-b border-slate-700 space-y-3">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search files..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-2">
                        <select
                            value={jurisdictionFilter}
                            onChange={(e) => setJurisdictionFilter(e.target.value as Jurisdiction | 'ALL')}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ALL">All States</option>
                            <option value="FL">Florida</option>
                            <option value="TN">Tennessee</option>
                            <option value="IN">Indiana</option>
                            <option value="CO">Colorado</option>
                        </select>

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as FileType | 'ALL')}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ALL">All Types</option>
                            {fileTypes.map(t => (
                                <option key={t} value={t}>{fileTypeIcons[t]} {t.charAt(0) + t.slice(1).toLowerCase()}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* File List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredFiles.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            No files found
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {filteredFiles.map((file) => (
                                <button
                                    key={file.id}
                                    onClick={() => setSelectedFile(file)}
                                    className={`w-full text-left p-4 hover:bg-slate-800/50 transition-colors ${selectedFile?.id === file.id ? 'bg-slate-800 border-l-2 border-blue-500' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">{fileTypeIcons[file.fileType]}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium text-sm truncate">{file.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {file.jurisdiction && (
                                                    <JurisdictionBadge jurisdiction={file.jurisdiction} size="sm" />
                                                )}
                                                {file.date && (
                                                    <span className="text-xs text-slate-500">
                                                        {new Date(file.date).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel - File Detail */}
            <div className="flex-1 flex flex-col bg-slate-950">
                {selectedFile ? (
                    <>
                        {/* File Header */}
                        <div className="p-6 border-b border-slate-700">
                            <div className="flex items-start gap-4">
                                <span className="text-4xl">{fileTypeIcons[selectedFile.fileType]}</span>
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-white">{selectedFile.title}</h2>
                                    <div className="flex items-center gap-3 mt-2">
                                        {selectedFile.jurisdiction && (
                                            <JurisdictionBadge jurisdiction={selectedFile.jurisdiction} showFull />
                                        )}
                                        <span className="bg-slate-800 text-slate-300 text-sm px-2 py-1 rounded">
                                            {selectedFile.fileType.charAt(0) + selectedFile.fileType.slice(1).toLowerCase()}
                                        </span>
                                        {selectedFile.date && (
                                            <span className="text-slate-400 text-sm">
                                                {new Date(selectedFile.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* File Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Notes Editor */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Notes</h3>
                                    <span className="text-xs text-slate-500">Auto-saves</span>
                                </div>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add notes about this file..."
                                    className="w-full h-48 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            {/* Key Facts */}
                            {selectedFile.fileType === 'JUDGMENT' && (
                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                                    <h3 className="text-sm font-medium text-emerald-400 uppercase tracking-wide mb-2">Key Facts</h3>
                                    <ul className="space-y-2 text-slate-300 text-sm">
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-400">•</span>
                                            Judgment Amount: <strong className="text-white">$2,378,443.28</strong>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-400">•</span>
                                            Type: Default Final Judgment
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-400">•</span>
                                            Court: Brevard County Circuit Court, Florida
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {/* Linked Tasks */}
                            <div>
                                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-2">
                                    Linked Tasks ({getLinkedTasks(selectedFile).length})
                                </h3>
                                {getLinkedTasks(selectedFile).length > 0 ? (
                                    <div className="space-y-2">
                                        {getLinkedTasks(selectedFile).map(task => (
                                            <div key={task.id} className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex items-center gap-3">
                                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                <span className="text-white text-sm">{task.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-sm">No tasks linked to this file</p>
                                )}
                            </div>

                            {/* File Metadata */}
                            <div>
                                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-2">Metadata</h3>
                                <div className="bg-slate-900 border border-slate-700 rounded-lg divide-y divide-slate-800">
                                    <div className="flex justify-between p-3">
                                        <span className="text-slate-400 text-sm">Created</span>
                                        <span className="text-white text-sm">{new Date(selectedFile.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between p-3">
                                        <span className="text-slate-400 text-sm">Updated</span>
                                        <span className="text-white text-sm">{new Date(selectedFile.updatedAt).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between p-3">
                                        <span className="text-slate-400 text-sm">ID</span>
                                        <span className="text-slate-500 text-sm font-mono">{selectedFile.id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500">
                        Select a file to view details
                    </div>
                )}
            </div>
        </div>
    );
}
