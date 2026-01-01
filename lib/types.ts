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

// App state
export interface AppData {
    parties: Party[];
    tasks: Task[];
    files: CaseFile[];
    emails: EmailLog[];
    initialized: boolean;
}
