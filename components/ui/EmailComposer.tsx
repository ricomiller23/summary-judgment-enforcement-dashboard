'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { Send, FileText, Users, Mail } from 'lucide-react';

interface EmailTemplate {
    name: string;
    subject: string;
    body: string;
}

interface EmailComposerProps {
    isOpen: boolean;
    onClose: () => void;
    recipientEmail?: string;
    recipientName?: string;
    onSend?: (email: { to: string; subject: string; body: string }) => void;
}

const TEMPLATES: EmailTemplate[] = [
    {
        name: 'Task Assignment',
        subject: 'Task Assignment: [Task Name]',
        body: `Dear [Counsel Name],

You have been assigned the following task in the Good Dogg Beverage Co. v. MSH enforcement matter:

Task: [Task Name]

Please review and advise on next steps at your earliest convenience.

Best regards,
Good Dogg Beverage Co.`
    },
    {
        name: 'Status Request',
        subject: 'Status Update Request - Good Dogg v. MSH',
        body: `Dear [Counsel Name],

Could you please provide a status update on the following matters:

1. [Matter 1]
2. [Matter 2]

Thank you for your continued work on this case.

Best regards,
Good Dogg Beverage Co.`
    },
    {
        name: 'Domestication Inquiry',
        subject: 'Domestication Representation Inquiry - [State]',
        body: `Dear [Counsel Name],

We are seeking local counsel representation to domesticate a Florida default judgment in [State].

Case Details:
- Judgment Amount: $2,378,443.28
- Judgment Date: November 25, 2025
- Case Number: 05-2024-CA-050807
- Debtor: Management Services Holdings, LLC

Please advise on:
1. Your availability and retainer requirements
2. Estimated timeline for domestication
3. Any known debtor assets in your jurisdiction

Thank you for your consideration.

Best regards,
Good Dogg Beverage Co.`
    },
    {
        name: 'Settlement Counter',
        subject: 'Re: Settlement Proposal - Good Dogg v. MSH',
        body: `Thank you for your settlement offer of $[Original Amount].

After careful consideration, we are prepared to counter at $[Counter Amount], payable as follows:

[Proposed payment terms]

Please advise if these terms are acceptable.

Best regards,
Good Dogg Beverage Co.`
    }
];

export function EmailComposer({ isOpen, onClose, recipientEmail, recipientName, onSend }: EmailComposerProps) {
    const [to, setTo] = useState(recipientEmail || '');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');

    const handleTemplateSelect = (templateName: string) => {
        const template = TEMPLATES.find(t => t.name === templateName);
        if (template) {
            setSubject(template.subject.replace('[Counsel Name]', recipientName || '[Name]'));
            setBody(template.body.replace(/\[Counsel Name\]/g, recipientName || '[Name]'));
            setSelectedTemplate(templateName);
        }
    };

    const handleSend = async () => {
        if (!to || !subject || !body) {
            alert('Please fill in all fields');
            return;
        }

        setSending(true);

        try {
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to, subject, body })
            });

            if (response.ok) {
                if (onSend) {
                    onSend({ to, subject, body });
                }

                // Open default email client as fallback
                const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.open(mailtoLink);

                alert('Email prepared! Your default email client should open.');
                onClose();
            } else {
                throw new Error('Failed to send');
            }
        } catch (error) {
            // Fallback to mailto
            const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(mailtoLink);
            alert('Opening your default email client...');
            onClose();
        } finally {
            setSending(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Compose Email" size="lg">
            <div className="space-y-4">
                {/* Template Selector */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Use Template</label>
                    <div className="flex flex-wrap gap-2">
                        {TEMPLATES.map(t => (
                            <button
                                key={t.name}
                                onClick={() => handleTemplateSelect(t.name)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedTemplate === t.name
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">To</label>
                    <input
                        type="email"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="recipient@email.com"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Email subject"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Compose your message..."
                        className="w-full h-64 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white resize-none font-mono text-sm"
                    />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-500">
                        Opens in your default email client
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-slate-400 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={sending}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                            {sending ? 'Sending...' : 'Send Email'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
