import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Task, Counsel, SettlementOffer, CaseConfig } from './types';

// Extend jsPDF type for autotable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: {
            head?: string[][];
            body?: (string | number)[][];
            startY?: number;
            theme?: string;
            headStyles?: { fillColor: number[] };
            margin?: { left: number };
        }) => jsPDF;
        lastAutoTable?: { finalY: number };
    }
}

interface ReportData {
    caseConfig: CaseConfig;
    interest: number;
    tasks: Task[];
    counsel: Counsel[];
    settlements: SettlementOffer[];
    jurisdictionStats: {
        jurisdiction: string;
        openTasks: number;
        totalTasks: number;
        progress: number;
        phase: string;
    }[];
}

export function generateClientReport(data: ReportData): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(30, 64, 175); // Blue
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('SUMMARY JUDGMENT ENFORCEMENT', 14, 15);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Good Dogg Beverage Co. v. Management Services Holdings, LLC', 14, 24);
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 14, 31);

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Executive Summary Box
    let y = 45;
    doc.setFillColor(245, 247, 250);
    doc.rect(14, y, pageWidth - 28, 40, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('EXECUTIVE SUMMARY', 20, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const totalOwed = data.caseConfig.judgmentAmount + data.interest;
    const bestOffer = data.settlements.length > 0
        ? Math.max(...data.settlements.filter(s => s.status !== 'Rejected').map(s => s.amount))
        : 0;
    const openTasks = data.tasks.filter(t => t.status !== 'DONE').length;
    const completedTasks = data.tasks.filter(t => t.status === 'DONE').length;

    doc.text(`Judgment Amount: ${formatCurrency(data.caseConfig.judgmentAmount)}`, 20, y + 18);
    doc.text(`Interest Accrued: ${formatCurrency(data.interest)} (${data.caseConfig.interestRate}% annual)`, 20, y + 25);
    doc.text(`Total Owed: ${formatCurrency(totalOwed)}`, 20, y + 32);

    doc.text(`Best Offer: ${formatCurrency(bestOffer)}`, 110, y + 18);
    doc.text(`Open Tasks: ${openTasks}`, 110, y + 25);
    doc.text(`Completed: ${completedTasks} (${data.tasks.length > 0 ? Math.round((completedTasks / data.tasks.length) * 100) : 0}%)`, 110, y + 32);

    y += 48;

    // Jurisdiction Status
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('JURISDICTION STATUS', 14, y);
    y += 6;

    doc.autoTable({
        startY: y,
        head: [['Jurisdiction', 'Open Tasks', 'Progress', 'Phase']],
        body: data.jurisdictionStats.map(j => [
            j.jurisdiction === 'FL' ? 'Florida' :
                j.jurisdiction === 'TN' ? 'Tennessee' :
                    j.jurisdiction === 'IN' ? 'Indiana' : 'Colorado',
            j.openTasks.toString(),
            `${j.progress}%`,
            j.phase
        ]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: 14 },
    });

    y = (doc.lastAutoTable?.finalY || y) + 10;

    // Priority Tasks
    const priorityTasks = data.tasks.filter(t => t.priority === 'HIGH' && t.status !== 'DONE').slice(0, 5);

    if (priorityTasks.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('PRIORITY ACTIONS', 14, y);
        y += 6;

        doc.autoTable({
            startY: y,
            head: [['Task', 'Jurisdiction', 'Status', 'Due Date']],
            body: priorityTasks.map(t => [
                t.title.substring(0, 50),
                t.jurisdiction || 'N/A',
                t.status.replace('_', ' '),
                t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'
            ]),
            theme: 'striped',
            headStyles: { fillColor: [239, 68, 68] },
            margin: { left: 14 },
        });

        y = (doc.lastAutoTable?.finalY || y) + 10;
    }

    // Active Counsel
    const activeCounsel = data.counsel.filter(c => c.status === 'Active');

    if (activeCounsel.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('ACTIVE COUNSEL', 14, y);
        y += 6;

        doc.autoTable({
            startY: y,
            head: [['Name', 'Firm', 'State', 'Tasks Assigned']],
            body: activeCounsel.map(c => [
                c.name,
                c.firm,
                c.state,
                c.tasksAssigned.length.toString()
            ]),
            theme: 'striped',
            headStyles: { fillColor: [16, 185, 129] },
            margin: { left: 14 },
        });

        y = (doc.lastAutoTable?.finalY || y) + 10;
    }

    // Settlement History
    if (data.settlements.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('SETTLEMENT HISTORY', 14, y);
        y += 6;

        doc.autoTable({
            startY: y,
            head: [['Date', 'Party', 'Amount', 'Status']],
            body: data.settlements.map(s => [
                new Date(s.date).toLocaleDateString(),
                s.party,
                formatCurrency(s.amount),
                s.status
            ]),
            theme: 'striped',
            headStyles: { fillColor: [139, 92, 246] },
            margin: { left: 14 },
        });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
            `Page ${i} of ${pageCount} | Confidential - Prepared for Good Dogg Beverage Co.`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    // Save
    doc.save(`enforcement_report_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function generateTasksReport(tasks: Task[]): void {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Tasks Report', 14, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    doc.autoTable({
        startY: 35,
        head: [['Title', 'Status', 'Priority', 'Jurisdiction', 'Due Date', 'Category']],
        body: tasks.map(t => [
            t.title.substring(0, 40),
            t.status.replace('_', ' '),
            t.priority || 'MEDIUM',
            t.jurisdiction || 'N/A',
            t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A',
            t.category
        ]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`tasks_report_${new Date().toISOString().split('T')[0]}.pdf`);
}
