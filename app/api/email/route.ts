import { NextResponse } from 'next/server';

interface EmailRequest {
    to: string;
    subject: string;
    body: string;
    counselId?: string;
    taskIds?: string[];
}

// Email templates for common communications
export const EMAIL_TEMPLATES = {
    counselAssignment: (counselName: string, taskTitle: string) => ({
        subject: `Task Assignment: ${taskTitle}`,
        body: `Dear ${counselName},

You have been assigned the following task in the Good Dogg Beverage Co. v. MSH enforcement matter:

Task: ${taskTitle}

Please review and advise on next steps at your earliest convenience.

Best regards,
Good Dogg Beverage Co.`
    }),

    settlementCounter: (originalAmount: number, counterAmount: number) => ({
        subject: 'Re: Settlement Proposal - Good Dogg v. MSH',
        body: `Thank you for your settlement offer of $${originalAmount.toLocaleString()}.

After careful consideration, we are prepared to counter at $${counterAmount.toLocaleString()}, payable as follows:

[Proposed payment terms]

Please advise if these terms are acceptable.

Best regards,
Good Dogg Beverage Co.`
    }),

    domesticationRequest: (jurisdiction: string, counselName: string) => ({
        subject: `Domestication Request - ${jurisdiction}`,
        body: `Dear ${counselName},

We are seeking local counsel representation to domesticate a Florida default judgment in ${jurisdiction}.

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
    }),

    statusUpdate: (recipientName: string, updates: string[]) => ({
        subject: 'Status Update - Good Dogg v. MSH Enforcement',
        body: `Dear ${recipientName},

Please find below the current status of enforcement efforts:

${updates.map((u, i) => `${i + 1}. ${u}`).join('\n')}

Please let me know if you have any questions or require additional information.

Best regards,
Good Dogg Beverage Co.`
    })
};

export async function POST(request: Request) {
    try {
        const { to, subject, body, counselId, taskIds }: EmailRequest = await request.json();

        if (!to || !subject || !body) {
            return NextResponse.json(
                { error: 'Missing required fields: to, subject, body' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // In production, you would integrate with an email service here:
        // - SendGrid: await sgMail.send({ to, from: 'noreply@dashboard.com', subject, text: body })
        // - Resend: await resend.emails.send({ from: 'Dashboard <noreply@dashboard.com>', to, subject, text: body })
        // - AWS SES, Postmark, etc.

        // For now, we'll simulate sending and return the email data for logging
        const emailLog = {
            id: `e${Date.now()}`,
            to,
            from: 'dashboard@gooddogg.com',
            subject,
            summary: body.substring(0, 200) + (body.length > 200 ? '...' : ''),
            date: new Date().toISOString().split('T')[0],
            type: counselId ? 'OPPOSING_COUNSEL' : 'CLIENT',
            linkedTaskIds: taskIds || [],
            linkedPartyIds: counselId ? [counselId] : [],
            status: 'sent'
        };

        // Log to console for development
        console.log('Email sent:', emailLog);

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully',
            emailLog
        });
    } catch (error) {
        console.error('Email error:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}

export async function GET() {
    // Return available email templates
    return NextResponse.json({
        templates: Object.keys(EMAIL_TEMPLATES)
    });
}
