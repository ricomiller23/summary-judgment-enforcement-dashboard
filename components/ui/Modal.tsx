'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#23313E]/60 backdrop-blur-sm overflow-y-auto"
            onClick={(e) => e.target === overlayRef.current && onClose()}
        >
            <div className={`${sizeClasses[size]} w-full bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl mb-20 animate-in fade-in zoom-in-95 duration-200`}>
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                        <h2 className="text-lg font-semibold text-[#23313E]">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-[#8a95a3] hover:text-[#23313E] transition-colors p-1.5 rounded-lg hover:bg-[#F8F9FA]"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
