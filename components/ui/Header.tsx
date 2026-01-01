'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Search, Scale } from 'lucide-react';
import { useData } from '@/lib/hooks/useData';

interface HeaderProps {
    onSearchClick: () => void;
}

export function Header({ onSearchClick }: HeaderProps) {
    const pathname = usePathname();
    const { darkMode, toggleDarkMode } = useData();

    const navItems = [
        { href: '/', label: 'Overview' },
        { href: '/enforcement', label: 'Enforcement' },
        { href: '/tasks', label: 'Tasks' },
        { href: '/files', label: 'Files' },
        { href: '/counsel', label: 'Counsel' },
        { href: '/settle', label: 'Settle' },
        { href: '/emails', label: 'Emails' },
        { href: '/reports', label: 'Reports' },
    ];

    return (
        <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                            <Scale className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white hidden sm:block">SJ Dashboard</span>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <button
                            onClick={onSearchClick}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-400 text-sm hover:bg-slate-700 transition-colors"
                        >
                            <Search className="w-4 h-4" />
                            <span className="hidden sm:block">Search...</span>
                            <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 bg-slate-700 rounded text-xs text-slate-400">⌘K</kbd>
                        </button>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            title="Toggle dark mode"
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="lg:hidden flex items-center gap-1 pb-3 overflow-x-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
