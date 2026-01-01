'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Jurisdiction } from '@/lib/types';
import { Zap, MapPin, AlertTriangle, Clock, CheckCircle, TrendingUp, FileText, Users } from 'lucide-react';

export default function OverviewPage() {
  const {
    getPriorityTasks,
    getJurisdictionStats,
    tasks,
    files,
    counsel,
    caseConfig,
    calculateInterest,
    getOverdueTasks,
    getThisWeekTasks,
    getBestOffer
  } = useData();

  const priorityTasks = getPriorityTasks(5);
  const jurisdictionStats = getJurisdictionStats();
  const interest = useMemo(() => calculateInterest(), [calculateInterest]);
  const overdueTasks = getOverdueTasks;
  const thisWeekTasks = getThisWeekTasks;
  const openTasks = tasks.filter(t => t.status !== 'DONE').length;
  const doneTasks = tasks.filter(t => t.status === 'DONE').length;
  const completionRate = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <JurisdictionBadge jurisdiction="FL" size="lg" showFull />
            <span className="text-slate-400">•</span>
            <span className="text-slate-400 text-sm">Brevard County Circuit Court</span>
            {caseConfig.caseNumber && (
              <>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 text-sm font-mono">{caseConfig.caseNumber}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Good Dogg Beverage Co. <span className="text-slate-400">v.</span> MSH
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-4 py-2">
              <span className="text-emerald-400 font-bold text-2xl">{formatCurrency(caseConfig.judgmentAmount)}</span>
              <span className="text-emerald-400/70 text-sm ml-2">Judgment</span>
            </div>
            <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg px-4 py-2">
              <span className="text-amber-400 font-bold text-xl">+{formatCurrency(interest)}</span>
              <span className="text-amber-400/70 text-sm ml-2">Interest</span>
            </div>
            <div className="flex gap-2">
              <span className="bg-blue-500/20 text-blue-400 text-sm px-3 py-1.5 rounded-lg border border-blue-500/30">
                Post-Judgment
              </span>
              <span className="bg-purple-500/20 text-purple-400 text-sm px-3 py-1.5 rounded-lg border border-purple-500/30">
                Enforcement Ongoing
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <AlertTriangle className={`w-4 h-4 ${overdueTasks.length > 0 ? 'text-red-400' : 'text-slate-500'}`} />
            <span className={`text-2xl font-bold ${overdueTasks.length > 0 ? 'text-red-400' : 'text-white'}`}>
              {overdueTasks.length}
            </span>
          </div>
          <div className="text-xs text-slate-500">Overdue</div>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-2xl font-bold text-white">{thisWeekTasks.length}</span>
          </div>
          <div className="text-xs text-slate-500">This Week</div>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-slate-400" />
            <span className="text-2xl font-bold text-white">{openTasks}</span>
          </div>
          <div className="text-xs text-slate-500">Open</div>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-2xl font-bold text-emerald-400">{completionRate}%</span>
          </div>
          <div className="text-xs text-slate-500">Complete</div>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-2xl font-bold text-purple-400">{formatCurrency(getBestOffer)}</span>
          </div>
          <div className="text-xs text-slate-500">Best Offer</div>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-2xl font-bold text-white">{counsel.filter(c => c.status === 'Active').length}</span>
          </div>
          <div className="text-xs text-slate-500">Active Counsel</div>
        </div>
      </div>

      {/* Next Priority Actions */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Next Priority Actions
          </h2>
          <Link href="/tasks" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
            View all tasks →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {priorityTasks.slice(0, 5).map((task, index) => {
            const linkedFiles = files.filter(f => task.linkedFileIds?.includes(f.id));
            const assignedCounsel = counsel.find(c => c.id === task.assignedCounselId);

            return (
              <div
                key={task.id}
                className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500" />

                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl font-bold text-slate-600">{index + 1}</span>
                  {task.priority && <PriorityBadge priority={task.priority} />}
                </div>

                <h3 className="text-white font-semibold mb-2 line-clamp-2">{task.title}</h3>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {task.jurisdiction && <JurisdictionBadge jurisdiction={task.jurisdiction} />}
                  {task.dueDate && (
                    <span className="text-xs text-slate-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Automation hints */}
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-1">
                  {linkedFiles.length > 0 && (
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {linkedFiles.length} linked file{linkedFiles.length !== 1 ? 's' : ''}
                    </p>
                  )}
                  {assignedCounsel && (
                    <p className="text-xs text-blue-400 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {assignedCounsel.name}
                    </p>
                  )}
                  {task.category === 'DOMESTICATION' && !assignedCounsel && (
                    <p className="text-xs text-amber-400">💡 Need local counsel</p>
                  )}
                </div>

                <Link
                  href="/tasks"
                  className="mt-4 inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Open →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Enforcement Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            Enforcement by Jurisdiction
          </h2>
          <Link href="/enforcement" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
            View details →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {jurisdictionStats.map((stat) => {
            const phaseColors: Record<string, string> = {
              'Complete': 'text-emerald-400',
              'Active': 'text-amber-400',
              'Planning': 'text-blue-400',
              'Backlog': 'text-slate-400',
            };

            return (
              <div
                key={stat.jurisdiction}
                className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <JurisdictionBadge jurisdiction={stat.jurisdiction as Jurisdiction} size="lg" showFull />
                  <span className={`text-sm font-medium ${phaseColors[stat.phase]}`}>
                    {stat.phase}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Open Tasks</span>
                    <span className="text-white font-medium">{stat.openTasks}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Files</span>
                    <span className="text-white font-medium">{stat.files}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-slate-500">Progress</span>
                    <span className="text-xs text-slate-400">{stat.progress}%</span>
                  </div>
                </div>

                <Link
                  href="/enforcement"
                  className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View →
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
