import { AssetIntelligence, EnforcementAction, Alert, CollectionRecord, JudgmentLien } from './types';

const now = new Date().toISOString();

// Seed Asset Intelligence for MSH
export const seedAssetIntelligence: AssetIntelligence = {
    debtorId: 'p2',
    debtorName: 'Management Services Holdings, LLC',
    ein: '47-XXXXXX',
    currentAddress: '123 Commerce Way, Nashville, TN 37203',
    addresses: [
        {
            address: '123 Commerce Way',
            city: 'Nashville',
            state: 'TN',
            zip: '37203',
            verifiedDate: '2025-11-15',
            source: 'Secretary of State Records',
            isCurrent: true
        },
        {
            address: '456 Business Blvd',
            city: 'Franklin',
            state: 'TN',
            zip: '37067',
            verifiedDate: '2024-06-01',
            source: 'Previous Filing',
            isCurrent: false
        }
    ],
    phones: ['(615) 555-0123', '(615) 555-0456'],
    emails: ['contact@msh-holdings.com'],
    employmentHistory: [],
    knownAssociates: ['McClung (IN Principal)', 'Unknown (CO Principal)'],
    realProperty: [
        {
            id: 'rp1',
            address: '789 Industrial Park Dr, Nashville, TN 37203',
            county: 'Davidson',
            state: 'TN',
            assessedValue: 1200000,
            mortgageBalance: 450000,
            equity: 750000,
            homesteadExemption: false,
            lienFiled: false,
            transferHistory: []
        },
        {
            id: 'rp2',
            address: '321 Warehouse Lane, Nashville, TN 37210',
            county: 'Davidson',
            state: 'TN',
            assessedValue: 650000,
            mortgageBalance: 200000,
            equity: 450000,
            homesteadExemption: false,
            lienFiled: false,
            transferHistory: [
                {
                    date: '2025-10-15',
                    toWhom: 'MSH Properties, LLC',
                    consideration: 1,
                    suspicious: true
                }
            ]
        }
    ],
    bankAccounts: [
        {
            id: 'ba1',
            institution: 'First Tennessee Bank',
            accountType: 'business',
            status: 'confirmed',
            lastKnownBalance: 45000,
            garnishmentHistory: []
        },
        {
            id: 'ba2',
            institution: 'Regions Bank',
            accountType: 'checking',
            status: 'suspected',
            garnishmentHistory: []
        },
        {
            id: 'ba3',
            institution: 'SunTrust',
            accountType: 'business',
            status: 'suspected',
            garnishmentHistory: []
        }
    ],
    vehicles: [
        {
            id: 'v1',
            vin: '1HGBH41JXMN109186',
            makeModel: 'Ford F-250 Super Duty',
            year: 2023,
            estimatedValue: 65000,
            lienholder: 'Ford Credit',
            loanBalance: 35000,
            status: 'located'
        },
        {
            id: 'v2',
            vin: '2C4RDGCG5LR123456',
            makeModel: 'Ram ProMaster 3500',
            year: 2022,
            estimatedValue: 42000,
            loanBalance: 0,
            status: 'located'
        }
    ],
    businessInterests: [
        {
            id: 'bi1',
            entityName: 'MSH Properties, LLC',
            entityType: 'LLC',
            ownershipPct: 100,
            stateOfFormation: 'TN',
            status: 'active',
            annualRevenueEstimate: 0,
            keyCustomers: []
        },
        {
            id: 'bi2',
            entityName: 'MSH Consulting Group',
            entityType: 'LLC',
            ownershipPct: 50,
            stateOfFormation: 'IN',
            status: 'active',
            annualRevenueEstimate: 250000,
            keyCustomers: ['ABC Corp', 'XYZ Industries', 'Delta Services']
        }
    ],
    otherCreditors: [
        {
            id: 'oc1',
            creditorName: 'First National Bank',
            lienDate: '2024-03-15',
            amount: 320000,
            priorityPosition: 1,
            securedBy: '789 Industrial Park Dr'
        },
        {
            id: 'oc2',
            creditorName: 'Equipment Finance Co.',
            lienDate: '2024-08-20',
            amount: 85000,
            priorityPosition: 2,
            securedBy: 'Business Equipment'
        }
    ],
    socialIntel: [
        {
            id: 'si1',
            platform: 'LinkedIn',
            url: 'https://linkedin.com/company/msh-holdings',
            datePosted: '2025-12-01',
            relevance: 'MEDIUM',
            notes: 'Company page shows 15 employees, recent "expansion" post'
        },
        {
            id: 'si2',
            platform: 'Facebook',
            url: 'https://facebook.com/mshholdings',
            datePosted: '2025-11-20',
            relevance: 'LOW',
            notes: 'Business page with minimal activity'
        }
    ],
    recoveryProbability: {
        score: 67,
        confidence: 'MEDIUM',
        factors: {
            assetScore: 75,
            liquidityScore: 45,
            cooperationScore: 25,
            legalExposureScore: 80
        },
        lastUpdated: now
    },
    lastUpdated: now
};

// Seed Enforcement Actions
export const seedEnforcementActions: EnforcementAction[] = [
    {
        id: 'ea1',
        caseId: '05-2024-CA-050807',
        actionType: 'wage_garnishment',
        status: 'planned',
        jurisdiction: 'TN',
        dateInitiated: now,
        documentsGenerated: [],
        target: {
            name: 'MSH Holdings (Owner Salary)',
            type: 'employer',
            address: '123 Commerce Way, Nashville, TN 37203'
        },
        costsIncurred: 0,
        amountCollected: 0,
        expectedRecovery: 24000,
        timeline: [],
        complianceStatus: 'compliant',
        nextAction: 'File writ after TN domestication complete',
        nextActionDate: '2026-02-01',
        createdAt: now,
        updatedAt: now
    }
];

// Seed Alerts - dynamically generated based on case state
export const seedAlerts: Alert[] = [
    {
        id: 'alert1',
        type: 'ASSET_INTEL',
        priority: 'CRITICAL',
        title: 'Suspicious Property Transfer Detected',
        description: '321 Warehouse Lane transferred to MSH Properties LLC for $1 consideration on Oct 15, 2025. Potential fraudulent conveyance.',
        actionLabel: 'Review Transfer',
        actionHref: '/assets',
        status: 'ACTIVE',
        createdAt: now,
        relatedEntityId: 'rp2',
        relatedEntityType: 'asset'
    },
    {
        id: 'alert2',
        type: 'COURT',
        priority: 'IMPORTANT',
        title: 'Motion Response Deadline',
        description: 'Motion to compel Form 1.977 compliance response due in 7 days',
        actionLabel: 'View Task',
        actionHref: '/tasks',
        dueDate: '2026-01-22',
        status: 'ACTIVE',
        createdAt: now,
        relatedEntityId: 't1',
        relatedEntityType: 'task'
    },
    {
        id: 'alert3',
        type: 'COLLECTION',
        priority: 'IMPORTANT',
        title: 'TN Domestication - Action Required',
        description: 'Tennessee domestication pending. File exemplified copy request with Brevard County Clerk.',
        actionLabel: 'Start Domestication',
        actionHref: '/enforcement',
        status: 'ACTIVE',
        createdAt: now,
        relatedEntityId: 't3',
        relatedEntityType: 'task'
    },
    {
        id: 'alert4',
        type: 'ADMINISTRATIVE',
        priority: 'INFORMATIONAL',
        title: 'FL Judgment Lien Not Filed',
        description: 'File judgment lien certificate with FL Secretary of State to protect against junior creditors.',
        actionLabel: 'File Lien',
        actionHref: '/enforcement',
        status: 'ACTIVE',
        createdAt: now
    },
    {
        id: 'alert5',
        type: 'FINANCIAL',
        priority: 'INFORMATIONAL',
        title: 'Interest Accruing Daily',
        description: 'Post-judgment interest at 10% per annum is accruing. Current daily rate: ~$651.63',
        status: 'ACTIVE',
        createdAt: now
    }
];

// Seed Collections (empty - no recoveries yet)
export const seedCollections: CollectionRecord[] = [];

// Seed Judgment Liens (empty - not filed yet)
export const seedJudgmentLiens: JudgmentLien[] = [];
