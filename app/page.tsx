'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { AlertPanel } from '@/components/ui/AlertPanel';
import { Jurisdiction } from '@/lib/types';
import {
  Zap, MapPin, AlertTriangle, Clock, CheckCircle, TrendingUp, FileText, Users,
  DollarSign, Target, Calendar, ArrowUpRight, RefreshCw, Send, Search as SearchIcon,
  Gavel, Building2, PieChart
} from 'lucide-react';

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
    getBestOffer,
    // New data
    alerts,
    dismissAlert,
    snoozeAlert,
    getDaysSinceJudgment,
    getDailyInterest,
    getAmountCollected,
    getOutstandingBalance,
    getRecoveryProbability,
    getTotalKnownAssets,
    assetIntelligence,
    enforcementActions,
    lastDataRefresh
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

  const formatCurrencyDetailed = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

  // Recovery probability color
  const getProbabilityColor = (score: number) => {
    if (score >= 70) return 'text-emerald-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  const getProbabilityBg = (score: number) => {
    if (score >= 70) return 'from-emerald-500 to-emerald-400';
    if (score >= 40) return 'from-amber-500 to-amber-400';
    return 'from-red-500 to-red-400';
  };

  // Get domestication progress
  const domesticationProgress = useMemo(() => {
    const domesticationTasks = tasks.filter(t => t.category === 'DOMESTICATION');
    const completed = domesticationTasks.filter(t => t.status === 'DONE').length;
    const total = domesticationTasks.length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [tasks]);

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
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-4 py-2">
              <span className="text-blue-400 font-bold text-xl">{formatCurrency(getOutstandingBalance)}</span>
              <span className="text-blue-400/70 text-sm ml-2">Total Due</span>
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

      {/* Main Grid - Dashboard + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Metrics & Widgets */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Recovery Probability Gauge */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="28" strokeWidth="6" fill="none" className="stroke-slate-700" />
                  <circle
                    cx="32" cy="32" r="28" strokeWidth="6" fill="none"
                    className={`stroke-current ${getProbabilityColor(getRecoveryProbability)}`}
                    strokeLinecap="round"
                    strokeDasharray={`${getRecoveryProbability * 1.76} 176`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-lg font-bold ${getProbabilityColor(getRecoveryProbability)}`}>
                    {getRecoveryProbability}%
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-500">Recovery Probability</div>
            </div>

            {/* Days Since Judgment */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-2xl font-bold text-white">{getDaysSinceJudgment}</span>
              </div>
              <div className="text-xs text-slate-500">Days Since Judgment</div>
            </div>

            {/* Amount Collected */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-2xl font-bold text-emerald-400">{formatCurrency(getAmountCollected)}</span>
              </div>
              <div className="text-xs text-slate-500">Collected</div>
              <div className="text-[10px] text-slate-600 mt-1">
                {((getAmountCollected / caseConfig.judgmentAmount) * 100).toFixed(1)}% of judgment
              </div>
            </div>

            {/* Daily Interest */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span className="text-xl font-bold text-amber-400">+{formatCurrencyDetailed(getDailyInterest)}</span>
              </div>
              <div className="text-xs text-slate-500">Daily Interest</div>
              <div className="text-[10px] text-slate-600 mt-1">{caseConfig.interestRate}% per annum</div>
            </div>
          </div>

          {/* Secondary Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                <Building2 className="w-4 h-4 text-blue-400" />
                <span className="text-2xl font-bold text-white">{formatCurrency(getTotalKnownAssets)}</span>
              </div>
              <div className="text-xs text-slate-500">Known Assets</div>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-2xl font-bold text-emerald-400">{completionRate}%</span>
              </div>
              <div className="text-xs text-slate-500">Tasks Complete</div>
            </div>
          </div>

          {/* Domestication Progress */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Gavel className="w-4 h-4 text-blue-400" />
                Domestication Progress
              </h3>
              <span className="text-sm text-slate-400">
                {domesticationProgress.completed}/{domesticationProgress.total} states
              </span>
            </div>
            <div className="flex gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-xs text-slate-400">FL</span>
                <CheckCircle className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="text-xs text-slate-400">TN</span>
                <span className="text-[10px] text-amber-400">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                <span className="text-xs text-slate-400">IN</span>
                <span className="text-[10px] text-slate-500">Planned</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                <span className="text-xs text-slate-400">CO</span>
                <span className="text-[10px] text-slate-500">Planned</span>
              </div>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all"
                style={{ width: `${domesticationProgress.percentage}%` }}
              />
            </div>
            {domesticationProgress.percentage === 0 && (
              <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-xs text-amber-400">
                  ⚠️ BLOCKED: Missing exemplified script from Brevard County
                </p>
                <Link href="/enforcement" className="text-xs text-blue-400 hover:underline mt-1 inline-block">
                  Generate request letter →
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions Bar */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              <Link href="/enforcement" className="flex flex-col items-center gap-1 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                <Send className="w-5 h-5 text-blue-400" />
                <span className="text-xs text-slate-300">Demand Letter</span>
              </Link>
              <Link href="/enforcement" className="flex flex-col items-center gap-1 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                <Gavel className="w-5 h-5 text-purple-400" />
                <span className="text-xs text-slate-300">File Garnishment</span>
              </Link>
              <Link href="/assets" className="flex flex-col items-center gap-1 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                <SearchIcon className="w-5 h-5 text-emerald-400" />
                <span className="text-xs text-slate-300">Asset Search</span>
              </Link>
              <Link href="/examination" className="flex flex-col items-center gap-1 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                <FileText className="w-5 h-5 text-amber-400" />
                <span className="text-xs text-slate-300">Debtor Exam</span>
              </Link>
              <Link href="/settle" className="flex flex-col items-center gap-1 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-xs text-slate-300">Settlement</span>
              </Link>
              <Link href="/reports" className="flex flex-col items-center gap-1 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                <PieChart className="w-5 h-5 text-pink-400" />
                <span className="text-xs text-slate-300">Reports</span>
              </Link>
            </div>
          </div>

          {/* Next Priority Actions */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                Next Priority Actions
              </h2>
              <Link href="/tasks" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                View all tasks →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {priorityTasks.slice(0, 4).map((task, index) => {
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
        </div>

        {/* Right Column - Alerts */}
        <div className="space-y-6">
          <AlertPanel
            alerts={alerts}
            onDismiss={dismissAlert}
            onSnooze={snoozeAlert}
            maxAlerts={6}
          />

          {/* Last Updated */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <RefreshCw className="w-3 h-3" />
                <span>
                  Updated: {new Date(lastDataRefresh).toLocaleTimeString()}
                </span>
              </div>
              <button className="text-xs text-blue-400 hover:text-blue-300">
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

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
