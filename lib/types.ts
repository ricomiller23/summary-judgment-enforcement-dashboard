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

// ============================================
// NEW: Alert System Types
// ============================================
export type AlertType = 'COURT' | 'COLLECTION' | 'ASSET_INTEL' | 'FINANCIAL' | 'ADMINISTRATIVE';
export type AlertPriority = 'CRITICAL' | 'IMPORTANT' | 'INFORMATIONAL';
export type AlertStatus = 'ACTIVE' | 'SNOOZED' | 'DISMISSED' | 'ACTIONED';

export interface Alert {
    id: string;
    type: AlertType;
    priority: AlertPriority;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    dueDate?: string;
    status: AlertStatus;
    snoozedUntil?: string;
    createdAt: string;
    relatedEntityId?: string;
    relatedEntityType?: 'task' | 'file' | 'settlement' | 'counsel' | 'asset';
}

// ============================================
// NEW: Asset Intelligence Types
// ============================================
export interface RealProperty {
    id: string;
    address: string;
    county: string;
    state: Jurisdiction;
    assessedValue: number;
    mortgageBalance: number;
    equity: number;
    homesteadExemption: boolean;
    lienFiled: boolean;
    lienFileDate?: string;
    lienNumber?: string;
    transferHistory: PropertyTransfer[];
}

export interface PropertyTransfer {
    date: string;
    toWhom: string;
    consideration: number;
    suspicious: boolean;
}

export interface BankAccount {
    id: string;
    institution: string;
    accountType: 'checking' | 'savings' | 'business' | 'investment';
    status: 'confirmed' | 'suspected' | 'garnished' | 'closed';
    lastKnownBalance?: number;
    garnishmentHistory: GarnishmentResult[];
}

export interface GarnishmentResult {
    date: string;
    amountCollected: number;
    writsId?: string;
}

export interface Vehicle {
    id: string;
    vin: string;
    makeModel: string;
    year: number;
    estimatedValue: number;
    lienholder?: string;
    loanBalance: number;
    status: 'located' | 'seized' | 'sold' | 'unknown';
}

export interface BusinessInterest {
    id: string;
    entityName: string;
    entityType: 'LLC' | 'Corporation' | 'Partnership' | 'SoleProp';
    ownershipPct: number;
    stateOfFormation: string;
    status: 'active' | 'dissolved' | 'suspended';
    annualRevenueEstimate?: number;
    keyCustomers: string[];
}

export interface OtherCreditor {
    id: string;
    creditorName: string;
    lienDate: string;
    amount: number;
    priorityPosition: number;
    securedBy: string;
}

export interface SocialIntel {
    id: string;
    platform: string;
    url: string;
    datePosted: string;
    relevance: 'HIGH' | 'MEDIUM' | 'LOW';
    notes: string;
}

export interface RecoveryProbability {
    score: number; // 0-100
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    factors: {
        assetScore: number;
        liquidityScore: number;
        cooperationScore: number;
        legalExposureScore: number;
    };
    lastUpdated: string;
}

export interface AssetIntelligence {
    debtorId: string;
    debtorName: string;
    ssn?: string; // encrypted
    ein?: string;
    dob?: string;
    currentAddress?: string;
    addresses: DebtorAddress[];
    phones: string[];
    emails: string[];
    employmentHistory: Employment[];
    knownAssociates: string[];
    realProperty: RealProperty[];
    bankAccounts: BankAccount[];
    vehicles: Vehicle[];
    businessInterests: BusinessInterest[];
    otherCreditors: OtherCreditor[];
    socialIntel: SocialIntel[];
    recoveryProbability: RecoveryProbability;
    lastUpdated: string;
}

export interface DebtorAddress {
    address: string;
    city: string;
    state: string;
    zip: string;
    verifiedDate?: string;
    source?: string;
    isCurrent: boolean;
}

export interface Employment {
    employer: string;
    position?: string;
    address?: string;
    phone?: string;
    salary?: number;
    startDate?: string;
    endDate?: string;
    isCurrent: boolean;
}

// ============================================
// NEW: Enforcement Action Types
// ============================================
export type EnforcementActionType =
    | 'wage_garnishment'
    | 'bank_levy'
    | 'ar_garnishment'
    | 'execution'
    | 'charging_order'
    | 'receivership'
    | 'fraudulent_transfer'
    | 'contempt';

export type EnforcementStatus =
    | 'planned'
    | 'filed'
    | 'served'
    | 'pending_response'
    | 'active'
    | 'collected'
    | 'terminated';

export interface EnforcementTarget {
    name: string;
    type: 'employer' | 'bank' | 'customer' | 'sheriff' | 'llc' | 'receiver' | 'transferee';
    address?: string;
    phone?: string;
    email?: string;
}

export interface EnforcementAction {
    id: string;
    caseId: string;
    actionType: EnforcementActionType;
    status: EnforcementStatus;
    jurisdiction: Jurisdiction;
    dateInitiated: string;
    documentsGenerated: string[];
    target: EnforcementTarget;
    servedDate?: string;
    responseDueDate?: string;
    costsIncurred: number;
    amountCollected: number;
    expectedRecovery: number;
    timeline: EnforcementTimelineEvent[];
    complianceStatus: 'compliant' | 'non_responsive' | 'resisting';
    nextAction?: string;
    nextActionDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface EnforcementTimelineEvent {
    date: string;
    event: string;
    notes?: string;
    documents?: string[];
}

// ============================================
// NEW: Collection Tracking Types
// ============================================
export interface CollectionRecord {
    id: string;
    date: string;
    source: 'garnishment' | 'levy' | 'settlement' | 'voluntary' | 'auction';
    amount: number;
    enforcementActionId?: string;
    appliedTo: {
        principal: number;
        interest: number;
        costs: number;
    };
    notes?: string;
}

// ============================================
// NEW: Lien Registry Types
// ============================================
export interface JudgmentLien {
    id: string;
    jurisdiction: string;
    propertyAddress?: string;
    lienFileDate: string;
    lienNumber: string;
    recordingOffice: string;
    amountAtFiling: number;
    currentAmount: number;
    expirationDate: string;
    renewalHistory: LienRenewal[];
    status: 'active' | 'expired' | 'satisfied' | 'released';
}

export interface LienRenewal {
    date: string;
    newExpiration: string;
}

export interface UCCFiling {
    id: string;
    filingState: string;
    fileDate: string;
    fileNumber: string;
    collateralDescription: string;
    amountSecured: number;
    expirationDate: string;
    continuationFiled: boolean;
    status: 'active' | 'expired' | 'terminated';
}

// ============================================
// Extended App state
// ============================================
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
    // NEW: Extended data
    alerts: Alert[];
    assetIntelligence?: AssetIntelligence;
    enforcementActions: EnforcementAction[];
    collections: CollectionRecord[];
    judgmentLiens: JudgmentLien[];
    uccFilings: UCCFiling[];
    lastDataRefresh: string;
}
