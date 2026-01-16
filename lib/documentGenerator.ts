// Document Generation Utility - Creates downloadable PDFs with case data

export interface DocumentData {
    templateName: string;
    templateId: string;
    caseNumber?: string;
    judgmentAmount: number;
    interestAccrued: number;
    totalDue: number;
    judgmentDate?: string;
    jurisdiction: string;
    creditorName?: string;
    debtorName?: string;
    debtorAddress?: string;
    additionalFields?: Record<string, string | number>;
}

// Generate HTML content for the document
function generateDocumentHTML(data: DocumentData): string {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);

    // Get template-specific content
    const templateContent = getTemplateContent(data);

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${data.templateName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #000;
            padding: 1in;
            max-width: 8.5in;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 24pt;
            border-bottom: 2px solid #23313E;
            padding-bottom: 16pt;
        }
        .header h1 {
            font-size: 18pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #23313E;
        }
        .header .case-info {
            margin-top: 8pt;
            font-size: 10pt;
            color: #666;
        }
        .section {
            margin-bottom: 18pt;
        }
        .section-title {
            font-weight: bold;
            text-transform: uppercase;
            font-size: 11pt;
            margin-bottom: 8pt;
            color: #23313E;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 12pt 0;
        }
        .info-table td {
            padding: 6pt 8pt;
            border: 1px solid #ccc;
        }
        .info-table td:first-child {
            width: 40%;
            font-weight: bold;
            background: #f5f5f5;
        }
        .amount-highlight {
            font-size: 14pt;
            font-weight: bold;
            color: #23313E;
        }
        .body-text {
            text-align: justify;
            margin-bottom: 12pt;
        }
        .signature-section {
            margin-top: 48pt;
        }
        .signature-line {
            border-bottom: 1px solid #000;
            width: 250px;
            margin: 32pt 0 8pt 0;
        }
        .footer {
            margin-top: 48pt;
            padding-top: 16pt;
            border-top: 1px solid #ccc;
            font-size: 9pt;
            color: #666;
            text-align: center;
        }
        .legal-notice {
            background: #f9f9f9;
            border: 1px solid #ddd;
            padding: 12pt;
            margin: 18pt 0;
            font-size: 10pt;
        }
        .deadline {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 8pt 12pt;
            margin: 12pt 0;
            font-weight: bold;
        }
        @media print {
            body { padding: 0.5in; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${data.templateName}</h1>
        <div class="case-info">
            Case No: ${data.caseNumber || 'N/A'} | Jurisdiction: ${data.jurisdiction}
        </div>
    </div>

    ${templateContent}

    <div class="footer">
        Generated on ${currentDate} | Case Management System
        <br>This document was automatically generated. Please verify all information for accuracy.
    </div>
</body>
</html>
    `;
}

function getTemplateContent(data: DocumentData): string {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);

    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const templates: Record<string, string> = {
        'Initial Demand Letter': `
            <div class="section">
                <div class="section-title">Notice of Debt and Demand for Payment</div>
                <p class="body-text">
                    You are hereby notified that a judgment has been entered against you in the matter referenced above.
                    As the judgment creditor, we are exercising our legal rights to collect the full amount owed.
                </p>
            </div>

            <div class="section">
                <div class="section-title">Amount Owed</div>
                <table class="info-table">
                    <tr><td>Original Judgment Amount</td><td>${formatCurrency(data.judgmentAmount)}</td></tr>
                    <tr><td>Accrued Interest</td><td>${formatCurrency(data.interestAccrued)}</td></tr>
                    <tr><td>Court Costs & Fees</td><td>${formatCurrency(data.additionalFields?.['costs'] as number || 0)}</td></tr>
                    <tr><td><strong>Total Amount Due</strong></td><td class="amount-highlight">${formatCurrency(data.totalDue)}</td></tr>
                </table>
            </div>

            <div class="deadline">
                ⚠️ PAYMENT DEADLINE: 30 days from the date of this letter
            </div>

            <div class="section">
                <p class="body-text">
                    Failure to remit payment or contact our office to arrange a satisfactory payment plan within the time 
                    specified may result in further legal action, including but not limited to: wage garnishment, bank 
                    account levy, property liens, and asset seizure.
                </p>
            </div>
        `,

        'Final Demand Letter': `
            <div class="legal-notice">
                <strong>FINAL NOTICE BEFORE ENFORCEMENT ACTION</strong><br>
                This is your final opportunity to resolve this matter before we proceed with enforcement remedies.
            </div>

            <div class="section">
                <div class="section-title">Outstanding Judgment</div>
                <table class="info-table">
                    <tr><td>Judgment Amount</td><td>${formatCurrency(data.judgmentAmount)}</td></tr>
                    <tr><td>Accumulated Interest</td><td>${formatCurrency(data.interestAccrued)}</td></tr>
                    <tr><td><strong>Total Currently Due</strong></td><td class="amount-highlight">${formatCurrency(data.totalDue)}</td></tr>
                </table>
            </div>

            <div class="deadline">
                ⚠️ IMMEDIATE ACTION REQUIRED: You have 10 DAYS to respond
            </div>

            <div class="section">
                <p class="body-text">
                    If we do not receive full payment or an acceptable payment arrangement within 10 days of this letter,
                    we will immediately proceed with all available post-judgment remedies without further notice.
                </p>
            </div>
        `,

        'Wage Garnishment Writ': `
            <div class="section">
                <div class="section-title">Writ of Continuing Garnishment</div>
                <p class="body-text">
                    TO THE EMPLOYER/GARNISHEE: You are commanded to withhold earnings from the above-named judgment debtor 
                    and pay those earnings to the judgment creditor in accordance with applicable law.
                </p>
            </div>

            <div class="section">
                <div class="section-title">Judgment Information</div>
                <table class="info-table">
                    <tr><td>Original Judgment</td><td>${formatCurrency(data.judgmentAmount)}</td></tr>
                    <tr><td>Interest at Statutory Rate</td><td>${formatCurrency(data.interestAccrued)}</td></tr>
                    <tr><td>Total Balance Owed</td><td class="amount-highlight">${formatCurrency(data.totalDue)}</td></tr>
                </table>
            </div>

            <div class="legal-notice">
                <strong>GARNISHEE INSTRUCTIONS:</strong><br>
                1. Calculate disposable earnings (gross less mandatory deductions)<br>
                2. Apply 25% garnishment cap per federal law (15 USC §1673)<br>
                3. Remit payments within 5 days of each pay period<br>
                4. Continue until judgment satisfied or order terminated
            </div>
        `,

        'Bank Account Levy': `
            <div class="section">
                <div class="section-title">Writ of Execution - Bank Levy</div>
                <p class="body-text">
                    TO THE FINANCIAL INSTITUTION: You are hereby commanded to freeze and surrender all funds held 
                    in accounts belonging to the judgment debtor up to the amount shown below.
                </p>
            </div>

            <div class="section">
                <table class="info-table">
                    <tr><td>Judgment Amount</td><td>${formatCurrency(data.judgmentAmount)}</td></tr>
                    <tr><td>Accrued Interest</td><td>${formatCurrency(data.interestAccrued)}</td></tr>
                    <tr><td>Execution Amount</td><td class="amount-highlight">${formatCurrency(data.totalDue)}</td></tr>
                </table>
            </div>

            <div class="legal-notice">
                Upon receipt, you must immediately freeze all accounts and respond with account balances 
                within the time prescribed by ${data.jurisdiction} law.
            </div>
        `,

        'Settlement Agreement': `
            <div class="section">
                <div class="section-title">Settlement and Payment Agreement</div>
                <p class="body-text">
                    This Settlement Agreement is entered into between the Judgment Creditor and Judgment Debtor 
                    to resolve the outstanding judgment referenced above.
                </p>
            </div>

            <div class="section">
                <div class="section-title">Settlement Terms</div>
                <table class="info-table">
                    <tr><td>Original Total Due</td><td>${formatCurrency(data.totalDue)}</td></tr>
                    <tr><td>Settlement Amount</td><td class="amount-highlight">${formatCurrency(data.additionalFields?.['settlementAmount'] as number || data.totalDue * 0.7)}</td></tr>
                    <tr><td>Payment Terms</td><td>${data.additionalFields?.['paymentTerms'] || 'Lump sum within 30 days'}</td></tr>
                </table>
            </div>

            <div class="signature-section">
                <p><strong>AGREED AND ACCEPTED:</strong></p>
                <div style="display: flex; justify-content: space-between;">
                    <div>
                        <div class="signature-line"></div>
                        <div>Creditor / Authorized Representative</div>
                        <div>Date: _____________</div>
                    </div>
                    <div>
                        <div class="signature-line"></div>
                        <div>Debtor</div>
                        <div>Date: _____________</div>
                    </div>
                </div>
            </div>
        `,

        'Satisfaction of Judgment': `
            <div class="section">
                <div class="section-title">Satisfaction of Judgment</div>
                <p class="body-text">
                    The undersigned, being the judgment creditor in the above-referenced case, hereby acknowledges that 
                    the judgment entered has been fully satisfied and paid.
                </p>
            </div>

            <div class="section">
                <table class="info-table">
                    <tr><td>Case Number</td><td>${data.caseNumber}</td></tr>
                    <tr><td>Original Judgment</td><td>${formatCurrency(data.judgmentAmount)}</td></tr>
                    <tr><td>Total Collected</td><td class="amount-highlight">${formatCurrency(data.totalDue)}</td></tr>
                    <tr><td>Date Satisfied</td><td>${currentDate}</td></tr>
                </table>
            </div>

            <div class="legal-notice">
                The Clerk of Court is hereby authorized and directed to mark this judgment as satisfied of record.
            </div>

            <div class="signature-section">
                <div class="signature-line"></div>
                <div>Judgment Creditor / Authorized Representative</div>
                <div>Date: ${currentDate}</div>
            </div>
        `,
    };

    // Return template content or generic content
    return templates[data.templateName] || `
        <div class="section">
            <div class="section-title">Document Details</div>
            <table class="info-table">
                <tr><td>Case Number</td><td>${data.caseNumber || 'N/A'}</td></tr>
                <tr><td>Judgment Amount</td><td>${formatCurrency(data.judgmentAmount)}</td></tr>
                <tr><td>Accrued Interest</td><td>${formatCurrency(data.interestAccrued)}</td></tr>
                <tr><td>Total Amount Due</td><td class="amount-highlight">${formatCurrency(data.totalDue)}</td></tr>
                <tr><td>Judgment Date</td><td>${data.judgmentDate || 'N/A'}</td></tr>
                <tr><td>Jurisdiction</td><td>${data.jurisdiction}</td></tr>
            </table>
        </div>

        <div class="section">
            <p class="body-text">
                This document pertains to the collection of the above-referenced judgment. Please review all 
                information carefully and take appropriate action as required by law.
            </p>
        </div>

        <div class="signature-section">
            <div class="signature-line"></div>
            <div>Authorized Representative</div>
            <div>Date: ${currentDate}</div>
        </div>
    `;
}

// Generate and download the document as an HTML file
export function generateDocument(data: DocumentData): void {
    const html = generateDocumentHTML(data);

    // Create a blob and download it
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Create filename from template name and case number
    const filename = `${data.templateName.replace(/[^a-zA-Z0-9]/g, '_')}_${data.caseNumber || 'document'}.html`;

    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Also open in new tab for preview (user can print to PDF from there)
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
        previewWindow.document.write(html);
        previewWindow.document.close();
    }

    // Cleanup after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Generate and download as HTML file (alternative option)
export function downloadAsHTML(data: DocumentData): void {
    const html = generateDocumentHTML(data);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.templateName.replace(/\s+/g, '_')}_${data.caseNumber || 'document'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Generate a simple text version for email
export function generatePlainText(data: DocumentData): string {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);

    return `
${data.templateName.toUpperCase()}
${'='.repeat(50)}

Case Number: ${data.caseNumber || 'N/A'}
Jurisdiction: ${data.jurisdiction}
Date: ${new Date().toLocaleDateString()}

JUDGMENT INFORMATION
--------------------
Original Judgment Amount: ${formatCurrency(data.judgmentAmount)}
Accrued Interest: ${formatCurrency(data.interestAccrued)}
TOTAL AMOUNT DUE: ${formatCurrency(data.totalDue)}

${'='.repeat(50)}
Generated by Case Management System
    `.trim();
}
