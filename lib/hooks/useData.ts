'use client';

import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { AppData, Party, Task, CaseFile, EmailLog, TaskStatus } from '../types';
import { seedParties, seedFiles, seedTasks, seedEmails } from '../seed-data';

const STORAGE_KEY = 'sjed-app-data';

const initialData: AppData = {
    parties: [],
    tasks: [],
    files: [],
    emails: [],
    initialized: false
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
                initialized: true
            });
        }
    }, [data.initialized, setData]);

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

    // Search across all entities
    const search = useCallback((query: string) => {
        const q = query.toLowerCase();
        return {
            tasks: data.tasks.filter(t =>
                t.title.toLowerCase().includes(q) ||
                t.description?.toLowerCase().includes(q)
            ),
            files: data.files.filter(f =>
                f.title.toLowerCase().includes(q) ||
                f.notes?.toLowerCase().includes(q)
            ),
            emails: data.emails.filter(e =>
                e.subject.toLowerCase().includes(q) ||
                e.summary.toLowerCase().includes(q)
            ),
            parties: data.parties.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.notes?.toLowerCase().includes(q)
            )
        };
    }, [data]);

    // Get tasks by status
    const getTasksByStatus = useCallback((status: TaskStatus) => {
        return data.tasks.filter(t => t.status === status);
    }, [data.tasks]);

    // Get priority tasks (HIGH priority, not DONE)
    const getPriorityTasks = useCallback((limit = 3) => {
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

    return {
        data,
        parties: data.parties,
        tasks: data.tasks,
        files: data.files,
        emails: data.emails,
        addParty, updateParty, deleteParty,
        addTask, updateTask, updateTaskStatus, deleteTask,
        addFile, updateFile, deleteFile,
        addEmail, updateEmail, deleteEmail,
        search,
        getTasksByStatus,
        getPriorityTasks,
        getJurisdictionStats
    };
}
