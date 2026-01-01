'use client';

import { useState, useEffect, useRef } from 'react';
import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from './JurisdictionBadge';
import Link from 'next/link';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const { search } = useData();

    const results = query.length >= 2 ? search(query) : null;
    const hasResults = results && (results.tasks.length > 0 || results.files.length > 0 || results.emails.length > 0 || results.parties.length > 0);

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
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search tasks, files, emails..."
                        className="flex-1 bg-transparent text-white text-lg placeholder-slate-500 outline-none"
                    />
                    <kbd className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 border border-slate-700">ESC</kbd>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                    {query.length < 2 && (
                        <div className="p-8 text-center text-slate-500">
                            Type at least 2 characters to search...
                        </div>
                    )}

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
                                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
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
                                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium truncate">{file.title}</p>
                                    </div>
                                    {file.jurisdiction && <JurisdictionBadge jurisdiction={file.jurisdiction} size="sm" />}
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
                                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium truncate">{email.subject}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
