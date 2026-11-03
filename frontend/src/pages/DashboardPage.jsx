import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Sparkles, 
  Award, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  Briefcase, 
  TrendingUp,
  BarChart3
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    progressPercentage: 15,
    recentHistory: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Attempt to fetch real sessions / stats if API is ready
        const res = await api.get('/analytics/dashboard').catch(() => null);
        if (res && res.data && res.data.success) {
          setStats(res.data.stats);
        } else {
          // Default initial student stats for first login
          setStats({
            totalInterviews: 0,
            averageScore: 0,
            progressPercentage: 10,
            recentHistory: [],
          });
        }
      } catch (err) {
        console.warn('Dashboard stats fallback applied:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading student dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-brand-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-brand-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Interview Preparation Dashboard
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name || 'Student'}! 🚀
          </h1>
          <p className="text-brand-100 text-sm max-w-xl">
            Targeting: <span className="font-semibold text-white">{user?.target_role || 'Full Stack Developer'}</span> &bull; 
            {user?.college ? ` ${user.college}` : ' CSE-AI Department'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/mock-interview"
            className="px-5 py-3 rounded-xl bg-white text-brand-700 font-bold hover:bg-brand-50 transition-colors shadow-sm flex items-center gap-2 text-sm"
          >
            Start Mock Interview
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/roles"
            className="px-5 py-3 rounded-xl bg-brand-500/40 hover:bg-brand-500/60 text-white font-semibold backdrop-blur-md transition-colors text-sm"
          >
            Browse Roles
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Mock Sessions</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stats.totalInterviews}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Score</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
              {stats.averageScore ? `${stats.averageScore} / 10` : 'N/A'}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Readiness</p>
              <span className="text-xs font-bold text-indigo-600">{stats.progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Role</p>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5 truncate max-w-[150px]">
              {user?.target_role || 'Full Stack'}
            </h3>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Quick Actions & Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Sessions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-600" />
              Recent Interview Sessions
            </h2>
            <Link to="/analytics" className="text-xs font-semibold text-brand-600 hover:underline">
              View All History
            </Link>
          </div>

          {stats.recentHistory.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-700">No mock interviews recorded yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Ready to test your skills? Choose a role or launch a simulation session right now.
              </p>
              <div className="pt-2">
                <Link
                  to="/mock-interview"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors"
                >
                  Start First Session
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.recentHistory.map((session) => (
                <div key={session.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{session.role_name}</h4>
                    <p className="text-xs text-slate-400">{session.started_at}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Score: {session.overall_score} / 10
                    </span>
                    <Link
                      to={`/evaluation/${session.id}`}
                      className="text-xs font-semibold text-brand-600 hover:underline"
                    >
                      Report &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Launch Prep */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Quick Practice
          </h2>
          <p className="text-xs text-slate-500">
            Pick a specialized domain to generate tailored questions with varying difficulties.
          </p>

          <div className="space-y-2.5 pt-2">
            {[
              { name: 'Java Developer', path: '/practice?role=java-developer' },
              { name: 'Python Developer', path: '/practice?role=python-developer' },
              { name: 'Frontend Developer', path: '/practice?role=frontend-developer' },
              { name: 'Machine Learning & AI', path: '/practice?role=ai-engineer' },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 transition-all text-xs font-semibold text-slate-700 hover:text-brand-700"
              >
                <span>{item.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              to="/roles"
              className="block text-center text-xs font-bold text-brand-600 hover:text-brand-800"
            >
              Explore all 8 supported roles &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
