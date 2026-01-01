'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { AppData, Party, Task, CaseFile, EmailLog, TaskStatus, Counsel, SettlementOffer, CaseConfig } from '../types';
import { seedParties, seedFiles, seedTasks, seedEmails, seedCounsel, seedSettlements, seedCaseConfig } from '../seed-data';

const STORAGE_KEY = 'sjed-app-data';

const initialData: AppData = {
    parties: [],
    tasks: [],
    files: [],
    emails: [],
    counsel: [],
    settlements: [],
    caseConfig: seedCaseConfig,
    initialized: false,
    darkMode: true
};

export function useData() {
    const [data, setData] = useLocalStorage<AppData>(STORAGE_KEY, initialData);

    // Initialize with seed data on first run
    useEffect(() => {
        if (!data.initialized) {
            setData({
                parties: seedParties,
                tasks: seedTasks,
                files: seedFiles,
                emails: seedEmails,
                counsel: seedCounsel,
                settlements: seedSettlements,
                caseConfig: seedCaseConfig,
                initialized: true,
                darkMode: true
            });
        }
    }, [data.initialized, setData]);

    // Toggle dark mode
    const toggleDarkMode = useCallback(() => {
        setData(prev => ({ ...prev, darkMode: !prev.darkMode }));
    }, [setData]);

    // Update case config
    const updateCaseConfig = useCallback((updates: Partial<CaseConfig>) => {
        setData(prev => ({ ...prev, caseConfig: { ...prev.caseConfig, ...updates } }));
    }, [setData]);

    // Calculate interest
    const calculateInterest = useCallback(() => {
        const judgmentDate = new Date(data.caseConfig.judgmentDate);
        const today = new Date();
        const daysElapsed = Math.floor((today.getTime() - judgmentDate.getTime()) / (1000 * 60 * 60 * 24));
        const dailyRate = data.caseConfig.interestRate / 100 / 365;
        return data.caseConfig.judgmentAmount * dailyRate * daysElapsed;
    }, [data.caseConfig]);

    // Party CRUD
    const addParty = useCallback((party: Omit<Party, 'id'>) => {
        const newParty: Party = { ...party, id: `p${Date.now()}` };
        setData(prev => ({ ...prev, parties: [...prev.parties, newParty] }));
        return newParty;
    }, [setData]);

    const updateParty = useCallback((id: string, updates: Partial<Party>) => {
        setData(prev => ({
            ...prev,
            parties: prev.parties.map(p => p.id === id ? { ...p, ...updates } : p)
        }));
    }, [setData]);

    const deleteParty = useCallback((id: string) => {
        setData(prev => ({ ...prev, parties: prev.parties.filter(p => p.id !== id) }));
    }, [setData]);

    // Task CRUD
    const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = new Date().toISOString();
        const newTask: Task = { ...task, id: `t${Date.now()}`, createdAt: now, updatedAt: now };
        setData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
        return newTask;
    }, [setData]);

    const updateTask = useCallback((id: string, updates: Partial<Task>) => {
        setData(prev => ({
            ...prev,
            tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)
        }));
    }, [setData]);

    const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
        updateTask(id, { status });
    }, [updateTask]);

    const deleteTask = useCallback((id: string) => {
        setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
    }, [setData]);

    const assignTaskToCounsel = useCallback((taskId: string, counselId: string) => {
        updateTask(taskId, { assignedCounselId: counselId });
        setData(prev => ({
            ...prev,
            counsel: prev.counsel.map(c =>
                c.id === counselId
                    ? { ...c, tasksAssigned: [...new Set([...c.tasksAssigned, taskId])], updatedAt: new Date().toISOString() }
                    : c
            )
        }));
    }, [updateTask, setData]);

    // File CRUD
    const addFile = useCallback((file: Omit<CaseFile, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = new Date().toISOString();
        const newFile: CaseFile = { ...file, id: `f${Date.now()}`, createdAt: now, updatedAt: now };
        setData(prev => ({ ...prev, files: [...prev.files, newFile] }));
        return newFile;
    }, [setData]);

    const updateFile = useCallback((id: string, updates: Partial<CaseFile>) => {
        setData(prev => ({
            ...prev,
            files: prev.files.map(f => f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f)
        }));
    }, [setData]);

    const deleteFile = useCallback((id: string) => {
        setData(prev => ({ ...prev, files: prev.files.filter(f => f.id !== id) }));
    }, [setData]);

    // Email CRUD
    const addEmail = useCallback((email: Omit<EmailLog, 'id'>) => {
        const newEmail: EmailLog = { ...email, id: `e${Date.now()}` };
        setData(prev => ({ ...prev, emails: [...prev.emails, newEmail] }));
        return newEmail;
    }, [setData]);

    const updateEmail = useCallback((id: string, updates: Partial<EmailLog>) => {
        setData(prev => ({
            ...prev,
            emails: prev.emails.map(e => e.id === id ? { ...e, ...updates } : e)
        }));
    }, [setData]);

    const deleteEmail = useCallback((id: string) => {
        setData(prev => ({ ...prev, emails: prev.emails.filter(e => e.id !== id) }));
    }, [setData]);

    // Counsel CRUD
    const addCounsel = useCallback((counsel: Omit<Counsel, 'id' | 'createdAt' | 'updatedAt' | 'tasksAssigned' | 'emailLog'>) => {
        const now = new Date().toISOString();
        const newCounsel: Counsel = {
            ...counsel,
            id: `c${Date.now()}`,
            tasksAssigned: [],
            emailLog: [],
            createdAt: now,
            updatedAt: now
        };
        setData(prev => ({ ...prev, counsel: [...prev.counsel, newCounsel] }));
        return newCounsel;
    }, [setData]);

    const updateCounsel = useCallback((id: string, updates: Partial<Counsel>) => {
        setData(prev => ({
            ...prev,
            counsel: prev.counsel.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c)
        }));
    }, [setData]);

    const deleteCounsel = useCallback((id: string) => {
        setData(prev => ({ ...prev, counsel: prev.counsel.filter(c => c.id !== id) }));
    }, [setData]);

    // Settlement CRUD
    const addSettlement = useCallback((settlement: Omit<SettlementOffer, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = new Date().toISOString();
        const newSettlement: SettlementOffer = { ...settlement, id: `s${Date.now()}`, createdAt: now, updatedAt: now };
        setData(prev => ({ ...prev, settlements: [...prev.settlements, newSettlement] }));
        return newSettlement;
    }, [setData]);

    const updateSettlement = useCallback((id: string, updates: Partial<SettlementOffer>) => {
        setData(prev => ({
            ...prev,
            settlements: prev.settlements.map(s => s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s)
        }));
    }, [setData]);

    const deleteSettlement = useCallback((id: string) => {
        setData(prev => ({ ...prev, settlements: prev.settlements.filter(s => s.id !== id) }));
    }, [setData]);

    // Search across all entities including file content
    const search = useCallback((query: string) => {
        const q = query.toLowerCase();
        return {
            tasks: data.tasks.filter(t =>
                t.title.toLowerCase().includes(q) ||
                t.description?.toLowerCase().includes(q)
            ),
            files: data.files.filter(f =>
                f.title.toLowerCase().includes(q) ||
                f.notes?.toLowerCase().includes(q) ||
                f.text?.toLowerCase().includes(q) ||
                f.excerpt?.toLowerCase().includes(q)
            ),
            emails: data.emails.filter(e =>
                e.subject.toLowerCase().includes(q) ||
                e.summary.toLowerCase().includes(q)
            ),
            parties: data.parties.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.notes?.toLowerCase().includes(q)
            ),
            counsel: data.counsel.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.firm.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q)
            )
        };
    }, [data]);

    // Get tasks by status
    const getTasksByStatus = useCallback((status: TaskStatus) => {
        return data.tasks.filter(t => t.status === status);
    }, [data.tasks]);

    // Get priority tasks (HIGH priority, not DONE)
    const getPriorityTasks = useCallback((limit = 5) => {
        return data.tasks
            .filter(t => t.priority === 'HIGH' && t.status !== 'DONE')
            .sort((a, b) => {
                const statusOrder = { 'THIS_WEEK': 0, 'IN_PROGRESS': 1, 'WAITING': 2, 'BACKLOG': 3, 'DONE': 4 };
                return statusOrder[a.status] - statusOrder[b.status];
            })
            .slice(0, limit);
    }, [data.tasks]);

    // Get stats by jurisdiction
    const getJurisdictionStats = useCallback(() => {
        const jurisdictions = ['FL', 'TN', 'IN', 'CO'] as const;
        return jurisdictions.map(j => {
            const tasks = data.tasks.filter(t => t.jurisdiction === j);
            const openTasks = tasks.filter(t => t.status !== 'DONE').length;
            const totalTasks = tasks.length;
            const files = data.files.filter(f => f.jurisdiction === j).length;
            const progress = totalTasks > 0 ? Math.round(((totalTasks - openTasks) / totalTasks) * 100) : 0;

            let phase = 'Backlog';
            if (openTasks === 0 && totalTasks > 0) phase = 'Complete';
            else if (tasks.some(t => t.status === 'IN_PROGRESS')) phase = 'Active';
            else if (tasks.some(t => t.status === 'THIS_WEEK')) phase = 'Planning';

            return { jurisdiction: j, openTasks, totalTasks, files, progress, phase };
        });
    }, [data.tasks, data.files]);

    // Get overdue tasks
    const getOverdueTasks = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return data.tasks.filter(t => t.dueDate && t.dueDate < today && t.status !== 'DONE');
    }, [data.tasks]);

    // Get this week's tasks
    const getThisWeekTasks = useMemo(() => {
        return data.tasks.filter(t => t.status === 'THIS_WEEK');
    }, [data.tasks]);

    // Get best settlement offer
    const getBestOffer = useMemo(() => {
        const offers = data.settlements.filter(s => s.status !== 'Rejected');
        if (offers.length === 0) return 0;
        return Math.max(...offers.map(s => s.amount));
    }, [data.settlements]);

    // Get counsel by ID
    const getCounselById = useCallback((id: string) => {
        return data.counsel.find(c => c.id === id);
    }, [data.counsel]);

    return {
        data,
        darkMode: data.darkMode,
        toggleDarkMode,
        caseConfig: data.caseConfig,
        updateCaseConfig,
        calculateInterest,
        parties: data.parties,
        tasks: data.tasks,
        files: data.files,
        emails: data.emails,
        counsel: data.counsel,
        settlements: data.settlements,
        addParty, updateParty, deleteParty,
        addTask, updateTask, updateTaskStatus, deleteTask, assignTaskToCounsel,
        addFile, updateFile, deleteFile,
        addEmail, updateEmail, deleteEmail,
        addCounsel, updateCounsel, deleteCounsel,
        addSettlement, updateSettlement, deleteSettlement,
        search,
        getTasksByStatus,
        getPriorityTasks,
        getJurisdictionStats,
        getOverdueTasks,
        getThisWeekTasks,
        getBestOffer,
        getCounselById
    };
}
