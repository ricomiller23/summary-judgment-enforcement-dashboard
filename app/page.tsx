'use client';

import Link from 'next/link';
import { useData } from '@/lib/hooks/useData';
import { JurisdictionBadge } from '@/components/ui/JurisdictionBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Jurisdiction } from '@/lib/types';

export default function OverviewPage() {
  const { getPriorityTasks, getJurisdictionStats, tasks } = useData();

  const priorityTasks = getPriorityTasks(3);
  const jurisdictionStats = getJurisdictionStats();

  const judgmentAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(2378443.28);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <JurisdictionBadge jurisdiction="FL" size="lg" showFull />
            <span className="text-slate-400">•</span>
            <span className="text-slate-400 text-sm">Brevard County Circuit Court</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Good Dogg Beverage Co. <span className="text-slate-400">v.</span> MSH
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-4 py-2">
              <span className="text-emerald-400 font-bold text-2xl">{judgmentAmount}</span>
              <span className="text-emerald-400/70 text-sm ml-2">Default Final Judgment</span>
            </div>
            <div className="flex gap-2">
              <span className="bg-blue-500/20 text-blue-400 text-sm px-3 py-1.5 rounded-lg border border-blue-500/30">
                Post-Judgment
              </span>
              <span className="bg-amber-500/20 text-amber-400 text-sm px-3 py-1.5 rounded-lg border border-amber-500/30">
                Enforcement Ongoing
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Next 3 Moves */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Next 3 Moves
          </h2>
          <Link href="/tasks" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
            View all tasks →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {priorityTasks.map((task, index) => (
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

              <div className="flex items-center gap-2 mt-3">
                {task.jurisdiction && <JurisdictionBadge jurisdiction={task.jurisdiction} />}
                {task.dueDate && (
                  <span className="text-xs text-slate-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              <Link
                href="/tasks"
                className="mt-4 inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Open
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Enforcement Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
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

                {/* Progress Bar */}
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
                  View
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Stats Footer */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{tasks.filter(t => t.status !== 'DONE').length}</div>
          <div className="text-sm text-slate-400">Open Tasks</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">4</div>
          <div className="text-sm text-slate-400">Jurisdictions</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">{judgmentAmount}</div>
          <div className="text-sm text-slate-400">Judgment Amount</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{tasks.filter(t => t.priority === 'HIGH').length}</div>
          <div className="text-sm text-slate-400">High Priority</div>
        </div>
      </div>
    </div>
  );
}
