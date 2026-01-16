'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { AlertPanel } from '@/components/ui/AlertPanel';
import { Jurisdiction } from '@/lib/types';
import {
  Scale, MapPin, AlertTriangle, Clock, CheckCircle, TrendingUp, FileText, Users,
  DollarSign, Target, Calendar, ArrowUpRight, RefreshCw, Send, ChevronRight,
  Gavel, Building2, PieChart, Briefcase, Shield, Brain, Activity
} from 'lucide-react';

export default function OverviewPage() {
  const {
    getPriorityTasks,
    getJurisdictionStats,
    tasks,
    caseConfig,
    calculateInterest,
    getOverdueTasks,
    getThisWeekTasks,
    alerts,
    dismissAlert,
    snoozeAlert,
    getDaysSinceJudgment,
    getDailyInterest,
    getAmountCollected,
    getOutstandingBalance,
    getRecoveryProbability,
    getTotalKnownAssets,
    enforcementActions,
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

  // Get domestication progress
  const domesticationProgress = useMemo(() => {
    const domesticationTasks = tasks.filter(t => t.category === 'DOMESTICATION');
    const completed = domesticationTasks.filter(t => t.status === 'DONE').length;
    const total = domesticationTasks.length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#23313E] mb-2">Case Overview</h1>
          <p className="text-[#5a6a7a]">Good Dogg Beverage Co. v. Management Services Holdings, LLC</p>
        </div>

        {/* Hero Case Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#C7A252]/15 rounded-xl flex items-center justify-center">
                  <Scale className="w-6 h-6 text-[#C7A252]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <JurisdictionBadge jurisdiction="FL" size="sm" />
                    <span className="text-[#5a6a7a] text-sm">Brevard County Circuit Court</span>
                  </div>
                  <span className="text-[#8a95a3] text-sm font-mono">{caseConfig.caseNumber}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#22C55E]/10 text-[#22C55E] text-sm font-medium rounded-full">
                  Post-Judgment
                </span>
                <span className="px-3 py-1 bg-[#C7A252]/15 text-[#C7A252] text-sm font-medium rounded-full">
                  Enforcement Active
                </span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center px-4 py-3 bg-[#F8F9FA] rounded-xl">
                <div className="text-2xl font-bold text-[#23313E]">{formatCurrency(caseConfig.judgmentAmount)}</div>
                <div className="text-xs text-[#8a95a3] uppercase tracking-wide font-medium">Judgment</div>
              </div>
              <div className="text-center px-4 py-3 bg-[#C7A252]/10 rounded-xl">
                <div className="text-2xl font-bold text-[#C7A252]">+{formatCurrency(interest)}</div>
                <div className="text-xs text-[#8a95a3] uppercase tracking-wide font-medium">Interest</div>
              </div>
              <div className="text-center px-4 py-3 bg-[#F8F9FA] rounded-xl">
                <div className="text-2xl font-bold text-[#23313E]">{formatCurrency(getOutstandingBalance)}</div>
                <div className="text-xs text-[#8a95a3] uppercase tracking-wide font-medium">Total Due</div>
              </div>
              <div className="text-center px-4 py-3 bg-[#22C55E]/10 rounded-xl">
                <div className="text-2xl font-bold text-[#22C55E]">{getRecoveryProbability}%</div>
                <div className="text-xs text-[#8a95a3] uppercase tracking-wide font-medium">Recovery</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm hover:border-[#C7A252] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#3B82F6]/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <span className="text-sm text-[#8a95a3]">Days Since Judgment</span>
            </div>
            <div className="text-3xl font-bold text-[#23313E]">{getDaysSinceJudgment}</div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm hover:border-[#C7A252] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#22C55E]" />
              </div>
              <span className="text-sm text-[#8a95a3]">Collected</span>
            </div>
            <div className="text-3xl font-bold text-[#22C55E]">{formatCurrency(getAmountCollected)}</div>
            <div className="text-xs text-[#8a95a3] mt-1">
              {((getAmountCollected / caseConfig.judgmentAmount) * 100).toFixed(1)}% of judgment
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm hover:border-[#C7A252] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#C7A252]/15 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#C7A252]" />
              </div>
              <span className="text-sm text-[#8a95a3]">Daily Interest</span>
            </div>
            <div className="text-3xl font-bold text-[#C7A252]">+{formatCurrencyDetailed(getDailyInterest)}</div>
            <div className="text-xs text-[#8a95a3] mt-1">{caseConfig.interestRate}% per annum</div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm hover:border-[#C7A252] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#8B5CF6]/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <span className="text-sm text-[#8a95a3]">Known Assets</span>
            </div>
            <div className="text-3xl font-bold text-[#8B5CF6]">{formatCurrency(getTotalKnownAssets)}</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Alerts & Tasks */}
          <div className="lg:col-span-2 space-y-6">

            {/* Active Alerts */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#23313E] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
                  Active Alerts
                </h2>
                <span className="px-2 py-1 bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-medium rounded-full">
                  {alerts.filter(a => a.status === 'ACTIVE').length} pending
                </span>
              </div>
              <div className="p-4">
                <AlertPanel
                  alerts={alerts}
                  onDismiss={dismissAlert}
                  onSnooze={snoozeAlert}
                  maxAlerts={4}
                />
              </div>
            </div>

            {/* Priority Tasks */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#23313E] flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                  Priority Tasks
                </h2>
                <Link href="/tasks" className="text-sm text-[#C7A252] hover:text-[#a88b43] font-medium flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-[#E5E7EB]">
                {priorityTasks.slice(0, 5).filter(task => task.jurisdiction && task.priority).map((task) => (
                  <div key={task.id} className="px-6 py-4 hover:bg-[#F8F9FA] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <JurisdictionBadge jurisdiction={task.jurisdiction!} />
                        <span className="font-medium text-[#23313E]">{task.title}</span>
                      </div>
                      <PriorityBadge priority={task.priority!} />
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center gap-1 mt-2 text-sm text-[#8a95a3]">
                        <Clock className="w-4 h-4" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-[#23313E] mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link href="/documents" className="flex flex-col items-center gap-2 p-4 bg-[#F8F9FA] hover:bg-[#C7A252]/10 rounded-xl transition-all group">
                  <FileText className="w-6 h-6 text-[#5a6a7a] group-hover:text-[#C7A252]" />
                  <span className="text-sm font-medium text-[#23313E]">Generate Doc</span>
                </Link>
                <Link href="/enforcement" className="flex flex-col items-center gap-2 p-4 bg-[#F8F9FA] hover:bg-[#C7A252]/10 rounded-xl transition-all group">
                  <Gavel className="w-6 h-6 text-[#5a6a7a] group-hover:text-[#C7A252]" />
                  <span className="text-sm font-medium text-[#23313E]">New Action</span>
                </Link>
                <Link href="/examination" className="flex flex-col items-center gap-2 p-4 bg-[#F8F9FA] hover:bg-[#C7A252]/10 rounded-xl transition-all group">
                  <Users className="w-6 h-6 text-[#5a6a7a] group-hover:text-[#C7A252]" />
                  <span className="text-sm font-medium text-[#23313E]">Debtor Exam</span>
                </Link>
                <Link href="/settle" className="flex flex-col items-center gap-2 p-4 bg-[#F8F9FA] hover:bg-[#C7A252]/10 rounded-xl transition-all group">
                  <DollarSign className="w-6 h-6 text-[#5a6a7a] group-hover:text-[#C7A252]" />
                  <span className="text-sm font-medium text-[#23313E]">Settlement</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Jurisdictions & Status */}
          <div className="space-y-6">

            {/* Jurisdiction Progress */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5E7EB]">
                <h2 className="text-lg font-semibold text-[#23313E] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#C7A252]" />
                  Jurisdictions
                </h2>
              </div>
              <div className="p-4 space-y-4">
                {jurisdictionStats.map((stat) => (
                  <div key={stat.jurisdiction} className="bg-[#F8F9FA] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <JurisdictionBadge jurisdiction={stat.jurisdiction as Jurisdiction} showFull />
                      </div>
                      <span className="text-sm font-semibold text-[#23313E]">{stat.progress}%</span>
                    </div>
                    <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C7A252] to-[#d4b76c] rounded-full transition-all"
                        style={{ width: `${stat.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-[#8a95a3]">
                      <span>{stat.openTasks} open tasks</span>
                      <span>{stat.files} files</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enforcement Status */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5E7EB]">
                <h2 className="text-lg font-semibold text-[#23313E] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#3B82F6]" />
                  Enforcement Status
                </h2>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#22C55E]/10 rounded-lg">
                  <span className="text-sm text-[#23313E]">Active Actions</span>
                  <span className="font-semibold text-[#22C55E]">
                    {enforcementActions.filter(a => a.status !== 'terminated' && a.status !== 'collected').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-lg">
                  <span className="text-sm text-[#23313E]">Open Tasks</span>
                  <span className="font-semibold text-[#23313E]">{openTasks}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-lg">
                  <span className="text-sm text-[#23313E]">Completed</span>
                  <span className="font-semibold text-[#22C55E]">{doneTasks}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#EF4444]/10 rounded-lg">
                  <span className="text-sm text-[#23313E]">Overdue</span>
                  <span className="font-semibold text-[#EF4444]">{overdueTasks.length}</span>
                </div>
              </div>
            </div>

            {/* Module Links */}
            <div className="bg-[#23313E] rounded-xl overflow-hidden shadow-lg">
              <div className="px-6 py-4 border-b border-[#2d3e4d]">
                <h2 className="text-lg font-semibold text-white">Modules</h2>
              </div>
              <div className="p-4 space-y-2">
                {[
                  { href: '/assets', label: 'Asset Intelligence', icon: Target },
                  { href: '/strategy', label: 'AI Strategy Engine', icon: Brain },
                  { href: '/liens', label: 'Lien Registry', icon: Shield },
                  { href: '/bankruptcy', label: 'Bankruptcy Defense', icon: Scale },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 p-3 hover:bg-[#2d3e4d] rounded-lg transition-colors group"
                  >
                    <div className="w-8 h-8 bg-[#C7A252]/20 rounded-lg flex items-center justify-center group-hover:bg-[#C7A252]/30">
                      <item.icon className="w-4 h-4 text-[#C7A252]" />
                    </div>
                    <span className="text-white font-medium">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-[#5a6a7a] ml-auto group-hover:text-[#C7A252]" />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
