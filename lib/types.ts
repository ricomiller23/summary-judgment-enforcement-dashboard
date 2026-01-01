// Jurisdiction types
export type Jurisdiction = 'FL' | 'TN' | 'IN' | 'CO';

// Party types
export type PartyRole = 'Plaintiff' | 'Defendant' | 'Principal' | 'Counsel';

export interface Party {
    id: string;
    name: string;
    role: PartyRole;
    jurisdiction?: Jurisdiction;
    notes?: string;
}

// Task types
export type TaskStatus = 'BACKLOG' | 'THIS_WEEK' | 'IN_PROGRESS' | 'WAITING' | 'DONE';
export type TaskCategory = 'DOMESTICATION' | 'DISCOVERY' | 'MOTION' | 'EXECUTION' | 'COMMUNICATION' | 'RESEARCH';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
    id: string;
    title: string;
    description?: string;
    jurisdiction?: Jurisdiction;
    category: TaskCategory;
    status: TaskStatus;
    dueDate?: string;
    priority?: Priority;
    linkedFileIds?: string[];
    linkedPartyIds?: string[];
    assignedCounselId?: string;
    createdAt: string;
    updatedAt: string;
}

// File types
export type FileType = 'COMPLAINT' | 'ORDER' | 'JUDGMENT' | 'AFFIDAVIT' | 'LETTER' | 'NOTICE' | 'EMAIL_EXPORT' | 'OTHER';

export interface CaseFile {
    id: string;
    title: string;
    fileType: FileType;
    jurisdiction?: Jurisdiction;
    partyId?: string;
    date?: string;
    storageHint?: string;
    url?: string;
    notes?: string;
    size?: number;
    pages?: number;
    text?: string;
    excerpt?: string;
    createdAt: string;
    updatedAt: string;
}

// Email types
export type EmailType = 'CLIENT' | 'OPPOSING_COUNSEL' | 'COURT' | 'VENDOR' | 'OTHER';

export interface EmailLog {
    id: string;
    subject: string;
    summary: string;
    from: string;
    to: string;
    date: string;
    type: EmailType;
    jurisdiction?: Jurisdiction;
    linkedTaskIds?: string[];
    linkedFileIds?: string[];
    linkedPartyIds?: string[];
}

// Counsel types
export type CounselStatus = 'Active' | 'Pending' | 'Inactive';

export interface Counsel {
    id: string;
    name: string;
    firm: string;
    address?: string;
    state: Jurisdiction;
    email: string;
    phone?: string;
    status: CounselStatus;
    caseNumber?: string;
    tasksAssigned: string[];
    emailLog: string[];
    lastContact: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// Settlement types
export type SettlementStatus = 'Review' | 'Countered' | 'Accepted' | 'Rejected';

export interface SettlementOffer {
    id: string;
    date: string;
    party: string;
    amount: number;
    terms: string;
    status: SettlementStatus;
    counterAmount?: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// Case Configuration
export interface CaseConfig {
    judgmentAmount: number;
    judgmentDate: string;
    interestRate: number;
    floorAmount: number;
    caseNumber?: string;
}

// App state
export interface AppData {
    parties: Party[];
    tasks: Task[];
    files: CaseFile[];
    emails: EmailLog[];
    counsel: Counsel[];
    settlements: SettlementOffer[];
    caseConfig: CaseConfig;
    initialized: boolean;
    darkMode: boolean;
}
