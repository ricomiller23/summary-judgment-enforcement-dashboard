'use client';

import { useState, useEffect, useRef } from 'react';
import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from './JurisdictionBadge';
import Link from 'next/link';
import { Search, FileText, CheckSquare, Mail, User, X, Command } from 'lucide-react';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const { search } = useData();

    const results = query.length >= 2 ? search(query) : null;
    const hasResults = results && (
        results.tasks.length > 0 ||
        results.files.length > 0 ||
        results.emails.length > 0 ||
        results.parties.length > 0 ||
        results.counsel.length > 0
    );

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setQuery('');
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (isOpen) {
                    onClose();
                }
            }
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search tasks, files, emails, counsel..."
                        className="flex-1 bg-transparent text-white text-lg placeholder-slate-500 outline-none"
                    />
                    <kbd className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 border border-slate-700">ESC</kbd>
                </div>

                {/* Quick Actions */}
                {!query && (
                    <div className="p-3 border-b border-slate-800">
                        <p className="px-2 py-1 text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Quick Actions</p>
                        <div className="grid grid-cols-2 gap-2">
                            <Link
                                href="/tasks"
                                onClick={onClose}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                            >
                                <span className="text-slate-400 text-sm">N</span>
                                <span className="text-white text-sm">New Task</span>
                            </Link>
                            <Link
                                href="/files"
                                onClick={onClose}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                            >
                                <span className="text-slate-400 text-sm">U</span>
                                <span className="text-white text-sm">Upload Files</span>
                            </Link>
                            <Link
                                href="/counsel"
                                onClick={onClose}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                            >
                                <span className="text-slate-400 text-sm">C</span>
                                <span className="text-white text-sm">New Counsel</span>
                            </Link>
                            <Link
                                href="/settle"
                                onClick={onClose}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                            >
                                <span className="text-slate-400 text-sm">S</span>
                                <span className="text-white text-sm">Log Settlement</span>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                    {query.length >= 2 && !hasResults && (
                        <div className="p-8 text-center text-slate-500">
                            No results found for &ldquo;{query}&rdquo;
                        </div>
                    )}

                    {results && results.tasks.length > 0 && (
                        <div className="p-3">
                            <div className="px-2 py-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Tasks ({results.tasks.length})
                            </div>
                            {results.tasks.slice(0, 5).map((task) => (
                                <Link
                                    key={task.id}
                                    href="/tasks"
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <CheckSquare className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium truncate">{task.title}</p>
                                    </div>
                                    {task.jurisdiction && <JurisdictionBadge jurisdiction={task.jurisdiction} size="sm" />}
                                </Link>
                            ))}
                        </div>
                    )}

                    {results && results.files.length > 0 && (
                        <div className="p-3 border-t border-slate-800">
                            <div className="px-2 py-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Files ({results.files.length})
                            </div>
                            {results.files.slice(0, 5).map((file) => (
                                <Link
                                    key={file.id}
                                    href="/files"
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium truncate">{file.title}</p>
                                        {file.excerpt && (
                                            <p className="text-slate-500 text-xs truncate">{file.excerpt.slice(0, 50)}...</p>
                                        )}
                                    </div>
                                    {file.jurisdiction && <JurisdictionBadge jurisdiction={file.jurisdiction} size="sm" />}
                                </Link>
                            ))}
                        </div>
                    )}

                    {results && results.counsel.length > 0 && (
                        <div className="p-3 border-t border-slate-800">
                            <div className="px-2 py-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Counsel ({results.counsel.length})
                            </div>
                            {results.counsel.slice(0, 3).map((c) => (
                                <Link
                                    key={c.id}
                                    href="/counsel"
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                        <User className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium truncate">{c.name}</p>
                                        <p className="text-slate-500 text-xs truncate">{c.firm}</p>
                                    </div>
                                    <JurisdictionBadge jurisdiction={c.state} size="sm" />
                                </Link>
                            ))}
                        </div>
                    )}

                    {results && results.emails.length > 0 && (
                        <div className="p-3 border-t border-slate-800">
                            <div className="px-2 py-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Emails ({results.emails.length})
                            </div>
                            {results.emails.slice(0, 3).map((email) => (
                                <Link
                                    key={email.id}
                                    href="/emails"
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-amber-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium truncate">{email.subject}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><Command className="w-3 h-3" />K to toggle</span>
                        <span>↑↓ to navigate</span>
                        <span>↵ to select</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
