import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, CheckCircle2, AlertTriangle, ArrowLeft, RotateCcw } from 'lucide-react';

const EvaluationPage = () => {
  const { sessionId } = useParams();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Interview Completed
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Mock Interview Performance Report
            </h1>
            <p className="text-xs text-slate-400 mt-1">Session Reference: #{sessionId || 'SIM-8942'}</p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-4xl font-black text-brand-600">8.4</span>
            <span className="text-sm font-bold text-slate-400"> / 10 Overall</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Questions Attempted</span>
            <p className="text-xl font-black text-slate-800">5 / 5</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Accuracy Rate</span>
            <p className="text-xl font-black text-emerald-600">88%</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Communication Clarity</span>
            <p className="text-xl font-black text-indigo-600">8.2 / 10</p>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-base font-bold text-slate-900">Key AI Feedback Summary</h3>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            Great foundation in Data Structures, RESTful APIs, and basic multithreading concepts. To reach top-tier placement readiness, practice explaining edge-case concurrency locks and distributed caching mechanisms.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <Link
            to="/mock-interview"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Another Interview
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EvaluationPage;
