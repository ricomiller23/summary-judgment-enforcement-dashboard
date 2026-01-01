'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import { Modal } from '@/components/ui/Modal';
import { CaseFile, Jurisdiction, FileType } from '@/lib/types';
import {
    Upload, Search, Grid, List, FileText, Trash2, Download, Share2,
    Plus, Eye, X, File, FileCheck, Gavel, Mail, Bell, MoreVertical
} from 'lucide-react';

const fileTypeIcons: Record<FileType, React.ReactNode> = {
    COMPLAINT: <FileText className="w-6 h-6 text-blue-400" />,
    ORDER: <Gavel className="w-6 h-6 text-purple-400" />,
    JUDGMENT: <FileCheck className="w-6 h-6 text-emerald-400" />,
    AFFIDAVIT: <FileText className="w-6 h-6 text-amber-400" />,
    LETTER: <Mail className="w-6 h-6 text-slate-400" />,
    NOTICE: <Bell className="w-6 h-6 text-red-400" />,
    EMAIL_EXPORT: <Mail className="w-6 h-6 text-cyan-400" />,
    OTHER: <File className="w-6016 text-slate-400" />,
};

export default function FilesPage() {
    const { files, updateFile, deleteFile, addFile, tasks } = useData();
    const [selectedFile, setSelectedFile] = useState<CaseFile | null>(null);
    const [jurisdictionFilter, setJurisdictionFilter] = useState<Jurisdiction | 'ALL'>('ALL');
    const [typeFilter, setTypeFilter] = useState<FileType | 'ALL'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [notes, setNotes] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isDragging, setIsDragging] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const notesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Filter files
    const filteredFiles = files.filter(f => {
        const matchesJurisdiction = jurisdictionFilter === 'ALL' || f.jurisdiction === jurisdictionFilter;
        const matchesType = typeFilter === 'ALL' || f.fileType === typeFilter;
        const matchesSearch = !searchTerm ||
            f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesJurisdiction && matchesType && matchesSearch;
    });

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

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        // Note: Real file upload would require backend/Vercel Blob
        // For now, show upload modal
        setShowUploadModal(true);
    }, []);

    const handleDelete = (file: CaseFile) => {
        if (confirm(`Delete "${file.title}"?`)) {
            deleteFile(file.id);
            if (selectedFile?.id === file.id) {
                setSelectedFile(null);
            }
        }
    };

    const formatSize = (bytes?: number) => {
        if (!bytes) return 'N/A';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const fileTypes: FileType[] = ['COMPLAINT', 'ORDER', 'JUDGMENT', 'AFFIDAVIT', 'LETTER', 'NOTICE', 'EMAIL_EXPORT', 'OTHER'];

    return (
        <div className="h-[calc(100vh-4rem)]">
            {/* Upload Drop Zone Overlay */}
            {isDragging && (
                <div className="fixed inset-0 z-50 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-slate-900 border-2 border-dashed border-blue-500 rounded-2xl p-12 text-center">
                        <Upload className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                        <p className="text-xl font-semibold text-white">Drop files here to upload</p>
                        <p className="text-slate-400 mt-2">PDF, DOC, DOCX up to 50MB</p>
                    </div>
                </div>
            )}

            <div
                className="h-full flex"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {/* Main Content */}
                <div className={`flex-1 flex flex-col ${selectedFile && viewMode === 'list' ? 'w-1/2' : 'w-full'}`}>
                    {/* Header */}
                    <div className="p-4 border-b border-slate-700 bg-slate-900/50 space-y-3">
                        {/* Upload Bar */}
                        <div
                            className="border-2 border-dashed border-slate-600 rounded-xl p-4 text-center hover:border-blue-500/50 transition-colors cursor-pointer"
                            onClick={() => setShowUploadModal(true)}
                        >
                            <div className="flex items-center justify-center gap-3 text-slate-400">
                                <Upload className="w-5 h-5" />
                                <span>Click to upload or drag files here</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-sm">Max 50MB</span>
                            </div>
                        </div>

                        {/* Search & Filters */}
                        <div className="flex flex-wrap gap-3">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search files & contents..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <select
                                value={jurisdictionFilter}
                                onChange={(e) => setJurisdictionFilter(e.target.value as Jurisdiction | 'ALL')}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="ALL">All Types</option>
                                {fileTypes.map(t => (
                                    <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase().replace('_', ' ')}</option>
                                ))}
                            </select>

                            <div className="flex border border-slate-700 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* File Grid/List */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {filteredFiles.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-400">No files found</p>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {filteredFiles.map((file) => (
                                    <div
                                        key={file.id}
                                        onClick={() => setSelectedFile(file)}
                                        className={`bg-slate-900 border rounded-xl p-4 cursor-pointer transition-all hover:border-blue-500/50 ${selectedFile?.id === file.id ? 'border-blue-500 ring-1 ring-blue-500/50' : 'border-slate-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center h-16 mb-3">
                                            {fileTypeIcons[file.fileType]}
                                        </div>
                                        <p className="text-white text-sm font-medium truncate">{file.title}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            {file.jurisdiction && <JurisdictionBadge jurisdiction={file.jurisdiction} size="sm" />}
                                        </div>
                                        {file.date && (
                                            <p className="text-xs text-slate-500 mt-1">{new Date(file.date).toLocaleDateString()}</p>
                                        )}
                                        {file.excerpt && (
                                            <p className="text-xs text-slate-500 mt-2 line-clamp-2">"{file.excerpt.slice(0, 50)}..."</p>
                                        )}
                                        <div className="flex gap-1 mt-3 pt-3 border-t border-slate-800">
                                            <button className="flex-1 text-xs text-slate-400 hover:text-white py-1 rounded hover:bg-slate-800">Notes</button>
                                            <button className="flex-1 text-xs text-slate-400 hover:text-white py-1 rounded hover:bg-slate-800">Link</button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(file); }}
                                                className="text-xs text-red-400 hover:text-red-300 p-1 rounded hover:bg-slate-800"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredFiles.map((file) => (
                                    <div
                                        key={file.id}
                                        onClick={() => setSelectedFile(file)}
                                        className={`bg-slate-900 border rounded-lg p-3 cursor-pointer transition-all hover:border-blue-500/50 flex items-center gap-4 ${selectedFile?.id === file.id ? 'border-blue-500' : 'border-slate-700'
                                            }`}
                                    >
                                        {fileTypeIcons[file.fileType]}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate">{file.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {file.jurisdiction && <JurisdictionBadge jurisdiction={file.jurisdiction} size="sm" />}
                                                {file.date && <span className="text-xs text-slate-500">{new Date(file.date).toLocaleDateString()}</span>}
                                                {file.size && <span className="text-xs text-slate-500">{formatSize(file.size)}</span>}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded"><Eye className="w-4 h-4" /></button>
                                            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded"><Download className="w-4 h-4" /></button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(file); }}
                                                className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail Panel (shown when file selected in grid mode) */}
                {selectedFile && viewMode === 'grid' && (
                    <div className="w-96 border-l border-slate-700 bg-slate-950 flex flex-col">
                        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                            <h3 className="font-semibold text-white truncate">{selectedFile.title}</h3>
                            <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div className="flex items-center gap-3">
                                {fileTypeIcons[selectedFile.fileType]}
                                <div>
                                    <p className="text-white font-medium">{selectedFile.fileType}</p>
                                    {selectedFile.jurisdiction && <JurisdictionBadge jurisdiction={selectedFile.jurisdiction} size="sm" />}
                                </div>
                            </div>

                            {selectedFile.date && (
                                <p className="text-sm text-slate-400">Date: {new Date(selectedFile.date).toLocaleDateString()}</p>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add notes..."
                                    className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">Auto-saves</p>
                            </div>

                            {selectedFile.excerpt && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Excerpt</label>
                                    <p className="text-sm text-slate-300 bg-slate-900 rounded-lg p-3">"{selectedFile.excerpt}"</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    Linked Tasks ({getLinkedTasks(selectedFile).length})
                                </label>
                                {getLinkedTasks(selectedFile).length > 0 ? (
                                    <div className="space-y-2">
                                        {getLinkedTasks(selectedFile).map(task => (
                                            <div key={task.id} className="bg-slate-900 rounded-lg p-2 text-sm text-white">
                                                {task.title}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500">No linked tasks</p>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-700 flex gap-2">
                            <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                                <Download className="w-4 h-4" /> Download
                            </button>
                            <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                                <Share2 className="w-4 h-4" /> Share
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Upload Files" size="md">
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center">
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                        <p className="text-white font-medium">File uploads coming soon!</p>
                        <p className="text-slate-400 text-sm mt-2">
                            This feature requires Vercel Blob storage configuration.
                        </p>
                        <p className="text-slate-500 text-xs mt-4">
                            For now, files are stored as metadata references.
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowUploadModal(false)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
