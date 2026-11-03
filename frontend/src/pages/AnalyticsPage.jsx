import React from 'react';
import { BarChart3, TrendingUp, CheckCircle, AlertTriangle, Lightbulb, Target } from 'lucide-react';

const AnalyticsPage = () => {
  const strongTopics = ['RESTful API Design', 'Data Structures & Algorithms', 'Relational Normalization (3NF)'];
  const weakTopics = ['Concurrency & Deadlocks', 'Distributed Caching (Redis)', 'System Scalability Sharding'];
  const recommendedTopics = ['Operating Systems Concurrency Primitives', 'Microservice Design Patterns', 'SQL Query Optimization'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Performance Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">
          Detailed diagnostic overview of your interview progress and skill mastery.
        </p>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Average</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">8.4 / 10</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pass Ratio</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">85%</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Domain</p>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">Full Stack Dev</h3>
          </div>
        </div>
      </div>

      {/* Strong & Weak Topics Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Topics */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900">Strong Topics (&ge; 8.0/10)</h3>
          </div>
          <ul className="space-y-2.5">
            {strongTopics.map((topic, i) => (
              <li
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs font-semibold text-emerald-900"
              >
                <span>{topic}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white text-emerald-700 border border-emerald-200">
                  Mastered
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weak Topics */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-slate-900">Focus Areas / Weak Topics</h3>
          </div>
          <ul className="space-y-2.5">
            {weakTopics.map((topic, i) => (
              <li
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-xs font-semibold text-rose-900"
              >
                <span>{topic}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white text-rose-700 border border-rose-200">
                  Needs Review
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-brand-50 to-indigo-50 rounded-2xl border border-brand-200 p-6 space-y-3">
        <div className="flex items-center gap-2 text-brand-800">
          <Lightbulb className="w-5 h-5 text-brand-600" />
          <h3 className="font-bold">AI Recommended Next Steps</h3>
        </div>
        <p className="text-xs text-brand-900 leading-relaxed">
          Based on your recent mock interviews, focusing your revision on these 3 concepts will give you the highest score bump in placement evaluations:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {recommendedTopics.map((rec, i) => (
            <span
              key={i}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white text-brand-700 border border-brand-200 shadow-sm"
            >
              &bull; {rec}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
