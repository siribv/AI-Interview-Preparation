import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Coffee, 
  Terminal, 
  Layout, 
  Server, 
  Layers, 
  BarChart3, 
  Cpu, 
  Sparkles, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const iconMap = {
  Coffee: <Coffee className="w-6 h-6 text-amber-600" />,
  Terminal: <Terminal className="w-6 h-6 text-sky-600" />,
  Layout: <Layout className="w-6 h-6 text-blue-600" />,
  Server: <Server className="w-6 h-6 text-emerald-600" />,
  Layers: <Layers className="w-6 h-6 text-indigo-600" />,
  BarChart3: <BarChart3 className="w-6 h-6 text-violet-600" />,
  Cpu: <Cpu className="w-6 h-6 text-rose-600" />,
  Sparkles: <Sparkles className="w-6 h-6 text-brand-600" />,
};

const defaultRoleList = [
  { id: 1, role_name: "Java Developer", slug: "java-developer", description: "Core Java, OOP, Collections, Multithreading, Spring Boot, Microservices, Hibernate, and SQL.", icon: "Coffee", primary_skills: ["Java", "Spring Boot", "Microservices", "Hibernate", "SQL"] },
  { id: 2, role_name: "Python Developer", slug: "python-developer", description: "Python fundamentals, Data Structures, OOP, Django/Flask, RESTful APIs, and Database query design.", icon: "Terminal", primary_skills: ["Python", "Django", "Flask", "Data Structures", "PostgreSQL"] },
  { id: 3, role_name: "Frontend Developer", slug: "frontend-developer", description: "HTML5, CSS3, JavaScript (ES6+), React.js, Responsive Design, State Management, and Web Performance.", icon: "Layout", primary_skills: ["HTML5", "CSS3", "JavaScript", "React.js", "Tailwind CSS"] },
  { id: 4, role_name: "Backend Developer", slug: "backend-developer", description: "System design, REST & GraphQL APIs, Database normalization, Caching, Authentication, and Scalability.", icon: "Server", primary_skills: ["Node.js", "Express", "Python/Flask", "PostgreSQL", "Redis", "Docker"] },
  { id: 5, role_name: "Full Stack Developer", slug: "full-stack-developer", description: "End-to-end web architecture, Frontend UI, Backend APIs, Database integration, and Deployment pipelines.", icon: "Layers", primary_skills: ["React.js", "Node.js", "Python", "REST APIs", "MySQL", "Git"] },
  { id: 6, role_name: "Data Analyst", slug: "data-analyst", description: "SQL querying, Pandas, NumPy, Data Cleaning, Exploratory Data Analysis (EDA), Tableau/PowerBI, and Statistics.", icon: "BarChart3", primary_skills: ["SQL", "Python", "Pandas", "NumPy", "PowerBI", "Statistics"] },
  { id: 7, role_name: "Machine Learning Engineer", slug: "machine-learning-engineer", description: "Supervised/Unsupervised ML algorithms, Scikit-Learn, Feature Engineering, Model Evaluation, and Deployment.", icon: "Cpu", primary_skills: ["Scikit-Learn", "TensorFlow", "PyTorch", "Feature Engineering", "MLOps"] },
  { id: 8, role_name: "AI Engineer", slug: "ai-engineer", description: "Deep Learning, NLP, Large Language Models (LLMs), Prompt Engineering, Vector Databases, and Retrieval-Augmented Generation (RAG).", icon: "Sparkles", primary_skills: ["LLMs", "PyTorch", "LangChain", "RAG", "Embeddings", "Transformers"] },
];

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState(defaultRoleList);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [difficulty, setDifficulty] = useState('beginner');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get('/roles');
        if (response.data && response.data.roles && response.data.roles.length > 0) {
          setRoles(response.data.roles);
        }
      } catch (err) {
        console.warn('Using client-side job role definitions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleStartPractice = (role) => {
    navigate(`/practice?roleId=${role.id}&slug=${role.slug}&difficulty=${difficulty}`);
  };

  const handleStartMock = (role) => {
    navigate(`/mock-interview?roleId=${role.id}&slug=${role.slug}&difficulty=${difficulty}`);
  };

  if (loading) {
    return <LoadingSpinner text="Fetching job roles..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Select Your Target Job Role
        </h1>
        <p className="text-sm text-slate-600">
          Choose a domain to practice curated technical & HR questions, or launch a complete AI-evaluated mock interview.
        </p>

        {/* Global Difficulty Selector */}
        <div className="inline-flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl mt-4">
          {['beginner', 'intermediate', 'advanced'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDifficulty(lvl)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                difficulty === lvl
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-brand-300 hover:shadow-lg transition-all group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                {iconMap[role.icon] || <Sparkles className="w-6 h-6 text-brand-600" />}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-brand-600 transition-colors">
                  {role.role_name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                  {role.description}
                </p>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {(Array.isArray(role.primary_skills)
                  ? role.primary_skills
                  : role.primary_skills?.split(', ') || []
                ).slice(0, 4).map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-100 mt-6 space-y-2">
              <button
                onClick={() => handleStartMock(role)}
                className="w-full py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
              >
                Mock Interview
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleStartPractice(role)}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
              >
                Practice Questions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleSelectionPage;
