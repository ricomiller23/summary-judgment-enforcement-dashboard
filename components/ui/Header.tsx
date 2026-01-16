'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Scale, Bell, User, ChevronDown } from 'lucide-react';
import { useData } from '@/lib/hooks/useData';

interface HeaderProps {
    onSearchClick: () => void;
}

export function Header({ onSearchClick }: HeaderProps) {
    const pathname = usePathname();
    const { alerts } = useData();

    const activeAlerts = alerts.filter(a => a.status === 'ACTIVE').length;

    const navItems = [
        { href: '/', label: 'Dashboard' },
        { href: '/assets', label: 'Assets' },
        { href: '/enforcement', label: 'Enforcement' },
        { href: '/documents', label: 'Documents' },
        { href: '/jurisdictions', label: 'States' },
        { href: '/liens', label: 'Liens' },
        { href: '/bankruptcy', label: 'Bankruptcy' },
        { href: '/strategy', label: 'Strategy' },
        { href: '/examination', label: 'Examination' },
        { href: '/settle', label: 'Settlement' },
        { href: '/tasks', label: 'Tasks' },
        { href: '/reports', label: 'Reports' },
    ];

    return (
        <header className="bg-[#23313E] sticky top-0 z-40 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#C7A252] rounded-lg flex items-center justify-center shadow-md">
                            <Scale className="w-6 h-6 text-[#23313E]" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-lg font-bold text-white">Good Dogg</span>
                            <span className="text-sm text-[#C7A252] block -mt-1">Enforcement Dashboard</span>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <button
                            onClick={onSearchClick}
                            className="flex items-center gap-2 px-4 py-2 bg-[#2d3e4d] border border-[#3d4e5d] rounded-lg text-gray-300 text-sm hover:bg-[#3d4e5d] hover:border-[#C7A252] transition-all"
                        >
                            <Search className="w-4 h-4" />
                            <span className="hidden md:block">Search...</span>
                            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 bg-[#1a252f] rounded text-xs text-gray-400 ml-2">⌘K</kbd>
                        </button>

                        {/* Notifications */}
                        <button className="relative p-2 text-gray-300 hover:text-[#C7A252] hover:bg-[#2d3e4d] rounded-lg transition-all">
                            <Bell className="w-5 h-5" />
                            {activeAlerts > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {activeAlerts > 9 ? '9+' : activeAlerts}
                                </span>
                            )}
                        </button>

                        {/* User Menu */}
                        <button className="flex items-center gap-2 p-2 text-gray-300 hover:bg-[#2d3e4d] rounded-lg transition-all">
                            <div className="w-8 h-8 bg-[#C7A252] rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-[#23313E]" />
                            </div>
                            <ChevronDown className="w-4 h-4 hidden sm:block" />
                        </button>
                    </div>
                </div>

                {/* Navigation - Desktop */}
                <nav className="hidden lg:flex items-center gap-1 pb-3 -mt-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? 'bg-[#C7A252] text-[#23313E] shadow-md'
                                        : 'text-gray-300 hover:text-white hover:bg-[#2d3e4d]'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Navigation - Mobile */}
                <nav className="lg:hidden flex items-center gap-1 pb-3 overflow-x-auto scrollbar-hide">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${isActive
                                        ? 'bg-[#C7A252] text-[#23313E]'
                                        : 'text-gray-400 hover:text-white hover:bg-[#2d3e4d]'
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
