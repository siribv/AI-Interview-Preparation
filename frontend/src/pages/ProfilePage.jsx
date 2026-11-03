import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Mail, School, Briefcase, Award, Save } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    college: '',
    degree: '',
    target_role: '',
  });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        college: user.college || '',
        degree: user.degree || 'B.Tech CSE-AI',
        target_role: user.target_role || 'Full Stack Developer',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });
    setLoading(true);

    try {
      const response = await api.put('/auth/profile', {
        full_name: formData.full_name,
        college: formData.college,
        degree: formData.degree,
        target_role: formData.target_role,
      });

      if (response.data.success) {
        updateUserProfile(response.data.user);
        setStatusMsg({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setStatusMsg({ type: 'error', text: response.data.message || 'Could not update profile.' });
      }
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Server error while updating profile.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your academic details and career target role.
        </p>
      </div>

      {statusMsg.text && (
        <AlertMessage
          type={statusMsg.type}
          message={statusMsg.text}
          onClose={() => setStatusMsg({ type: '', text: '' })}
        />
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  name="email"
                  disabled
                  value={formData.email}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Email cannot be changed</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                College / Institution
              </label>
              <div className="relative">
                <School className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="e.g. University College of Engineering"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Degree & Branch
              </label>
              <div className="relative">
                <Award className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech CSE (Artificial Intelligence)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Target Job Role
              </label>
              <div className="relative">
                <Briefcase className="w-5 h-5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <select
                  name="target_role"
                  value={formData.target_role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm bg-white"
                >
                  <option value="Java Developer">Java Developer</option>
                  <option value="Python Developer">Python Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="AI Engineer">AI Engineer</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
