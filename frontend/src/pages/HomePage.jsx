import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Cpu, Target, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: 'Targeted Job Roles',
      desc: 'Java, Python, Frontend, Backend, Full Stack, Data Analyst, Machine Learning, and AI Engineer.',
      icon: <Target className="w-6 h-6 text-brand-600" />,
    },
    {
      title: 'Real-time AI Evaluation',
      desc: 'Instant scoring out of 10, conceptual accuracy breakdown, missing concepts, and ideal answers.',
      icon: <Cpu className="w-6 h-6 text-indigo-600" />,
    },
    {
      title: 'Simulated Mock Interviews',
      desc: 'Realistic full-length interview rounds with adaptive difficulty from Beginner to Advanced.',
      icon: <Award className="w-6 h-6 text-emerald-600" />,
    },
    {
      title: 'Performance Analytics',
      desc: 'Track strong vs. weak topics, preparation progress, and actionable study recommendations.',
      icon: <ShieldCheck className="w-6 h-6 text-amber-600" />,
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Empowering CSE & AI Students
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Master Your Next Tech Interview with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
              AI-Powered Feedback
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed">
            Practice role-specific technical questions, receive instant semantic feedback, 
            learn missing concepts, and track your readiness before campus placements.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 group transition-all"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 group transition-all"
                >
                  Start Practicing for Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-sm transition-all"
                >
                  Existing Student Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Engineered for Campus Placements & Tech Careers
          </h2>
          <p className="mt-3 text-slate-600">
            Everything you need to turn interview anxiety into confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-brand-200 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
