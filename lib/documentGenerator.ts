// Legal Document Generation Utility
// Creates properly formatted legal documents following standard law practice conventions

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
    courtName?: string;
    additionalFields?: Record<string, string | number>;
}

// Standard legal document CSS styling
const LEGAL_DOCUMENT_STYLES = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 12pt;
        line-height: 2;
        color: #000;
        padding: 1in;
        max-width: 8.5in;
        margin: 0 auto;
        background: white;
    }
    
    /* Court Caption Block */
    .court-caption {
        text-align: center;
        margin-bottom: 24pt;
        padding-bottom: 12pt;
        border-bottom: 1px solid #000;
    }
    .court-name {
        font-size: 12pt;
        font-weight: bold;
        text-transform: uppercase;
        margin-bottom: 12pt;
    }
    .case-style {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin: 12pt 0;
    }
    .parties {
        text-align: left;
        width: 50%;
    }
    .case-info-block {
        text-align: left;
        width: 40%;
    }
    .party-line {
        margin: 4pt 0;
    }
    .vs-line {
        margin: 8pt 0 8pt 48pt;
    }
    
    /* Document Title */
    .document-title {
        text-align: center;
        font-size: 14pt;
        font-weight: bold;
        text-transform: uppercase;
        margin: 24pt 0;
        text-decoration: underline;
    }
    
    /* Body Content */
    .section {
        margin-bottom: 18pt;
    }
    .section-heading {
        font-weight: bold;
        text-transform: uppercase;
        font-size: 12pt;
        margin-bottom: 12pt;
    }
    .paragraph {
        text-align: justify;
        text-indent: 0.5in;
        margin-bottom: 12pt;
        line-height: 2;
    }
    .paragraph-numbered {
        margin-left: 0.5in;
        text-indent: -0.5in;
        margin-bottom: 12pt;
    }
    .legal-citation {
        font-style: italic;
    }
    
    /* Tables */
    .amount-table {
        width: 100%;
        border-collapse: collapse;
        margin: 12pt 0;
    }
    .amount-table td, .amount-table th {
        padding: 8pt 12pt;
        border: 1px solid #000;
        text-align: left;
    }
    .amount-table th {
        background: #f0f0f0;
        font-weight: bold;
    }
    .amount-total {
        font-weight: bold;
        font-size: 14pt;
    }
    
    /* Special Notices */
    .legal-notice {
        border: 2px solid #000;
        padding: 12pt;
        margin: 18pt 0;
        font-weight: bold;
        text-align: center;
    }
    .deadline-notice {
        background: #fff3cd;
        border: 1px solid #856404;
        padding: 12pt;
        margin: 18pt 0;
        text-align: center;
        font-weight: bold;
    }
    
    /* Signature Block */
    .signature-block {
        margin-top: 48pt;
        page-break-inside: avoid;
    }
    .signature-line {
        border-bottom: 1px solid #000;
        width: 3in;
        margin: 36pt 0 6pt 0;
    }
    .signature-name {
        font-weight: bold;
    }
    .signature-title {
        font-style: italic;
    }
    
    /* Certificate of Service */
    .certificate-of-service {
        margin-top: 48pt;
        padding-top: 24pt;
        border-top: 1px solid #000;
    }
    
    /* Footer */
    .document-footer {
        position: fixed;
        bottom: 0.5in;
        left: 1in;
        right: 1in;
        text-align: center;
        font-size: 10pt;
        color: #666;
        border-top: 1px solid #ccc;
        padding-top: 6pt;
    }
    
    /* Print Styles */
    @media print {
        body { padding: 0.75in; }
        .document-footer { position: fixed; }
    }
    
    /* Page number */
    @page { margin: 1in; }
`;

// Generate the complete HTML document
function generateDocumentHTML(data: DocumentData): string {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const templateContent = getTemplateContent(data);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.templateName} - Case ${data.caseNumber || 'N/A'}</title>
    <style>${LEGAL_DOCUMENT_STYLES}</style>
</head>
<body>
${templateContent}
</body>
</html>`;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

function getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

function getCourtCaption(data: DocumentData, documentTitle: string): string {
    const courtName = data.courtName || `CIRCUIT COURT OF THE ${data.jurisdiction === 'FL' ? 'SEVENTEENTH' : 'DISTRICT'} JUDICIAL CIRCUIT`;
    const countyState = data.jurisdiction === 'FL' ? 'BROWARD COUNTY, FLORIDA' :
        data.jurisdiction === 'TN' ? 'DAVIDSON COUNTY, TENNESSEE' :
            data.jurisdiction === 'IN' ? 'MARION COUNTY, INDIANA' :
                data.jurisdiction === 'CO' ? 'DENVER COUNTY, COLORADO' :
                    'STATE COURT';

    return `
    <div class="court-caption">
        <div class="court-name">IN THE ${courtName}</div>
        <div class="court-name">IN AND FOR ${countyState}</div>
        
        <div class="case-style">
            <div class="parties">
                <div class="party-line"><strong>${data.creditorName || 'JUDGMENT CREDITOR'}</strong>,</div>
                <div class="party-line" style="margin-left: 48pt;">Judgment Creditor/Plaintiff,</div>
                <div class="vs-line">vs.</div>
                <div class="party-line"><strong>${data.debtorName || 'JUDGMENT DEBTOR'}</strong>,</div>
                <div class="party-line" style="margin-left: 48pt;">Judgment Debtor/Defendant.</div>
            </div>
            <div class="case-info-block">
                <div><strong>Case No.:</strong> ${data.caseNumber || '_____________'}</div>
                <div><strong>Division:</strong> Civil</div>
            </div>
        </div>
    </div>
    
    <div class="document-title">${documentTitle}</div>
    `;
}

function getSignatureBlock(includeNotary: boolean = false): string {
    const notaryBlock = includeNotary ? `
    <div style="margin-top: 48pt;">
        <div><strong>STATE OF _____________</strong></div>
        <div><strong>COUNTY OF _____________</strong></div>
        <div style="margin-top: 12pt;">
            The foregoing instrument was acknowledged before me this _____ day of _____________, 20___, 
            by _________________________, who is personally known to me or who has produced 
            _________________________ as identification.
        </div>
        <div class="signature-line"></div>
        <div>Notary Public, State of _____________</div>
        <div>My Commission Expires: _____________</div>
    </div>
    ` : '';

    return `
    <div class="signature-block">
        <div style="text-align: right;">
            <div>Respectfully submitted,</div>
            <div class="signature-line" style="margin-left: auto;"></div>
            <div class="signature-name">_____________________________</div>
            <div>Attorney for Judgment Creditor</div>
            <div>Florida Bar No.: _____________</div>
            <div>Address: _____________________</div>
            <div>Phone: _______________________</div>
            <div>Email: _______________________</div>
        </div>
    </div>
    ${notaryBlock}
    `;
}

function getCertificateOfService(data: DocumentData): string {
    return `
    <div class="certificate-of-service">
        <div class="section-heading">CERTIFICATE OF SERVICE</div>
        <div class="paragraph">
            I HEREBY CERTIFY that a true and correct copy of the foregoing was furnished by 
            [  ] U.S. Mail  [  ] Hand Delivery  [  ] Facsimile  [  ] Email  
            this _____ day of _____________, 20___, to:
        </div>
        <div style="margin-left: 48pt; margin-top: 12pt;">
            <div>${data.debtorName || 'Judgment Debtor'}</div>
            <div>${data.debtorAddress || '[ADDRESS]'}</div>
        </div>
        <div class="signature-line" style="margin-top: 24pt;"></div>
        <div>Attorney for Judgment Creditor</div>
    </div>
    `;
}

function getTemplateContent(data: DocumentData): string {
    const templates: Record<string, string> = {
        'Initial Demand Letter': `
            <div style="text-align: right; margin-bottom: 24pt;">
                <div>${getCurrentDate()}</div>
            </div>
            
            <div style="margin-bottom: 24pt;">
                <div><strong>VIA CERTIFIED MAIL, RETURN RECEIPT REQUESTED</strong></div>
                <div style="margin-top: 12pt;">
                    <div>${data.debtorName || '[DEBTOR NAME]'}</div>
                    <div>${data.debtorAddress || '[DEBTOR ADDRESS]'}</div>
                </div>
            </div>
            
            <div style="margin-bottom: 24pt;">
                <div><strong>RE:</strong> Demand for Payment of Judgment</div>
                <div style="margin-left: 36pt;">
                    Case Number: ${data.caseNumber || '[CASE NUMBER]'}<br>
                    ${data.creditorName || 'Judgment Creditor'} v. ${data.debtorName || 'Judgment Debtor'}
                </div>
            </div>
            
            <div class="paragraph">
                Dear ${data.debtorName || 'Sir or Madam'}:
            </div>
            
            <div class="paragraph">
                Please be advised that this office represents ${data.creditorName || 'the Judgment Creditor'} 
                in the above-referenced matter. On ${data.judgmentDate || '[DATE]'}, a Final Judgment was entered 
                against you in the ${data.jurisdiction === 'FL' ? 'Circuit Court of Florida' : 'Court'} in the 
                amount set forth below.
            </div>
            
            <div class="section-heading">AMOUNT CURRENTLY OWED</div>
            <table class="amount-table">
                <tr>
                    <th>Description</th>
                    <th style="text-align: right;">Amount</th>
                </tr>
                <tr>
                    <td>Original Judgment Amount</td>
                    <td style="text-align: right;">${formatCurrency(data.judgmentAmount)}</td>
                </tr>
                <tr>
                    <td>Post-Judgment Interest (Statutory Rate)</td>
                    <td style="text-align: right;">${formatCurrency(data.interestAccrued)}</td>
                </tr>
                <tr>
                    <td>Court Costs and Attorney's Fees</td>
                    <td style="text-align: right;">${formatCurrency((data.additionalFields?.['costs'] as number) || 0)}</td>
                </tr>
                <tr>
                    <td class="amount-total">TOTAL AMOUNT DUE AND OWING</td>
                    <td style="text-align: right;" class="amount-total">${formatCurrency(data.totalDue)}</td>
                </tr>
            </table>
            
            <div class="deadline-notice">
                ⚠️ DEMAND IS HEREBY MADE for payment of the above sum within THIRTY (30) DAYS 
                from the date of this letter.
            </div>
            
            <div class="paragraph">
                In the event full payment is not received within thirty (30) days of the date of this letter, 
                we will proceed with all available post-judgment collection remedies without further notice, 
                including but not limited to:
            </div>
            
            <div style="margin-left: 48pt; margin-bottom: 12pt;">
                <div>• Wage garnishment proceedings;</div>
                <div>• Bank account levy and attachment;</div>
                <div>• Recording of judgment liens against real property;</div>
                <div>• Execution against personal property;</div>
                <div>• Debtor examination proceedings.</div>
            </div>
            
            <div class="paragraph">
                These enforcement actions will result in additional costs, attorney's fees, and interest 
                being added to the judgment amount for which you will be responsible.
            </div>
            
            <div class="paragraph">
                If you wish to discuss payment arrangements or have questions regarding this matter, 
                please contact our office immediately at the number below.
            </div>
            
            <div class="signature-block">
                <div>Very truly yours,</div>
                <div class="signature-line"></div>
                <div class="signature-name">[ATTORNEY NAME]</div>
                <div class="signature-title">Attorney for ${data.creditorName || 'Judgment Creditor'}</div>
                <div style="margin-top: 12pt;">
                    <div>[LAW FIRM NAME]</div>
                    <div>[ADDRESS]</div>
                    <div>[PHONE] | [FAX]</div>
                    <div>[EMAIL]</div>
                </div>
            </div>
        `,

        'Final Demand Letter': `
            <div class="legal-notice">
                ⚠️ FINAL NOTICE BEFORE ENFORCEMENT ACTION<br>
                IMMEDIATE RESPONSE REQUIRED
            </div>
            
            <div style="text-align: right; margin-bottom: 24pt;">
                <div>${getCurrentDate()}</div>
            </div>
            
            <div style="margin-bottom: 24pt;">
                <div><strong>VIA CERTIFIED MAIL, RETURN RECEIPT REQUESTED</strong></div>
                <div style="margin-top: 12pt;">
                    <div>${data.debtorName || '[DEBTOR NAME]'}</div>
                    <div>${data.debtorAddress || '[DEBTOR ADDRESS]'}</div>
                </div>
            </div>
            
            <div style="margin-bottom: 24pt;">
                <div><strong>RE:</strong> FINAL DEMAND - Judgment Collection</div>
                <div style="margin-left: 36pt;">
                    Case Number: ${data.caseNumber || '[CASE NUMBER]'}<br>
                    Original Judgment Date: ${data.judgmentDate || '[DATE]'}
                </div>
            </div>
            
            <div class="paragraph">
                Dear ${data.debtorName || 'Sir or Madam'}:
            </div>
            
            <div class="paragraph">
                <strong>This is your FINAL NOTICE</strong> regarding the outstanding judgment entered against 
                you in the above-referenced case. Despite previous correspondence, we have received no payment 
                or communication from you regarding this obligation.
            </div>
            
            <table class="amount-table">
                <tr><th colspan="2" style="text-align: center;">JUDGMENT BALANCE</th></tr>
                <tr>
                    <td>Principal Judgment</td>
                    <td style="text-align: right;">${formatCurrency(data.judgmentAmount)}</td>
                </tr>
                <tr>
                    <td>Accrued Interest to Date</td>
                    <td style="text-align: right;">${formatCurrency(data.interestAccrued)}</td>
                </tr>
                <tr style="background: #fff3cd;">
                    <td class="amount-total">TOTAL DUE IMMEDIATELY</td>
                    <td style="text-align: right;" class="amount-total">${formatCurrency(data.totalDue)}</td>
                </tr>
            </table>
            
            <div class="deadline-notice">
                YOU HAVE TEN (10) DAYS from the date of this letter to remit full payment 
                or contact our office to establish an acceptable payment arrangement.
            </div>
            
            <div class="paragraph">
                <strong>IF PAYMENT IS NOT RECEIVED WITHIN TEN (10) DAYS</strong>, we will immediately 
                proceed with all available legal remedies to collect this judgment including, but not 
                limited to, wage garnishment, bank account levy, real property liens, and asset seizure.
            </div>
            
            <div class="paragraph">
                <strong>GOVERN YOURSELF ACCORDINGLY.</strong>
            </div>
            
            <div class="signature-block">
                <div>Very truly yours,</div>
                <div class="signature-line"></div>
                <div class="signature-name">[ATTORNEY NAME]</div>
                <div class="signature-title">Attorney for Judgment Creditor</div>
            </div>
        `,

        'Wage Garnishment Writ': `
            ${getCourtCaption(data, 'WRIT OF CONTINUING GARNISHMENT')}
            
            <div class="paragraph">
                THE STATE OF ${data.jurisdiction === 'FL' ? 'FLORIDA' : data.jurisdiction}
            </div>
            
            <div class="paragraph">
                <strong>TO:</strong> [EMPLOYER NAME AND ADDRESS - GARNISHEE]
            </div>
            
            <div class="paragraph">
                <strong>YOU ARE COMMANDED</strong> to withhold from the earnings of the above-named 
                Judgment Debtor/Defendant that portion of earnings permitted by law and to pay the 
                same to the Judgment Creditor, or attorney for the Judgment Creditor, until the 
                judgment and all costs are fully satisfied or until this Writ is released by the Court.
            </div>
            
            <div class="section-heading">JUDGMENT INFORMATION</div>
            <table class="amount-table">
                <tr>
                    <td>Original Judgment Amount</td>
                    <td style="text-align: right;">${formatCurrency(data.judgmentAmount)}</td>
                </tr>
                <tr>
                    <td>Post-Judgment Interest (Statutory Rate)</td>
                    <td style="text-align: right;">${formatCurrency(data.interestAccrued)}</td>
                </tr>
                <tr>
                    <td>Court Costs</td>
                    <td style="text-align: right;">${formatCurrency((data.additionalFields?.['costs'] as number) || 0)}</td>
                </tr>
                <tr>
                    <td class="amount-total">Total Balance Due</td>
                    <td style="text-align: right;" class="amount-total">${formatCurrency(data.totalDue)}</td>
                </tr>
            </table>
            
            <div class="legal-notice">
                IMPORTANT INSTRUCTIONS FOR GARNISHEE (EMPLOYER)
            </div>
            
            <div class="paragraph">
                <strong>1. CALCULATION OF GARNISHABLE AMOUNT:</strong> Calculate the Judgment Debtor's 
                "disposable earnings" (gross earnings less deductions required by law such as federal, 
                state, and local taxes, social security, and Medicare).
            </div>
            
            <div class="paragraph">
                <strong>2. MAXIMUM WITHHOLDING:</strong> Under the Consumer Credit Protection Act, 
                15 U.S.C. § 1673, the maximum amount that may be garnished is the LESSER of:
            </div>
            
            <div style="margin-left: 48pt; margin-bottom: 12pt;">
                <div>(a) 25% of disposable earnings; OR</div>
                <div>(b) The amount by which disposable earnings exceed 30 times the federal minimum wage.</div>
            </div>
            
            <div class="paragraph">
                <strong>3. PAYMENT:</strong> Remit all withheld amounts to the undersigned attorney 
                within five (5) business days after each pay period in which wages are withheld.
            </div>
            
            <div class="paragraph">
                <strong>4. CONTINUATION:</strong> This is a continuing writ. Continue to withhold 
                and remit the prescribed amounts from each successive paycheck until notified that 
                the judgment is satisfied or until this writ is otherwise terminated by the Court.
            </div>
            
            <div class="paragraph">
                <strong>5. ANSWER REQUIRED:</strong> You are required to file an Answer to this 
                Garnishment within the time prescribed by ${data.jurisdiction} law, stating whether 
                the Judgment Debtor is employed by you and the amount of earnings subject to garnishment.
            </div>
            
            <div class="paragraph">
                <strong>FAILURE TO COMPLY</strong> with this Writ may subject you to liability for 
                the full amount of the judgment plus court costs, attorney's fees, and interest.
            </div>
            
            ${getSignatureBlock()}
            ${getCertificateOfService(data)}
        `,

        'Bank Account Levy': `
            ${getCourtCaption(data, 'WRIT OF EXECUTION (BANK LEVY)')}
            
            <div class="paragraph">
                <strong>TO:</strong> [FINANCIAL INSTITUTION NAME]<br>
                [FINANCIAL INSTITUTION ADDRESS]
            </div>
            
            <div class="paragraph">
                <strong>GREETINGS:</strong>
            </div>
            
            <div class="paragraph">
                WHEREAS, on ${data.judgmentDate || '[DATE]'}, a judgment was rendered in the 
                above-entitled action in favor of ${data.creditorName || 'Judgment Creditor'} 
                and against ${data.debtorName || 'Judgment Debtor'} in the total sum set forth below;
            </div>
            
            <div class="paragraph">
                <strong>NOW, THEREFORE, YOU ARE HEREBY COMMANDED</strong> to immediately freeze, hold, 
                and surrender to the levying officer all funds, deposits, accounts, certificates of 
                deposit, safe deposit box contents, and other property of the Judgment Debtor in your 
                possession, custody, or control, up to the amounts necessary to satisfy this judgment:
            </div>
            
            <table class="amount-table">
                <tr>
                    <td>Judgment Amount</td>
                    <td style="text-align: right;">${formatCurrency(data.judgmentAmount)}</td>
                </tr>
                <tr>
                    <td>Accrued Interest</td>
                    <td style="text-align: right;">${formatCurrency(data.interestAccrued)}</td>
                </tr>
                <tr>
                    <td>Levy/Execution Costs</td>
                    <td style="text-align: right;">${formatCurrency((data.additionalFields?.['costs'] as number) || 150)}</td>
                </tr>
                <tr style="background: #f0f0f0;">
                    <td class="amount-total">TOTAL EXECUTION AMOUNT</td>
                    <td style="text-align: right;" class="amount-total">${formatCurrency(data.totalDue)}</td>
                </tr>
            </table>
            
            <div class="section-heading">INSTRUCTIONS TO GARNISHEE (FINANCIAL INSTITUTION)</div>
            
            <div class="paragraph-numbered">
                <strong>1.</strong> Upon receipt of this Writ, you shall immediately freeze all accounts 
                held in the name of the Judgment Debtor, individually or jointly, to the extent of 
                the execution amount stated above.
            </div>
            
            <div class="paragraph-numbered">
                <strong>2.</strong> You shall search all accounts associated with the Judgment Debtor's 
                name, Social Security Number, and Tax Identification Number.
            </div>
            
            <div class="paragraph-numbered">
                <strong>3.</strong> Within the time prescribed by law, you shall file a Garnishee's Answer 
                disclosing all accounts, their balances, and any claims or offsets against said accounts.
            </div>
            
            <div class="paragraph-numbered">
                <strong>4.</strong> You shall surrender the frozen funds to the levying officer upon 
                the expiration of the debtor's time to claim exemptions, unless otherwise ordered by 
                the Court.
            </div>
            
            <div class="legal-notice">
                NOTICE TO JUDGMENT DEBTOR<br><br>
                Certain funds may be exempt from garnishment under federal and state law, including but 
                not limited to Social Security benefits, Supplemental Security Income (SSI), Veterans 
                benefits, and certain retirement income. If you believe any funds are exempt, you must 
                file a Claim of Exemption with the Court within the time prescribed by law.
            </div>
            
            ${getSignatureBlock()}
            ${getCertificateOfService(data)}
        `,

        'Settlement Agreement': `
            <div class="document-title">SETTLEMENT AGREEMENT AND MUTUAL RELEASE</div>
            
            <div class="paragraph">
                This Settlement Agreement and Mutual Release ("Agreement") is entered into as of 
                ${getCurrentDate()} ("Effective Date"), by and between:
            </div>
            
            <div style="margin-left: 48pt; margin-bottom: 12pt;">
                <div><strong>${data.creditorName || '[CREDITOR NAME]'}</strong> ("Creditor")</div>
                <div style="margin: 12pt 0;">and</div>
                <div><strong>${data.debtorName || '[DEBTOR NAME]'}</strong> ("Debtor")</div>
            </div>
            
            <div class="paragraph">
                (collectively referred to as the "Parties").
            </div>
            
            <div class="section-heading">RECITALS</div>
            
            <div class="paragraph">
                <strong>WHEREAS</strong>, a judgment was entered in Case No. ${data.caseNumber || '[CASE NUMBER]'} 
                in favor of Creditor and against Debtor on ${data.judgmentDate || '[DATE]'}; and
            </div>
            
            <div class="paragraph">
                <strong>WHEREAS</strong>, as of the date hereof, the outstanding balance on said judgment, 
                including principal and accrued interest, totals ${formatCurrency(data.totalDue)}; and
            </div>
            
            <div class="paragraph">
                <strong>WHEREAS</strong>, the Parties desire to fully and finally resolve this matter 
                upon the terms and conditions set forth herein;
            </div>
            
            <div class="paragraph">
                <strong>NOW, THEREFORE</strong>, in consideration of the mutual promises and covenants 
                contained herein, the Parties agree as follows:
            </div>
            
            <div class="section-heading">1. SETTLEMENT AMOUNT AND PAYMENT TERMS</div>
            
            <table class="amount-table">
                <tr>
                    <td>Total Judgment Balance</td>
                    <td style="text-align: right;">${formatCurrency(data.totalDue)}</td>
                </tr>
                <tr>
                    <td>Settlement Discount</td>
                    <td style="text-align: right;">(${formatCurrency(data.totalDue * 0.3)})</td>
                </tr>
                <tr style="background: #e8f5e9;">
                    <td class="amount-total">AGREED SETTLEMENT AMOUNT</td>
                    <td style="text-align: right;" class="amount-total">${formatCurrency(data.additionalFields?.['settlementAmount'] as number || data.totalDue * 0.7)}</td>
                </tr>
            </table>
            
            <div class="paragraph">
                Debtor agrees to pay the Settlement Amount according to the following schedule: 
                ${data.additionalFields?.['paymentTerms'] || 'Single lump sum payment due within thirty (30) days of execution of this Agreement'}.
            </div>
            
            <div class="section-heading">2. RELEASE OF CLAIMS</div>
            
            <div class="paragraph">
                Upon receipt of the full Settlement Amount, Creditor shall release and forever discharge 
                Debtor from any and all claims, demands, damages, actions, causes of action, and liabilities 
                of whatever kind or nature, known or unknown, arising out of or relating to the above-referenced 
                judgment and the underlying claims.
            </div>
            
            <div class="section-heading">3. SATISFACTION OF JUDGMENT</div>
            
            <div class="paragraph">
                Within ten (10) business days of receipt of the full Settlement Amount, Creditor shall 
                file a Satisfaction of Judgment with the Court and shall record said satisfaction with 
                any county recorder where an abstract of judgment has been recorded.
            </div>
            
            <div class="section-heading">4. NO ADMISSION OF LIABILITY</div>
            
            <div class="paragraph">
                This Agreement is entered into solely for the purpose of compromise and settlement. 
                Nothing contained herein shall be construed as an admission of liability or wrongdoing 
                by any party.
            </div>
            
            <div class="section-heading">5. CONFIDENTIALITY</div>
            
            <div class="paragraph">
                The Parties agree to keep the terms of this Agreement confidential and shall not 
                disclose the same to any third party except as required by law or to their respective 
                legal and financial advisors.
            </div>
            
            <div class="section-heading">6. GOVERNING LAW</div>
            
            <div class="paragraph">
                This Agreement shall be governed by the laws of the State of ${data.jurisdiction === 'FL' ? 'Florida' : data.jurisdiction}.
            </div>
            
            <div class="section-heading">7. ENTIRE AGREEMENT</div>
            
            <div class="paragraph">
                This Agreement constitutes the entire understanding between the Parties and supersedes 
                all prior negotiations, representations, and agreements relating to this subject matter.
            </div>
            
            <div style="margin-top: 48pt;">
                <div><strong>IN WITNESS WHEREOF</strong>, the Parties have executed this Agreement 
                as of the date first written above.</div>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-top: 36pt;">
                <div style="width: 45%;">
                    <div><strong>CREDITOR:</strong></div>
                    <div class="signature-line"></div>
                    <div>Name: ${data.creditorName || '_____________________'}</div>
                    <div>Date: _____________________</div>
                </div>
                <div style="width: 45%;">
                    <div><strong>DEBTOR:</strong></div>
                    <div class="signature-line"></div>
                    <div>Name: ${data.debtorName || '_____________________'}</div>
                    <div>Date: _____________________</div>
                </div>
            </div>
        `,

        'Satisfaction of Judgment': `
            ${getCourtCaption(data, 'SATISFACTION OF JUDGMENT')}
            
            <div class="paragraph">
                The undersigned, ${data.creditorName || '[CREDITOR NAME]'}, being the Judgment Creditor 
                in the above-styled cause, hereby acknowledges that the judgment entered herein on 
                ${data.judgmentDate || '[DATE]'}, in the original amount of ${formatCurrency(data.judgmentAmount)}, 
                together with all accrued interest, costs, and attorney's fees, has been:
            </div>
            
            <div style="text-align: center; margin: 24pt 0;">
                <div style="display: inline-block; text-align: left;">
                    <div>☐ PAID IN FULL</div>
                    <div>☐ SETTLED AND COMPROMISED</div>
                </div>
            </div>
            
            <table class="amount-table">
                <tr>
                    <th colspan="2" style="text-align: center;">JUDGMENT SATISFACTION DETAILS</th>
                </tr>
                <tr>
                    <td>Case Number</td>
                    <td>${data.caseNumber || 'N/A'}</td>
                </tr>
                <tr>
                    <td>Original Judgment Amount</td>
                    <td style="text-align: right;">${formatCurrency(data.judgmentAmount)}</td>
                </tr>
                <tr>
                    <td>Total Interest Accrued</td>
                    <td style="text-align: right;">${formatCurrency(data.interestAccrued)}</td>
                </tr>
                <tr>
                    <td>Total Amount Collected</td>
                    <td style="text-align: right;">${formatCurrency(data.totalDue)}</td>
                </tr>
                <tr>
                    <td>Date of Final Payment</td>
                    <td>${getCurrentDate()}</td>
                </tr>
            </table>
            
            <div class="paragraph">
                The Judgment Creditor hereby releases and discharges the Judgment Debtor, 
                ${data.debtorName || '[DEBTOR NAME]'}, from all further liability under said judgment.
            </div>
            
            <div class="paragraph">
                <strong>IT IS HEREBY REQUESTED</strong> that the Clerk of Court enter this Satisfaction 
                of Judgment of record and that the judgment be marked as fully satisfied.
            </div>
            
            <div class="paragraph">
                <strong>NOTICE TO CLERK:</strong> If an Abstract of Judgment has been recorded in any 
                county, a certified copy of this Satisfaction should be recorded with the appropriate 
                County Recorder to release any judgment liens.
            </div>
            
            ${getSignatureBlock(true)}
        `,

        'Proof of Claim (Form 410)': `
            <div style="text-align: center; margin-bottom: 24pt;">
                <div style="font-size: 14pt; font-weight: bold;">UNITED STATES BANKRUPTCY COURT</div>
                <div style="font-size: 12pt;">FOR THE ${data.jurisdiction === 'FL' ? 'SOUTHERN DISTRICT OF FLORIDA' : 'DISTRICT OF ' + data.jurisdiction}</div>
            </div>
            
            <div style="border: 2px solid #000; padding: 12pt; margin-bottom: 24pt;">
                <div style="text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 12pt;">
                    PROOF OF CLAIM
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <div>
                        <div><strong>Debtor:</strong> ${data.debtorName || '[DEBTOR NAME]'}</div>
                    </div>
                    <div>
                        <div><strong>Case Number:</strong> ${data.caseNumber || '[CASE NUMBER]'}</div>
                    </div>
                </div>
            </div>
            
            <div class="section-heading">PART 1: IDENTIFY THE CLAIM</div>
            
            <div style="margin-left: 24pt; margin-bottom: 18pt;">
                <div><strong>1. Amount of the Claim as of the Date the Case Was Filed:</strong></div>
                <table class="amount-table" style="width: 60%; margin-top: 12pt;">
                    <tr>
                        <td>Principal</td>
                        <td style="text-align: right;">${formatCurrency(data.judgmentAmount)}</td>
                    </tr>
                    <tr>
                        <td>Interest</td>
                        <td style="text-align: right;">${formatCurrency(data.interestAccrued)}</td>
                    </tr>
                    <tr>
                        <td class="amount-total">Total Amount of Claim</td>
                        <td style="text-align: right;" class="amount-total">${formatCurrency(data.totalDue)}</td>
                    </tr>
                </table>
            </div>
            
            <div style="margin-left: 24pt; margin-bottom: 18pt;">
                <div><strong>2. Basis for Claim:</strong></div>
                <div style="margin-top: 8pt;">☑ Judgment</div>
                <div style="margin-left: 24pt;">Date of Judgment: ${data.judgmentDate || '[DATE]'}</div>
                <div style="margin-left: 24pt;">Court: ${data.courtName || 'State Court, ' + data.jurisdiction}</div>
                <div style="margin-left: 24pt;">Case Number: ${data.caseNumber || '[CASE NUMBER]'}</div>
            </div>
            
            <div style="margin-left: 24pt; margin-bottom: 18pt;">
                <div><strong>3. Is the Claim Secured?</strong></div>
                <div style="margin-top: 8pt;">☐ Yes  ☑ No</div>
            </div>
            
            <div style="margin-left: 24pt; margin-bottom: 18pt;">
                <div><strong>4. Is the Claim Entitled to Priority Under 11 U.S.C. § 507(a)?</strong></div>
                <div style="margin-top: 8pt;">☐ Yes  ☑ No</div>
            </div>
            
            <div class="section-heading">PART 2: PROVIDE INFORMATION TO IDENTIFY THE CLAIM</div>
            
            <div style="margin-left: 24pt; margin-bottom: 18pt;">
                <div><strong>Creditor's Name and Address:</strong></div>
                <div style="margin-top: 8pt; margin-left: 24pt;">
                    ${data.creditorName || '[CREDITOR NAME]'}<br>
                    [CREDITOR ADDRESS]<br>
                    [CITY, STATE ZIP]
                </div>
            </div>
            
            <div class="section-heading">PART 3: SIGN BELOW</div>
            
            <div class="paragraph">
                The person completing this proof of claim must sign and date it. FRBP 9011(b).
            </div>
            
            <div class="paragraph">
                I declare under penalty of perjury that the information provided in this claim is 
                true and correct to the best of my knowledge, information, and reasonable belief.
            </div>
            
            <div style="margin-top: 24pt;">
                <div class="signature-line" style="width: 4in;"></div>
                <div>Signature</div>
                <div style="margin-top: 12pt;">
                    <div>Print Name: _____________________________</div>
                    <div>Title: _____________________________</div>
                    <div>Company: _____________________________</div>
                    <div>Address: _____________________________</div>
                    <div>Phone: _____________________________</div>
                    <div>Email: _____________________________</div>
                    <div style="margin-top: 12pt;">Date: ${getCurrentDate()}</div>
                </div>
            </div>
            
            <div class="legal-notice" style="margin-top: 36pt;">
                PENALTY FOR PRESENTING FRAUDULENT CLAIM: Fine of up to $500,000 or imprisonment 
                for up to 5 years, or both. 18 U.S.C. §§ 152, 157, and 3571.
            </div>
        `,
    };

    // Return the specific template or a generic document
    return templates[data.templateName] || `
        ${getCourtCaption(data, data.templateName.toUpperCase())}
        
        <div class="paragraph">
            [Document content to be completed]
        </div>
        
        <table class="amount-table">
            <tr>
                <td>Case Number</td>
                <td>${data.caseNumber || 'N/A'}</td>
            </tr>
            <tr>
                <td>Judgment Amount</td>
                <td style="text-align: right;">${formatCurrency(data.judgmentAmount)}</td>
            </tr>
            <tr>
                <td>Accrued Interest</td>
                <td style="text-align: right;">${formatCurrency(data.interestAccrued)}</td>
            </tr>
            <tr>
                <td class="amount-total">Total Amount Due</td>
                <td style="text-align: right;" class="amount-total">${formatCurrency(data.totalDue)}</td>
            </tr>
            <tr>
                <td>Judgment Date</td>
                <td>${data.judgmentDate || 'N/A'}</td>
            </tr>
            <tr>
                <td>Jurisdiction</td>
                <td>${data.jurisdiction}</td>
            </tr>
        </table>
        
        ${getSignatureBlock()}
        ${getCertificateOfService(data)}
    `;
}

// Generate and download the document
export function generateDocument(data: DocumentData): void {
    const html = generateDocumentHTML(data);

    // Create blob and download
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Create filename
    const filename = `${data.templateName.replace(/[^a-zA-Z0-9]/g, '_')}_${data.caseNumber || 'document'}.html`;

    // Download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Open preview in new tab
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
        previewWindow.document.write(html);
        previewWindow.document.close();
    }

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Export plain text version for email
export function generatePlainText(data: DocumentData): string {
    return `
${data.templateName.toUpperCase()}
${'='.repeat(60)}

Case Number: ${data.caseNumber || 'N/A'}
Jurisdiction: ${data.jurisdiction}
Date: ${new Date().toLocaleDateString()}

JUDGMENT INFORMATION
--------------------
Original Judgment Amount: ${formatCurrency(data.judgmentAmount)}
Accrued Interest: ${formatCurrency(data.interestAccrued)}
TOTAL AMOUNT DUE: ${formatCurrency(data.totalDue)}

${'='.repeat(60)}
    `.trim();
}
