'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { SearchModal } from '@/components/ui/SearchModal';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen((prev) => !prev);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950">
            <Header onSearchClick={() => setSearchOpen(true)} />
            <main>{children}</main>
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </div>
    );
}
