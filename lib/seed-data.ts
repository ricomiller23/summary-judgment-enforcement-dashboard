import { Party, Task, CaseFile, EmailLog, Counsel, SettlementOffer, CaseConfig } from './types';

const now = new Date().toISOString();

export const seedCaseConfig: CaseConfig = {
    judgmentAmount: 2378443.28,
    judgmentDate: '2025-11-25',
    interestRate: 10, // FL statutory rate
    floorAmount: 1800000,
    caseNumber: '05-2024-CA-050807'
};

export const seedParties: Party[] = [
    {
        id: 'p1',
        name: 'Good Dogg Beverage Company, LLC',
        role: 'Plaintiff',
        jurisdiction: 'FL',
        notes: 'Judgment creditor - Florida entity'
    },
    {
        id: 'p2',
        name: 'Management Services Holdings, LLC',
        role: 'Defendant',
        jurisdiction: 'TN',
        notes: 'Judgment debtor - Tennessee entity, defaulted'
    },
    {
        id: 'p3',
        name: 'MSH Principal - Indiana',
        role: 'Principal',
        jurisdiction: 'IN',
        notes: 'Potential alter-ego liability'
    },
    {
        id: 'p4',
        name: 'MSH Principal - Colorado',
        role: 'Principal',
        jurisdiction: 'CO',
        notes: 'Secondary enforcement target'
    }
];

export const seedCounsel: Counsel[] = [
    {
        id: 'c1',
        name: 'Josh A. Porteous',
        firm: 'Widerman Malek, PL',
        address: 'Melbourne, FL',
        state: 'FL',
        email: 'jporteous@uslegalteam.com',
        phone: '(321) 255-2332',
        status: 'Active',
        caseNumber: '05-2024-CA-050807',
        tasksAssigned: ['t1', 't2'],
        emailLog: ['e1', 'e2'],
        lastContact: '2025-11-26',
        notes: 'Lead counsel on FL enforcement',
        createdAt: now,
        updatedAt: now
    }
];

export const seedFiles: CaseFile[] = [
    {
        id: 'f1',
        title: '2024-10-15_Complaint.pdf',
        fileType: 'COMPLAINT',
        jurisdiction: 'FL',
        date: '2024-10-15',
        notes: 'Original complaint filed in Brevard County, FL',
        excerpt: 'Breach of settlement agreement between Good Dogg Beverage Company and MSH...',
        createdAt: now,
        updatedAt: now
    },
    {
        id: 'f2',
        title: '225667853-Order.pdf',
        fileType: 'ORDER',
        jurisdiction: 'FL',
        date: '2025-06-19',
        notes: 'Court order on discovery compliance',
        createdAt: now,
        updatedAt: now
    },
    {
        id: 'f3',
        title: '2025-05-22_Ltr-to-Client-re-NOH.pdf',
        fileType: 'LETTER',
        jurisdiction: 'FL',
        date: '2025-05-22',
        notes: 'Notice of Hearing correspondence',
        createdAt: now,
        updatedAt: now
    },
    {
        id: 'f4',
        title: '2025-11-26_Ltr-to-Client-re-Default-FJ.pdf',
        fileType: 'JUDGMENT',
        jurisdiction: 'FL',
        date: '2025-11-25',
        notes: 'Default Final Judgment - $2,378,443.28',
        excerpt: 'Default Final Judgment awarding $2,378,443.28 to Plaintiff Good Dogg Beverage Company...',
        createdAt: now,
        updatedAt: now
    },
    {
        id: 'f5',
        title: 'MSH-Letter-and-Affidavit-11.16.2023.pdf',
        fileType: 'AFFIDAVIT',
        jurisdiction: 'IN',
        date: '2023-11-16',
        notes: 'Affidavit related to Indiana principal',
        excerpt: 'McClung control and ownership of MSH operations...',
        createdAt: now,
        updatedAt: now
    }
];

export const seedTasks: Task[] = [
    {
        id: 't1',
        title: 'Motion to compel Form 1.977 compliance',
        description: 'File motion to compel defendant compliance with Florida Form 1.977 post-judgment discovery',
        jurisdiction: 'FL',
        category: 'MOTION',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: '2026-01-15',
        linkedFileIds: ['f2'],
        assignedCounselId: 'c1',
        createdAt: now,
        updatedAt: now
    },
    {
        id: 't2',
        title: 'File judgment lien certificate with FL Sec. of State',
        description: 'Record judgment lien with Florida Secretary of State for asset protection',
        jurisdiction: 'FL',
        category: 'EXECUTION',
        status: 'THIS_WEEK',
        priority: 'HIGH',
        linkedFileIds: ['f4'],
        assignedCounselId: 'c1',
        createdAt: now,
        updatedAt: now
    },
    {
        id: 't3',
        title: 'Domesticate FL judgment in Tennessee',
        description: 'File domestication action in Tennessee to enforce against MSH assets',
        jurisdiction: 'TN',
        category: 'DOMESTICATION',
        status: 'THIS_WEEK',
        priority: 'HIGH',
        linkedFileIds: ['f4'],
        linkedPartyIds: ['p2'],
        createdAt: now,
        updatedAt: now
    },
    {
        id: 't4',
        title: 'Serve post-judgment discovery on MSH (TN)',
        description: 'Serve interrogatories and document requests on MSH in Tennessee',
        jurisdiction: 'TN',
        category: 'DISCOVERY',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        linkedPartyIds: ['p2'],
        createdAt: now,
        updatedAt: now
    },
    {
        id: 't5',
        title: 'ID IN principal + evaluate alter-ego claim',
        description: 'Research Indiana principal identity and assess alter-ego/veil piercing claim viability',
        jurisdiction: 'IN',
        category: 'RESEARCH',
        status: 'BACKLOG',
        priority: 'HIGH',
        linkedPartyIds: ['p3'],
        linkedFileIds: ['f5'],
        createdAt: now,
        updatedAt: now
    },
    {
        id: 't6',
        title: 'Domesticate judgment in Indiana',
        description: 'File domestication action in Indiana once principal is identified',
        jurisdiction: 'IN',
        category: 'DOMESTICATION',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        linkedPartyIds: ['p3'],
        createdAt: now,
        updatedAt: now
    },
    {
        id: 't7',
        title: 'Confirm CO principal domicile + assets',
        description: 'Investigate Colorado principal location and potential assets for collection',
        jurisdiction: 'CO',
        category: 'RESEARCH',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        linkedPartyIds: ['p4'],
        createdAt: now,
        updatedAt: now
    },
    {
        id: 't8',
        title: 'Domesticate judgment in Colorado',
        description: 'File domestication action in Colorado',
        jurisdiction: 'CO',
        category: 'DOMESTICATION',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        linkedPartyIds: ['p4'],
        createdAt: now,
        updatedAt: now
    }
];

export const seedEmails: EmailLog[] = [
    {
        id: 'e1',
        subject: 'Re: Default Final Judgment Entered - Good Dogg v. MSH',
        summary: 'Notification to client regarding entry of default final judgment for $2,378,443.28',
        from: 'jporteous@uslegalteam.com',
        to: 'client@gooddogg.com',
        date: '2025-11-26',
        type: 'CLIENT',
        jurisdiction: 'FL',
        linkedFileIds: ['f4'],
        linkedTaskIds: ['t1', 't2']
    },
    {
        id: 'e2',
        subject: 'Domestication Strategy - TN/IN/CO',
        summary: 'Strategy memo outlining multi-state domestication and enforcement approach',
        from: 'jporteous@uslegalteam.com',
        to: 'client@gooddogg.com',
        date: '2025-12-15',
        type: 'CLIENT',
        linkedTaskIds: ['t3', 't6', 't8']
    },
    {
        id: 'e3',
        subject: 'MSH Principal Investigation Update',
        summary: 'Update on investigation into MSH principals in Indiana and Colorado',
        from: 'investigator@vendor.com',
        to: 'jporteous@uslegalteam.com',
        date: '2025-12-20',
        type: 'VENDOR',
        jurisdiction: 'IN',
        linkedTaskIds: ['t5', 't7'],
        linkedPartyIds: ['p3', 'p4']
    }
];

export const seedSettlements: SettlementOffer[] = [];
